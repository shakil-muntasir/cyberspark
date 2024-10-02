<?php

namespace App\Enums;

use Str;

enum OrderStatus: string
{
    use BaseEnum;

    case PENDING = 'pending';
    case SHIPPING = 'shipping';
    case RECEIVED = 'received';
    case COMPLETE = 'complete';

    /**
     * Get the color associated with the enum case.
     *
     * @return string
     */
    public function color(): string
    {
        return match ($this) {
            self::PENDING => 'orange',
            self::SHIPPING => 'green',
            self::RECEIVED => 'sky',
            self::COMPLETE => 'violet',
        };
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
            'color' => $case->color(),
        ], self::cases());
    }
}
