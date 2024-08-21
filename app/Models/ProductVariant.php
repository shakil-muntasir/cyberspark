<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\ProductVariantStatus;
use App\Traits\HasUserTracking;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductVariant extends Model
{
    use HasFactory, HasUserTracking, SoftDeletes;

    protected $fillable = [
        'sku',
        'quantity',
        'buying_price',
        'retail_price',
        'selling_price',
    ];

    protected $casts = [
        'status' => ProductVariantStatus::class
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
