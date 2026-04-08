<?php

namespace App\Actions\StaffingOrder;

use App\Enums\OrderStatus;
use App\Events\StaffingOrderApproved;
use App\Models\ActivityLog;
use App\Models\StaffingOrder;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ApproveStaffingOrder
{
    /**
     * Approve a staffing order. Validates the status transition from pending to approved.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function execute(StaffingOrder $order, User $approver): StaffingOrder
    {
        return DB::transaction(function () use ($order, $approver) {
            // Validate the current status allows approval
            if (!$order->status->canTransitionTo(OrderStatus::Approved)) {
                throw ValidationException::withMessages([
                    'status' => ["Cannot approve order in '{$order->status->value}' status. Only pending orders can be approved."],
                ]);
            }

            $previousStatus = $order->status->value;

            $order->update([
                'status' => OrderStatus::Approved,
                'approved_by' => $approver->id,
                'approved_at' => now(),
            ]);

            // Log activity
            ActivityLog::create([
                'user_id' => $approver->id,
                'action' => 'order.approved',
                'description' => "Approved staffing order {$order->order_code}",
                'loggable_type' => StaffingOrder::class,
                'loggable_id' => $order->id,
                'metadata' => [
                    'order_code' => $order->order_code,
                    'previous_status' => $previousStatus,
                    'new_status' => OrderStatus::Approved->value,
                ],
                'ip_address' => request()?->ip(),
            ]);

            event(new StaffingOrderApproved($order));

            return $order->fresh();
        });
    }
}
