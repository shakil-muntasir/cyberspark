<?php

namespace App\Models;

use App\Traits\HasUserTracking;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Pagination\LengthAwarePaginator;

class Order extends Model
{
    use HasFactory, HasUserTracking;

    protected $fillable = [
        'customer_id',
        'delivery_method',
        'delivery_cost',
        'delivery_man_id',
        'courier_service_id',
        'total_payable',
    ];

    public function courierService(): BelongsTo
    {
        return $this->belongsTo(CourierService::class, 'courier_service_id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function deliveryMan(): BelongsTo
    {
        return $this->belongsTo(User::class, 'delivery_man_id');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(OrderVariant::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function shippingAddress(): HasOne
    {
        return $this->hasOne(ShippingAddress::class);
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!empty($search)) {
            return $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhereHas('createdBy', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        return $query;
    }

    public static function filterAndSort(array $params): LengthAwarePaginator
    {
        return self::query()
            ->with(['courierService:id,name', 'customer:id,name', 'deliveryMan', 'createdBy:id,name', 'updatedBy:id,name'])
            ->withSum('transactions', 'amount')
            ->search($params['search'] ?? '')
            ->when(
                isset($params['sort_by']) && isset($params['sort_to']),
                fn($q) => $q->orderBy($params['sort_by'], $params['sort_to']),
                fn($q) => $q->latest('updated_at')
            )
            ->paginate($params['per_page'] ?? 10);
    }


    public function getPaymentStatusAttribute()
    {
        $totalPaid = $this->transactions_sum_amount;
        if (isset($totalPaid)) {
            if ($totalPaid == $this->total_payable) {
                return 'paid';
            } else {
                return 'partial';
            }
        }
        return 'due';
    }

    public function getDeliveredByAttribute()
    {
        if ($this->delivery_method === 'in-house') {
            return $this->deliveryMan->name;
        }

        return $this->courierService->name;
    }
}
