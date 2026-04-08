<?php

namespace App\Enums;

enum DepartmentStatus: string
{
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
     * Get a human-readable label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Active => 'Hoạt động',
            self::Inactive => 'Ngừng hoạt động',
        };
    }
}
