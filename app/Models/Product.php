<?php

namespace App\Models;

use App\Enums\ProductStatus;
use App\Traits\AuditableTrait;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Pagination\LengthAwarePaginator;
use OwenIt\Auditing\Contracts\Auditable;
use Staudenmeir\EloquentHasManyDeep\HasManyDeep;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

class Product extends Model implements Auditable
{
    use AuditableTrait, HasFactory, HasRelationships;

    protected $fillable = [
        'name',
        'sku_prefix',
        'category_id',
        'description',
        'status',
        'stock_threshold'
    ];

    protected $casts = [
        'status' => ProductStatus::class
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orders(): HasManyDeep
    {
        return $this->hasManyDeep(
            Order::class,
            [ProductVariant::class, OrderVariant::class],
            ['product_id', 'product_variant_id', 'id'],
            ['id', 'id', 'order_id']
        );
    }

    public function orderVariants(): HasManyThrough
    {
        return $this->hasManyThrough(OrderVariant::class, ProductVariant::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    /**
     * Accessor to get stock status based on total stock.
     */
    public function getAvailabilityAttribute(): string
    {   
        // TODO: update this with initial and remaining stock
        $totalStock = $this->variants_sum_quantity;

        $threshold = $this->stock_threshold;
        if (!$threshold) {
            $threshold = $totalStock * 0.2;
        }

        if ($totalStock <= 0) {
            return 'out of stock';
        } else if ($totalStock <= $threshold) {
            return 'stock low';
        }

        return 'available';
    }

    /**
     * Scope a query to only include active products.
     *
     * @param  Builder $query
     * @return Builder
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', ProductStatus::ACTIVE->value);
    }

    /**
     * Scope a query to only include inactive products.
     *
     * @param  Builder $query
     * @return Builder
     */
    public function scopeInactive(Builder $query): Builder
    {
        return $query->where('status', ProductStatus::INACTIVE->value);
    }

    /**
     * Scope a query to search products based on given search query.
     *
     * @param  Builder $query
     * @param  string|null $search
     * @return Builder
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!empty($search)) {
            return $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku_prefix', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        return $query;
    }

    /**
     * Filter and sort products based on given parameters.
     *
     * @param  array $params
     * @return LengthAwarePaginator
     */
    public static function filterAndSort(array $params): LengthAwarePaginator
    {
        return self::query()
            ->with(['category:id,name', 'audits.user'])
            ->withCount('variants') // This will add 'variants_counts' to the result
            ->withSum('variants', 'quantity') // This will add 'variants_sum_quantity' to the result
            ->withSum('orderVariants', 'quantity') // This will add 'order_variants_sum_quantity' to the result
            ->search($params['search'] ?? '')
            ->when($params['active'], fn($q) => $q->active())
            ->when($params['inactive'], fn($q) => $q->inactive())
            ->when(
                isset($params['sort_by']) && isset($params['sort_to']),
                fn($q) => $q->orderBy($params['sort_by'], $params['sort_to']),
                fn($q) => $q->latest() // Default sorting by latest created_at date
            )
            ->paginate($params['per_page'] ?? 10);
    }
}
