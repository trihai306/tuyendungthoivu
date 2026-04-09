<?php

namespace App\Enums;

enum KpiPeriodStatus: string
{
    case Open = 'open';
    case Closed = 'closed';
    case Locked = 'locked';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match ($this) {
            self::Open => 'Đang mở',
            self::Closed => 'Đã đóng',
            self::Locked => 'Đã khóa',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Open => 'bg-green-100 text-green-800',
            self::Closed => 'bg-yellow-100 text-yellow-800',
            self::Locked => 'bg-gray-100 text-gray-800',
        };
    }
}
