<?php

namespace App\Enums;

enum AssignmentStatus: string
{
    case Created = 'created';
    case Contacted = 'contacted';
    case Confirmed = 'confirmed';
    case Working = 'working';
    case Completed = 'completed';
    case Rejected = 'rejected';
    case Cancelled = 'cancelled';
    case NoContact = 'no_contact';
    case Replaced = 'replaced';

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
            self::Created => 'Mới tạo',
            self::Contacted => 'Đã liên hệ',
            self::Confirmed => 'Đã xác nhận',
            self::Working => 'Đang làm việc',
            self::Completed => 'Hoàn thành',
            self::Rejected => 'Từ chối',
            self::Cancelled => 'Đã hủy',
            self::NoContact => 'Không liên lạc được',
            self::Replaced => 'Đã thay thế',
        };
    }

    /**
     * Get CSS class for badge display.
     */
    public function color(): string
    {
        return match ($this) {
            self::Created => 'bg-gray-100 text-gray-800',
            self::Contacted => 'bg-blue-100 text-blue-800',
            self::Confirmed => 'bg-indigo-100 text-indigo-800',
            self::Working => 'bg-cyan-100 text-cyan-800',
            self::Completed => 'bg-green-100 text-green-800',
            self::Rejected => 'bg-red-100 text-red-800',
            self::Cancelled => 'bg-red-100 text-red-800',
            self::NoContact => 'bg-yellow-100 text-yellow-800',
            self::Replaced => 'bg-orange-100 text-orange-800',
        };
    }

    /**
     * Check if assignment is in an active (non-terminal) state.
     */
    public function isActive(): bool
    {
        return in_array($this, [
            self::Created,
            self::Contacted,
            self::Confirmed,
            self::Working,
        ]);
    }

    /**
     * Check if assignment is in a terminal state.
     */
    public function isTerminal(): bool
    {
        return in_array($this, [
            self::Completed,
            self::Rejected,
            self::Cancelled,
            self::Replaced,
        ]);
    }
}
