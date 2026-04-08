<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Draft = 'draft';
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Recruiting = 'recruiting';
    case Filled = 'filled';
    case InProgress = 'in_progress';
    case Completed = 'completed';
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
            self::Pending => 'Chờ duyệt',
            self::Approved => 'Đã duyệt',
            self::Rejected => 'Từ chối',
            self::Recruiting => 'Đang tuyển',
            self::Filled => 'Đã đủ người',
            self::InProgress => 'Đang thực hiện',
            self::Completed => 'Hoàn thành',
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
            self::Pending => 'bg-yellow-100 text-yellow-800',
            self::Approved => 'bg-blue-100 text-blue-800',
            self::Rejected => 'bg-red-100 text-red-800',
            self::Recruiting => 'bg-indigo-100 text-indigo-800',
            self::Filled => 'bg-purple-100 text-purple-800',
            self::InProgress => 'bg-cyan-100 text-cyan-800',
            self::Completed => 'bg-green-100 text-green-800',
            self::Cancelled => 'bg-red-100 text-red-800',
        };
    }

    /**
     * Check if the order can be transitioned to the given status.
     */
    public function canTransitionTo(self $target): bool
    {
        return match ($this) {
            self::Draft => in_array($target, [self::Pending, self::Cancelled]),
            self::Pending => in_array($target, [self::Approved, self::Rejected, self::Cancelled]),
            self::Approved => in_array($target, [self::Recruiting, self::Cancelled]),
            self::Rejected => in_array($target, [self::Pending]), // resubmit
            self::Recruiting => in_array($target, [self::Filled, self::Cancelled]),
            self::Filled => in_array($target, [self::InProgress, self::Recruiting]), // back to recruiting if worker drops
            self::InProgress => in_array($target, [self::Completed, self::Cancelled]),
            self::Completed, self::Cancelled => false,
        };
    }
}
