<?php

namespace App\Enums;

enum KpiPeriodType: string
{
    case Monthly = 'monthly';
    case Quarterly = 'quarterly';
    case Yearly = 'yearly';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match ($this) {
            self::Monthly => 'Hàng tháng',
            self::Quarterly => 'Hàng quý',
            self::Yearly => 'Hàng năm',
        };
    }
}
