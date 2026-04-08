<?php

namespace App\Policies;

use App\Models\Attendance;
use App\Models\User;

class AttendancePolicy
{
    /**
     * Determine whether the user can view any attendance records.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('attendance.view');
    }

    /**
     * Determine whether the user can create (record) attendance.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('attendance.record');
    }

    /**
     * Determine whether the user can verify attendance records.
     */
    public function verify(User $user, Attendance $attendance): bool
    {
        return $user->hasPermission('attendance.verify');
    }
}
