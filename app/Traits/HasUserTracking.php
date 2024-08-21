<?php

namespace App\Traits;

use App\Models\User;

trait HasUserTracking
{
    protected static function bootHasUserTracking()
    {
        static::creating(function ($model) {
            $userId = auth()->id();
            $model->created_by_id = $userId;
            $model->updated_by_id = $userId;
        });

        static::updating(function ($model) {
            $model->updated_by_id = auth()->id();
        });
    }

    /**
     * Get the user that created the model.
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    /**
     * Get the user that last updated the model.
     */
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by_id');
    }
}
