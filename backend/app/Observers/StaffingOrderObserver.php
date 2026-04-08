<?php

namespace App\Observers;

use App\Enums\OrderStatus;
use App\Models\StaffingOrder;
use Illuminate\Validation\ValidationException;

class StaffingOrderObserver
{
    /**
     * Handle the StaffingOrder "creating" event.
     * Auto-generates the order code if not already set.
     */
    public function creating(StaffingOrder $order): void
    {
        if (empty($order->order_code)) {
            $order->order_code = StaffingOrder::generateOrderCode();
        }

        // Default quantity_filled to 0
        if (is_null($order->quantity_filled)) {
            $order->quantity_filled = 0;
        }
    }

    /**
     * Handle the StaffingOrder "updating" event.
     * Validates status transitions to prevent invalid state changes.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updating(StaffingOrder $order): void
    {
        // Only validate if status is changing
        if ($order->isDirty('status')) {
            $originalStatus = $order->getOriginal('status');

            // If the original status is a string, cast it to the enum
            if (is_string($originalStatus)) {
                $originalStatus = OrderStatus::from($originalStatus);
            }

            $newStatus = $order->status;

            // Validate the status transition
            if ($originalStatus instanceof OrderStatus && !$originalStatus->canTransitionTo($newStatus)) {
                throw ValidationException::withMessages([
                    'status' => [
                        "Invalid status transition from '{$originalStatus->value}' to '{$newStatus->value}'.",
                    ],
                ]);
            }
        }
    }
}
