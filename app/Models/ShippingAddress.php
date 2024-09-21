<?php

namespace App\Models;

use App\Traits\AuditableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OwenIt\Auditing\Contracts\Auditable;

class ShippingAddress extends Model implements Auditable
{
    use AuditableTrait, HasFactory;

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
