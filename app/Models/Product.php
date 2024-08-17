<?php

namespace App\Models;

use App\Enums\ProductStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku',
        'name',
        'description',
        'quantity',
        'buying_price',
        'retail_price',
        'selling_price',
    ];

    protected $casts = [
        'status' => ProductStatus::class
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by_id');
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
                    ->orWhere('sku', 'like', "%{$search}%")
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

    /**
     * Filter, sort, and paginate products based on given parameters.
     *
     * @param  array<string, mixed>  $params
     * @return LengthAwarePaginator
     */
    public static function filterAndSort(array $params): LengthAwarePaginator
    {
        return self::query()
            ->search($params['search'] ?? '')
            ->when($params['active'], fn($q) => $q->active())
            ->when($params['inactive'], fn($q) => $q->inactive())
            ->orderBy($params['sort_by'] ?? 'id', $params['sort_to'] ?? 'asc')
            ->paginate($params['per_page'] ?? 10);
    }

    public function getActiveCountAttribute(): int
    {
        return $this->active()->count();
    }

    public function getInactiveCountAttribute(): int
    {
        return $this->inactive()->count();
    }
}
