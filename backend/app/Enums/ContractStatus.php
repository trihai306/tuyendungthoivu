<?php

namespace App\Enums;

enum ContractStatus: string
{
    case Draft = 'draft';
    case Active = 'active';
    case Expired = 'expired';
    case Terminated = 'terminated';

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
            self::Active => 'Có hiệu lực',
            self::Expired => 'Hết hạn',
            self::Terminated => 'Đã chấm dứt',
        };
    }

    /**
     * Get CSS class for badge display.
     */
    public function color(): string
    {
        return match ($this) {
            self::Draft => 'bg-gray-100 text-gray-800',
            self::Active => 'bg-green-100 text-green-800',
            self::Expired => 'bg-yellow-100 text-yellow-800',
            self::Terminated => 'bg-red-100 text-red-800',
        };
    }
}
