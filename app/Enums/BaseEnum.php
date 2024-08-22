<?php

namespace App\Enums;

use Str;

trait BaseEnum
{
    /**
     * Get all enum values as an array.
     *
     * @return array
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get all enum options as an associative array with 'label' and 'value'.
     *
     * @return array
     */
    public static function getAllOptions(): array
    {
        return array_map(fn($case) => [
            'label' => Str::title(str_replace('_', ' ', $case->name)),
            'value' => $case->value,
        ], self::cases());
    }
}
