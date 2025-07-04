<?php

namespace App\Models;

use App\Traits\AuditableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Pagination\LengthAwarePaginator;
use OwenIt\Auditing\Contracts\Auditable;
use App\Enums\OrderStatus;

class Order extends Model implements Auditable
{
    use AuditableTrait, HasFactory;

    protected $fillable = [
        'customer_id',
        'delivery_method',
        'delivery_cost',
        'delivery_man_id',
        'courier_service_id',
        'total_payable',
        'sales_rep_id'
    ];

    protected $casts = [
        'status' => OrderStatus::class
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

    public function orderVariants(): HasMany
    {
        return $this->hasMany(OrderVariant::class);
    }

    public function productVariants(): HasManyThrough
    {
        return $this->hasManyThrough(
            ProductVariant::class,
            OrderVariant::class,
            'order_id',
            'id',
            'id',
            'product_variant_id'
        );
    }

    public function salesRep(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sales_rep_id');
    }

    public function shippingAddress(): HasOne
    {
        return $this->hasOne(ShippingAddress::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function getCodeAttribute()
    {
        return sprintf('%05d', $this->id);
    }

    public function getPaymentStatusAttribute()
    {
        $totalPaid = $this->transactions_sum_amount;
        if (isset($totalPaid)) {
            if ($totalPaid == $this->total_payable) {
                return 'paid';
            } elseif ($totalPaid > 0 && $totalPaid < $this->total_payable) {
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

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!empty($search)) {
            return $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('deliveryMan', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('courierService', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        return $query;
    }

    /**
     * Filter and sort orders based on given parameters.
     *
     * @param array $params
     * @return LengthAwarePaginator
     */
    public static function filterAndSort(array $params): LengthAwarePaginator
    {
        return self::query()
            ->with(['courierService', 'customer', 'deliveryMan', 'audits.user'])
            ->withSum('transactions', 'amount')
            ->search($params['search'] ?? '')
            ->when(
                isset($params['sort_by']) && isset($params['sort_to']),
                fn($q) => $q->orderBy($params['sort_by'], $params['sort_to']),
                fn($q) => $q->latest() // Default sorting by latest created_at date
            )
            ->paginate($params['per_page'] ?? 10);
    }
}
