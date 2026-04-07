<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Employer = 'employer';
    case Worker = 'worker';
    case Landlord = 'landlord';
    case Coordinator = 'coordinator';

    /**
     * Get roles that are allowed for self-registration.
     *
     * @return array<string>
     */
    public static function registrableValues(): array
    {
        return [
            self::Worker->value,
            self::Employer->value,
            self::Landlord->value,
        ];
    }

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
     * Get a human-readable label for the role.
     */
    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Quản trị viên',
            self::Employer => 'Nhà tuyển dụng',
            self::Worker => 'Nhân viên thời vụ',
            self::Landlord => 'Quản lý trọ',
            self::Coordinator => 'Điều phối viên',
        };
    }
}
