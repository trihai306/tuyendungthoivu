<?php

namespace App\Listeners;

use App\Events\StaffingOrderApproved;
use App\Events\StaffingOrderCreated;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendOrderNotification implements ShouldQueue
{
    /**
     * Handle order-related events and send notifications to relevant users.
     */
    public function handle(StaffingOrderCreated|StaffingOrderApproved $event): void
    {
        $order = $event->order;

        if ($event instanceof StaffingOrderCreated) {
            $this->notifyOrderCreated($order);
        }

        if ($event instanceof StaffingOrderApproved) {
            $this->notifyOrderApproved($order);
        }
    }

    /**
     * Notify managers about a new staffing order that needs approval.
     */
    private function notifyOrderCreated($order): void
    {
        // Notify all users with orders.approve permission (managers)
        $managers = User::whereHas('roles', function ($query) {
            $query->whereHas('permissions', function ($q) {
                $q->where('name', 'orders.approve');
            });
        })->get();

        foreach ($managers as $manager) {
            Notification::create([
                'user_id' => $manager->id,
                'type' => 'order_created',
                'title' => 'New Staffing Order',
                'body' => "New order {$order->order_code} for {$order->position_name} ({$order->quantity_needed} workers) has been created.",
                'reference_type' => $order::class,
                'reference_id' => $order->id,
            ]);
        }
    }

    /**
     * Notify the assigned recruiter and order creator about approval.
     */
    private function notifyOrderApproved($order): void
    {
        $recipientIds = array_filter([
            $order->assigned_recruiter_id,
            $order->created_by,
        ]);

        foreach (array_unique($recipientIds) as $userId) {
            Notification::create([
                'user_id' => $userId,
                'type' => 'order_approved',
                'title' => 'Order Approved',
                'body' => "Order {$order->order_code} for {$order->position_name} has been approved.",
                'reference_type' => $order::class,
                'reference_id' => $order->id,
            ]);
        }
    }
}
