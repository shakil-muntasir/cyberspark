<?php

namespace App\Models;

use App\Traits\HasUserTracking;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory, HasUserTracking;

    protected $fillable = [
        'amount',
        'payment_method',
        'service_provider',
        'account_number',
        'txn_id',
        'bank_name',
        'cheque_number'
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
