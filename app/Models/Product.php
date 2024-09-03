<?php

namespace App\Models;

use App\Enums\ProductStatus;
use App\Traits\HasUserTracking;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Pagination\LengthAwarePaginator;

class Product extends Model
{
    use HasFactory, HasUserTracking;

    protected $fillable = [
        'name',
        'category_id',
        'description'
    ];

    protected $casts = [
        'status' => ProductStatus::class
    ];

    public function acquisition(): BelongsTo
    {
        return $this->belongsTo(Acquisition::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
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
        $totalStock = $this->total_stock;

        if ($totalStock > 10) {
            return 'available';
        } elseif ($totalStock > 0) {
            return 'low';
        } else {
            return 'out of stock';
        }
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
                    ->orWhereHas('createdBy', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        return $query;
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

    public static function filterAndSort(array $params): LengthAwarePaginator
    {
        return self::query()
            ->with(['category:id,name', 'createdBy:id,name', 'updatedBy:id,name'])
            ->withCount('variants') // This will add 'variants_counts' to the result
            ->withSum('variants', 'quantity') // This will add 'variants_sum_quantity' to the result
            ->search($params['search'] ?? '')
            ->when($params['active'], fn($q) => $q->active())
            ->when($params['inactive'], fn($q) => $q->inactive())
            ->when(
                isset($params['sort_by']) && isset($params['sort_to']),
                fn($q) => $q->orderBy($params['sort_by'], $params['sort_to']),
                fn($q) => $q->latest('updated_at') // Use 'latest' method for descending order by 'updated_at' if no sort parameters are provided
            )
            ->paginate($params['per_page'] ?? 10);
    }
}
