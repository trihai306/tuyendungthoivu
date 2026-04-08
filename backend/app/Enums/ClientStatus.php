<?php

namespace App\Enums;

enum ClientStatus: string
{
    case Prospect = 'prospect';
    case Active = 'active';
    case Inactive = 'inactive';

    /**
     * Get all enum values as a flat array.
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get a human-readable Vietnamese label.
     */
    public function label(): string
    {
        return match ($this) {
            self::Prospect => 'Tiềm năng',
            self::Active => 'Đang hoạt động',
            self::Inactive => 'Ngừng hoạt động',
        };
    }

    /**
     * Get CSS class for badge display.
     */
    public function color(): string
    {
        return match ($this) {
            self::Prospect => 'bg-blue-100 text-blue-800',
            self::Active => 'bg-green-100 text-green-800',
            self::Inactive => 'bg-gray-100 text-gray-800',
        };
    }
}
