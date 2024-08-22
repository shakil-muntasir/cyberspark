<?php

namespace App\Enums;

enum ProductVariantStatus: string
{
    use BaseEnum;

    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
}
