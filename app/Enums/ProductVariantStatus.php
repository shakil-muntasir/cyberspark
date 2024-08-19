<?php

namespace App\Enums;

enum ProductVariantStatus: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';

    public static function getAllStatuses(): array
    {
        return [
            ['label' => 'Active', 'value' => self::ACTIVE->value],
            ['label' => 'Inactive', 'value' => self::INACTIVE->value]
        ];
    }
}
