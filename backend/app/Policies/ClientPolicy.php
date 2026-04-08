<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\User;

class ClientPolicy
{
    /**
     * Determine whether the user can view any clients.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('clients.view');
    }

    /**
     * Determine whether the user can view the client.
     */
    public function view(User $user, Client $client): bool
    {
        return $user->hasPermission('clients.view');
    }

    /**
     * Determine whether the user can create clients.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('clients.create');
    }

    /**
     * Determine whether the user can update the client.
     */
    public function update(User $user, Client $client): bool
    {
        return $user->hasPermission('clients.edit');
    }

    /**
     * Determine whether the user can delete the client.
     */
    public function delete(User $user, Client $client): bool
    {
        return $user->hasPermission('clients.delete');
    }
}
