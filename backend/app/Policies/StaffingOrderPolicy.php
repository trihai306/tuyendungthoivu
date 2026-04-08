<?php

namespace App\Policies;

use App\Enums\OrderStatus;
use App\Models\StaffingOrder;
use App\Models\User;

class StaffingOrderPolicy
{
    /**
     * Determine whether the user can view any staffing orders.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('orders.view');
    }

    /**
     * Determine whether the user can view the staffing order.
     */
    public function view(User $user, StaffingOrder $order): bool
    {
        return $user->hasPermission('orders.view');
    }

    /**
     * Determine whether the user can create staffing orders.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('orders.create');
    }

    /**
     * Determine whether the user can update the staffing order.
     * Only allowed when status is not completed or cancelled.
     */
    public function update(User $user, StaffingOrder $order): bool
    {
        if (!$user->hasPermission('orders.edit')) {
            return false;
        }

        // Cannot edit completed or cancelled orders
        return !in_array($order->status, [
            OrderStatus::Completed,
            OrderStatus::Cancelled,
        ]);
    }

    /**
     * Determine whether the user can delete the staffing order.
     */
    public function delete(User $user, StaffingOrder $order): bool
    {
        return $user->hasPermission('orders.delete');
    }

    /**
     * Determine whether the user can approve the staffing order.
     * Only managers and above can approve.
     */
    public function approve(User $user, StaffingOrder $order): bool
    {
        return $user->hasPermission('orders.approve');
    }

    /**
     * Determine whether the user can assign workers to the staffing order.
     */
    public function assign(User $user, StaffingOrder $order): bool
    {
        return $user->hasPermission('orders.assign');
    }
}
