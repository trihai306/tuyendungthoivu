<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case BankTransfer = 'bank_transfer';
    case Cash = 'cash';
    case Check = 'check';

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
            self::BankTransfer => 'Chuyển khoản',
            self::Cash => 'Tiền mặt',
            self::Check => 'Séc',
        };
    }

    /**
     * Get CSS class for badge display.
     */
    public function color(): string
    {
        return match ($this) {
            self::BankTransfer => 'bg-blue-100 text-blue-800',
            self::Cash => 'bg-green-100 text-green-800',
            self::Check => 'bg-purple-100 text-purple-800',
        };
    }
}
