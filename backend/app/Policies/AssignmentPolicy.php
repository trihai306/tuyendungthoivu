<?php

namespace App\Policies;

use App\Models\Assignment;
use App\Models\User;

class AssignmentPolicy
{
    /**
     * Determine whether the user can create assignments.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('assignments.create');
    }

    /**
     * Determine whether the user can update the assignment.
     */
    public function update(User $user, Assignment $assignment): bool
    {
        return $user->hasPermission('assignments.edit');
    }

    /**
     * Determine whether the user can delete the assignment.
     */
    public function delete(User $user, Assignment $assignment): bool
    {
        return $user->hasPermission('assignments.delete');
    }
}
