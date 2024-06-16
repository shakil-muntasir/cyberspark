<?php

namespace App\Models;

use App\Enums\ProductStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    protected $appends = [
        'url'
    ];

    protected $casts = [
        'status' => ProductStatus::class
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getUrlAttribute(): string
    {
        return rtrim(env('APP_URL', '/')) . '/products/' . $this->id;
    }
}
