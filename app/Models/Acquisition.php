<?php

namespace App\Models;

use App\Traits\HasUserTracking;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Acquisition extends Model
{
    use HasFactory, HasUserTracking, SoftDeletes;

    protected $fillable = [
        'invoice_number',
        'acquired_date'
    ];

    protected $dates = [
        'acquired_date'
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function setAcquiredDateAttribute($value): void
    {
        $this->attributes['acquired_date'] = Carbon::parse($value);
    }
}
