<?php

namespace App\Enums;

enum State: string
{
    use BaseEnum;

    case DHAKA = 'dhaka';
    case CHATTOGRAM = 'chattogram';
    case KHULNA = 'khulna';
    case RAJSHAHI = 'rajshahi';
    case BARISHAL = 'barishal';
    case SYLHET = 'sylhet';
    case RANGPUR = 'rangpur';
    case MYMENSINGH = 'mymensingh';
}