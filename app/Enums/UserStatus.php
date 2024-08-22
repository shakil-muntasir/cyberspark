<?php

namespace App\Enums;

enum UserStatus: string
{
    use BaseEnum;
    
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
}
