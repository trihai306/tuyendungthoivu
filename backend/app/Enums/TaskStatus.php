<?php

namespace App\Enums;

enum TaskStatus: string
{
    case Pending = 'pending';
    case InProgress = 'in_progress';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
    case Overdue = 'overdue';

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
     * Get a human-readable label for the task status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Chờ xử lý',
            self::InProgress => 'Đang thực hiện',
            self::Completed => 'Hoàn thành',
            self::Cancelled => 'Đã hủy',
            self::Overdue => 'Quá hạn',
        };
    }

    /**
     * Check if the task can be transitioned to from this status.
     */
    public function canTransitionTo(self $target): bool
    {
        return match ($this) {
            self::Pending => in_array($target, [self::InProgress, self::Cancelled]),
            self::InProgress => in_array($target, [self::Completed, self::Cancelled, self::Overdue]),
            self::Overdue => in_array($target, [self::Completed, self::Cancelled]),
            self::Completed, self::Cancelled => false,
        };
    }
}
