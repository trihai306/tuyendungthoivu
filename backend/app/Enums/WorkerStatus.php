<?php

namespace App\Enums;

enum WorkerStatus: string
{
    case Available = 'available';
    case Assigned = 'assigned';
    case Inactive = 'inactive';
    case Blacklisted = 'blacklisted';

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
            self::Available => 'Sẵn sàng',
            self::Assigned => 'Đang làm việc',
            self::Inactive => 'Không hoạt động',
            self::Blacklisted => 'Danh sách đen',
        };
    }

    /**
     * Get CSS class for badge display.
     */
    public function color(): string
    {
        return match ($this) {
            self::Available => 'bg-green-100 text-green-800',
            self::Assigned => 'bg-blue-100 text-blue-800',
            self::Inactive => 'bg-gray-100 text-gray-800',
            self::Blacklisted => 'bg-red-100 text-red-800',
        };
    }
}
