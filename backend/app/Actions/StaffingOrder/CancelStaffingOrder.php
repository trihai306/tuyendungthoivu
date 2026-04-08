<?php

namespace App\Actions\StaffingOrder;

use App\Enums\AssignmentStatus;
use App\Enums\OrderStatus;
use App\Models\ActivityLog;
use App\Models\StaffingOrder;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CancelStaffingOrder
{
    /**
     * Cancel a staffing order and update related assignments.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function execute(StaffingOrder $order, User $user, string $reason): StaffingOrder
    {
        return DB::transaction(function () use ($order, $user, $reason) {
            // Validate the order can be cancelled
            if (!$order->status->canTransitionTo(OrderStatus::Cancelled)) {
                throw ValidationException::withMessages([
                    'status' => ["Cannot cancel order in '{$order->status->value}' status."],
                ]);
            }

            $previousStatus = $order->status->value;

            $order->update([
                'status' => OrderStatus::Cancelled,
                'cancellation_reason' => $reason,
            ]);

            // Cancel all active assignments for this order
            $order->assignments()
                ->active()
                ->update([
                    'status' => AssignmentStatus::Cancelled,
                ]);

            // Log activity
            ActivityLog::create([
                'user_id' => $user->id,
                'action' => 'order.cancelled',
                'description' => "Cancelled staffing order {$order->order_code}",
                'loggable_type' => StaffingOrder::class,
                'loggable_id' => $order->id,
                'metadata' => [
                    'order_code' => $order->order_code,
                    'previous_status' => $previousStatus,
                    'reason' => $reason,
                ],
                'ip_address' => request()?->ip(),
            ]);

            return $order->fresh();
        });
    }
}
