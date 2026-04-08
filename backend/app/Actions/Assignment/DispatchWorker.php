<?php

namespace App\Actions\Assignment;

use App\Enums\AssignmentStatus;
use App\Enums\OrderStatus;
use App\Enums\WorkerStatus;
use App\Events\WorkerAssigned;
use App\Models\ActivityLog;
use App\Models\Assignment;
use App\Models\StaffingOrder;
use App\Models\User;
use App\Models\Worker;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DispatchWorker
{
    /**
     * Assign a worker to a staffing order.
     * Validates worker availability and order capacity before dispatching.
     *
     * @param  array<string, mixed>  $extraData  Optional extra data (dispatch_info, etc.)
     * @throws \Illuminate\Validation\ValidationException
     */
    public function execute(
        StaffingOrder $order,
        Worker $worker,
        User $assignedBy,
        array $extraData = []
    ): Assignment {
        return DB::transaction(function () use ($order, $worker, $assignedBy, $extraData) {
            // Validate worker is available
            if ($worker->status !== WorkerStatus::Available) {
                throw ValidationException::withMessages([
                    'worker_id' => ["Worker '{$worker->full_name}' is not available (current status: {$worker->status->value})."],
                ]);
            }

            // Validate order has open slots
            if ($order->quantity_filled >= $order->quantity_needed) {
                throw ValidationException::withMessages([
                    'order_id' => ["Order {$order->order_code} is already fully staffed ({$order->quantity_filled}/{$order->quantity_needed})."],
                ]);
            }

            // Validate order is in a dispatchable status
            $dispatchableStatuses = [
                OrderStatus::Approved,
                OrderStatus::Recruiting,
                OrderStatus::Filled, // Allow re-filling if a worker drops
            ];
            if (!in_array($order->status, $dispatchableStatuses)) {
                throw ValidationException::withMessages([
                    'order_id' => ["Cannot dispatch workers to order in '{$order->status->value}' status."],
                ]);
            }

            // Check for duplicate assignment
            $existingAssignment = Assignment::where('order_id', $order->id)
                ->where('worker_id', $worker->id)
                ->active()
                ->first();
            if ($existingAssignment) {
                throw ValidationException::withMessages([
                    'worker_id' => ["Worker '{$worker->full_name}' is already assigned to this order."],
                ]);
            }

            // Create the assignment
            $assignment = Assignment::create(array_merge([
                'order_id' => $order->id,
                'worker_id' => $worker->id,
                'assigned_by' => $assignedBy->id,
                'status' => AssignmentStatus::Created,
            ], $extraData));

            // Update worker status to assigned
            $worker->update(['status' => WorkerStatus::Assigned]);

            // Update order quantity_filled
            $newQuantityFilled = $order->assignments()->active()->count();
            $order->update(['quantity_filled' => $newQuantityFilled]);

            // Transition order to recruiting if it was just approved
            if ($order->status === OrderStatus::Approved) {
                $order->update(['status' => OrderStatus::Recruiting]);
            }

            // Check if order is now fully filled
            $order->refresh();
            if ($order->quantity_filled >= $order->quantity_needed) {
                $order->update(['status' => OrderStatus::Filled]);
            }

            // Log activity
            ActivityLog::create([
                'user_id' => $assignedBy->id,
                'action' => 'assignment.dispatched',
                'description' => "Dispatched worker {$worker->full_name} to order {$order->order_code}",
                'loggable_type' => Assignment::class,
                'loggable_id' => $assignment->id,
                'metadata' => [
                    'order_code' => $order->order_code,
                    'worker_code' => $worker->worker_code,
                    'worker_name' => $worker->full_name,
                    'quantity_filled' => $order->quantity_filled,
                    'quantity_needed' => $order->quantity_needed,
                ],
                'ip_address' => request()?->ip(),
            ]);

            event(new WorkerAssigned($assignment));

            return $assignment;
        });
    }
}
