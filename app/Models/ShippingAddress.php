<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShippingAddress extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'contact_number',
        'email',
        'street',
        'city',
        'state',
        'zip',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
