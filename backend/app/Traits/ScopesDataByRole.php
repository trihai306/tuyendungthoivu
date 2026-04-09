<?php

namespace App\Traits;

use App\Models\User;

/**
 * Provides role-based data scoping helpers for controllers.
 * Uses the RBAC role levels to determine access scope:
 *   - super_admin/admin (>= 90): All data
 *   - manager (>= 70): All data (departmental oversight)
 *   - recruiter (>= 50): Only own data
 *   - coordinator (>= 40): Read-only on related data
 *   - viewer (< 40): Read-only, limited
 */
trait ScopesDataByRole
{
    protected function getUserRoleLevel(User $user): int
    {
        return $user->highest_role_level;
    }

    protected function isAdmin(User $user): bool
    {
        return $this->getUserRoleLevel($user) >= 90;
    }

    protected function isManagerOrAbove(User $user): bool
    {
        return $this->getUserRoleLevel($user) >= 70;
    }

    protected function isRecruiter(User $user): bool
    {
        return $user->hasRole('recruiter');
    }
}
