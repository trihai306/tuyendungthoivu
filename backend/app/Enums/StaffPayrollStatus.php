<?php

namespace App\Enums;

enum StaffPayrollStatus: string
{
    case Draft = 'draft';
    case Reviewed = 'reviewed';
    case Approved = 'approved';
    case Paid = 'paid';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Bản nháp',
            self::Reviewed => 'Đã kiểm tra',
            self::Approved => 'Đã duyệt',
            self::Paid => 'Đã trả lương',
        };
    }

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
