<?php

namespace App\Enums;

enum InvoiceStatus: string
{
    case Draft = 'draft';
    case Approved = 'approved';
    case Sent = 'sent';
    case PartiallyPaid = 'partially_paid';
    case Paid = 'paid';
    case Overdue = 'overdue';
    case Cancelled = 'cancelled';

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
            self::Approved => 'Đã duyệt',
            self::Sent => 'Đã gửi',
            self::PartiallyPaid => 'Thanh toán một phần',
            self::Paid => 'Đã thanh toán',
            self::Overdue => 'Quá hạn',
            self::Cancelled => 'Đã hủy',
        };
    }

    /**
     * Get CSS class for badge display.
     */
    public function color(): string
    {
        return match ($this) {
            self::Draft => 'bg-gray-100 text-gray-800',
            self::Approved => 'bg-blue-100 text-blue-800',
            self::Sent => 'bg-indigo-100 text-indigo-800',
            self::PartiallyPaid => 'bg-yellow-100 text-yellow-800',
            self::Paid => 'bg-green-100 text-green-800',
            self::Overdue => 'bg-red-100 text-red-800',
            self::Cancelled => 'bg-red-100 text-red-800',
        };
    }
}
