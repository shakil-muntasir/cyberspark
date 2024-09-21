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
     * Get the user who created the product variant.
     *
     * @return array<string, mixed>|null
     */
    public function getCreatedByAttribute(): ?array
    {
        // Ensure the audits relationship is loaded before accessing it
        if ($this->relationLoaded('audits')) {
            $audit = $this->audits->firstWhere('event', 'created');

            return $audit && $audit->user ? [
                'id' => (string) $audit->user->id,
                'name' => $audit->user->name,
            ] : null;
        }

        // Return null if the audits relationship is not loaded
        return null;
    }

    /**
     * Get the user who updated the product variant.
     *
     * @return array<string, mixed>|null
     */
    public function getUpdatedByAttribute(): ?array
    {
        // Ensure the audits relationship is loaded before accessing it
        if ($this->relationLoaded('audits')) {
            $audit = $this->audits->firstWhere('event', 'updated');

            return $audit && $audit->user ? [
                'id' => (string) $audit->user->id,
                'name' => $audit->user->name,
            ] : null;
        }

        // Return null if the audits relationship is not loaded
        return null;
    }
}
