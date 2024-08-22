<?php

namespace App\Enums;

enum ProductStatus: string
{
    use BaseEnum;

    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
}
