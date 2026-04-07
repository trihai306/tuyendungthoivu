<?php

namespace App\Enums;

enum UserStatus: string
{
    case Pending = 'pending';
    case Active = 'active';
    case Suspended = 'suspended';
    case Banned = 'banned';

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
     * Get a human-readable label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Chờ xác minh',
            self::Active => 'Hoạt động',
            self::Suspended => 'Tạm khóa',
            self::Banned => 'Bị cấm',
        };
    }

    /**
     * Check if the user can authenticate with this status.
     */
    public function canLogin(): bool
    {
        return match ($this) {
            self::Active, self::Pending => true,
            self::Suspended, self::Banned => false,
        };
    }
}
