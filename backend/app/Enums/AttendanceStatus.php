<?php

namespace App\Enums;

enum AttendanceStatus: string
{
    case Present = 'present';
    case Late = 'late';
    case Absent = 'absent';
    case HalfDay = 'half_day';
    case Excused = 'excused';

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
            self::Present => 'Có mặt',
            self::Late => 'Đi trễ',
            self::Absent => 'Vắng mặt',
            self::HalfDay => 'Nửa ngày',
            self::Excused => 'Có phép',
        };
    }

    /**
     * Get CSS class for badge display.
     */
    public function color(): string
    {
        return match ($this) {
            self::Present => 'bg-green-100 text-green-800',
            self::Late => 'bg-yellow-100 text-yellow-800',
            self::Absent => 'bg-red-100 text-red-800',
            self::HalfDay => 'bg-orange-100 text-orange-800',
            self::Excused => 'bg-blue-100 text-blue-800',
        };
    }
}
