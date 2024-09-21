<?php

namespace App\Traits;

use OwenIt\Auditing\Auditable;

/**
 * Trait AuditableTrait
 * 
 * This trait extends the Auditable trait from the owen-it/laravel-auditing package.
 * It provides additional functionality to the Auditable trait, such as getting the user who created or updated the model.
 *
 * @package App\Traits
 */
trait AuditableTrait
{
    use Auditable;

    /**
     * Boot the trait and automatically eager load the audits relation.
     */
    public static function bootAuditableTrait()
    {
        // Ensure audits and audits.user are always eager-loaded
        static::addGlobalScope('auditable', function ($query) {
            $query->with(['audits.user']);
        });
    }

    /**
     * Get the user who created the product variant.
     *
     * @return array<string, mixed>|null
     */
    public function getCreatedByAttribute(): ?array
    {
        $audit = $this->audits->firstWhere('event', 'created');

        return $audit && $audit->user ? [
            'id' => (string) $audit->user->id,
            'name' => $audit->user->name,
        ] : null;
    }

    /**
     * Get the user who updated the product variant.
     *
     * @return array<string, mixed>|null
     */
    public function getUpdatedByAttribute(): ?array
    {
        $audit = $this->audits->firstWhere('event', 'updated');

        return $audit && $audit->user ? [
            'id' => (string) $audit->user->id,
            'name' => $audit->user->name,
        ] : null;
    }
}
