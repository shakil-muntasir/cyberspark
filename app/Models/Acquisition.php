<?php

namespace App\Models;

use App\Traits\AuditableTrait;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Pagination\LengthAwarePaginator;
use OwenIt\Auditing\Contracts\Auditable;

class Acquisition extends Model implements Auditable
{
    use AuditableTrait, HasFactory, SoftDeletes;

    protected $fillable = [
        'invoice_number',
        'acquired_date'
    ];

    protected $casts = [
        'acquired_date' => 'date'
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    // Mutator to convert 'm-d-Y' format to 'Y-m-d' before saving to the database
    public function setAcquiredDateAttribute($value)
    {
        if ($value) {
            $this->attributes['acquired_date'] = Carbon::createFromFormat('m-d-Y', $value)->format('Y-m-d');
        }
    }

    /**
     * Scope a query to search products based on given search query.
     *
     * @param Builder $query
     * @param string|null $search
     * @return Builder
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!empty($search)) {
            return $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%");
            });
        }

        return $query;
    }

    /**
     * Filter and sort acquisitions based on given parameters.
     *
     * @param array $params
     * @return LengthAwarePaginator
     */
    public static function filterAndSort(array $params): LengthAwarePaginator
    {
        return self::query()
            ->withCount('products')
            ->search($params['search'] ?? '')
            ->when(
                isset($params['sort_by']) && isset($params['sort_to']),
                fn($q) => $q->orderBy($params['sort_by'], $params['sort_to']),
                fn($q) => $q->latest() // Default sorting by latest created_at date
            )
            ->paginate($params['per_page'] ?? 10);
    }
}
