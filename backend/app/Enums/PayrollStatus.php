<?php

namespace App\Enums;

enum PayrollStatus: string
{
    case Draft = 'draft';
    case Reviewed = 'reviewed';
    case Approved = 'approved';
    case Paid = 'paid';

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
            self::Draft => 'Bản nháp',
            self::Reviewed => 'Đã kiểm tra',
            self::Approved => 'Đã duyệt',
            self::Paid => 'Đã trả',
        };
    }

    /**
     * Get CSS class for badge display.
     */
    public function color(): string
    {
        return match ($this) {
            self::Draft => 'bg-gray-100 text-gray-800',
            self::Reviewed => 'bg-blue-100 text-blue-800',
            self::Approved => 'bg-indigo-100 text-indigo-800',
            self::Paid => 'bg-green-100 text-green-800',
        };
    }
}
