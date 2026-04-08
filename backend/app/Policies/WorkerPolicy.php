<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Worker;

class WorkerPolicy
{
    /**
     * Determine whether the user can view any workers.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('workers.view');
    }

    /**
     * Determine whether the user can view the worker.
     */
    public function view(User $user, Worker $worker): bool
    {
        return $user->hasPermission('workers.view');
    }

    /**
     * Determine whether the user can create workers.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('workers.create');
    }

    /**
     * Determine whether the user can update the worker.
     */
    public function update(User $user, Worker $worker): bool
    {
        return $user->hasPermission('workers.edit');
    }

    /**
     * Determine whether the user can delete the worker.
     */
    public function delete(User $user, Worker $worker): bool
    {
        return $user->hasPermission('workers.delete');
    }
}
