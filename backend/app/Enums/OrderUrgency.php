<?php

namespace App\Enums;

enum OrderUrgency: string
{
    case Normal = 'normal';
    case Urgent = 'urgent';
    case Critical = 'critical';

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
            self::Normal => 'Bình thường',
            self::Urgent => 'Gấp',
            self::Critical => 'Rất gấp',
        };
    }

    /**
     * Get CSS class for badge display.
     */
    public function color(): string
    {
        return match ($this) {
            self::Normal => 'bg-gray-100 text-gray-800',
            self::Urgent => 'bg-orange-100 text-orange-800',
            self::Critical => 'bg-red-100 text-red-800',
        };
    }
}
