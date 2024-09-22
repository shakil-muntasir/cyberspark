<?php

namespace App\Models;

use App\Enums\ProductStatus;
use App\Traits\AuditableTrait;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Pagination\LengthAwarePaginator;
use OwenIt\Auditing\Contracts\Auditable;

class Product extends Model implements Auditable
{
    use AuditableTrait, HasFactory;

    protected $fillable = [
        'name',
        'sku_prefix',
        'category_id',
        'description',
        'status'
    ];

    protected $casts = [
        'status' => ProductStatus::class
    ];

    public function acquisitions(): BelongsToMany
    {
        return $this->belongsToMany(Acquisition::class)->withTimestamps();
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function orderVariants(): HasManyThrough
    {
        return $this->hasManyThrough(OrderVariant::class, ProductVariant::class);
    }

    /**
     * Accessor to get stock status based on total stock.
     */
    public function getAvailabilityAttribute(): string
    {
        $totalStock = $this->variants_sum_quantity;

        if ($totalStock > 120) {
            return 'available';
        } elseif ($totalStock > 90) {
            return 'stock low';
        } else {
            return 'out of stock';
        }
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
