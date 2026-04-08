<?php

namespace App\Enums;

enum TeamMemberRole: string
{
    case Lead = 'lead';
    case Member = 'member';

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
     * Get a human-readable label for the team member role.
     */
    public function label(): string
    {
        return match ($this) {
            self::Lead => 'Trưởng nhóm',
            self::Member => 'Thành viên',
        };
    }
}
