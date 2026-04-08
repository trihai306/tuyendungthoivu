<?php

namespace App\Enums;

enum RateType: string
{
    case Hourly = 'hourly';
    case Daily = 'daily';
    case Shift = 'shift';

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
            self::Hourly => 'Theo giờ',
            self::Daily => 'Theo ngày',
            self::Shift => 'Theo ca',
        };
    }

    /**
     * Get CSS class for badge display.
     */
    public function color(): string
    {
        return match ($this) {
            self::Hourly => 'bg-blue-100 text-blue-800',
            self::Daily => 'bg-green-100 text-green-800',
            self::Shift => 'bg-purple-100 text-purple-800',
        };
    }
}
