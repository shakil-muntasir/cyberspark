<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Str;

class CourierService extends Model
{
    use HasFactory;

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get all courier service options as an associative array with 'label' and 'value'.
     *
     * @return array
     */
    public static function getAllOptions(): array
    {
        return self::all()->map(function ($courierService) {
            return [
                'id' => $courierService->id,
                'label' => Str::title(str_replace('_', ' ', $courierService->name)),
                'value' => $courierService->delivery_price,
            ];
        })->toArray();
    }
}
