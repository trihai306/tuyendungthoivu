<?php

namespace App\Enums;

enum ServiceType: string
{
    case ShortTerm = 'short_term';
    case LongTerm = 'long_term';
    case ShiftBased = 'shift_based';
    case ProjectBased = 'project_based';

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
            self::ShortTerm => 'Ngắn hạn',
            self::LongTerm => 'Dài hạn',
            self::ShiftBased => 'Theo ca',
            self::ProjectBased => 'Theo dự án',
        };
    }

    /**
     * Get CSS class for badge display.
     */
    public function color(): string
    {
        return match ($this) {
            self::ShortTerm => 'bg-blue-100 text-blue-800',
            self::LongTerm => 'bg-purple-100 text-purple-800',
            self::ShiftBased => 'bg-cyan-100 text-cyan-800',
            self::ProjectBased => 'bg-indigo-100 text-indigo-800',
        };
    }
}
