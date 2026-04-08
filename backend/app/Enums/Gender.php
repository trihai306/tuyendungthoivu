<?php

namespace App\Enums;

enum Gender: string
{
    case Male = 'male';
    case Female = 'female';
    case Any = 'any';

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
            self::Male => 'Nam',
            self::Female => 'Nữ',
            self::Any => 'Không yêu cầu',
        };
    }

    /**
     * Get CSS class for badge display.
     */
    public function color(): string
    {
        return match ($this) {
            self::Male => 'bg-blue-100 text-blue-800',
            self::Female => 'bg-pink-100 text-pink-800',
            self::Any => 'bg-gray-100 text-gray-800',
        };
    }
}
