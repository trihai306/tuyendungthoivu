<?php

namespace App\Listeners;

use App\Enums\OrderStatus;
use App\Events\WorkerAssigned;
use App\Events\WorkerUnassigned;

class UpdateOrderProgress
{
    /**
     * Update the order's quantity_filled when workers are assigned/unassigned.
     * This listener ensures order progress stays accurate regardless of how
     * assignment changes are triggered.
     */
    public function handle(WorkerAssigned|WorkerUnassigned $event): void
    {
        $assignment = $event->assignment;
        $order = $assignment->order;

        if (!$order) {
            return;
        }

        // Recount active assignments
        $newQuantityFilled = $order->assignments()->active()->count();
        $order->update(['quantity_filled' => $newQuantityFilled]);

        // Auto-transition order status based on fill level
        $order->refresh();

        if ($event instanceof WorkerAssigned) {
            if ($order->quantity_filled >= $order->quantity_needed
                && in_array($order->status, [OrderStatus::Recruiting, OrderStatus::Approved])
            ) {
                $order->update(['status' => OrderStatus::Filled]);
            }
        }

        if ($event instanceof WorkerUnassigned) {
            if ($order->status === OrderStatus::Filled
                && $order->quantity_filled < $order->quantity_needed
            ) {
                $order->update(['status' => OrderStatus::Recruiting]);
            }
        }
    }
}
