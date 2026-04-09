<?php

namespace App\Enums;

enum KpiCalculationMethod: string
{
    case Manual = 'manual';
    case Auto = 'auto';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match ($this) {
            self::Manual => 'Nhập tay',
            self::Auto => 'Tự động',
        };
    }
}
