<?php

namespace App\Actions\Assignment;

use App\Enums\AssignmentStatus;
use App\Enums\OrderStatus;
use App\Enums\WorkerStatus;
use App\Events\WorkerUnassigned;
use App\Models\ActivityLog;
use App\Models\Assignment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RemoveWorkerFromOrder
{
    /**
     * Remove a worker from an order assignment.
     * Updates worker status back to available and decrements order quantity_filled.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function execute(Assignment $assignment, User $user, string $reason = ''): Assignment
    {
        return DB::transaction(function () use ($assignment, $user, $reason) {
            // Validate the assignment is in a removable state
            if ($assignment->status->isTerminal()) {
                throw ValidationException::withMessages([
                    'assignment' => ["Cannot remove a worker from an assignment in '{$assignment->status->value}' status."],
                ]);
            }

            $worker = $assignment->worker;
            $order = $assignment->order;
            $previousStatus = $assignment->status->value;

            // Cancel the assignment
            $assignment->update([
                'status' => AssignmentStatus::Cancelled,
                'replacement_reason' => $reason,
            ]);

            // Check if the worker has any other active assignments
            $otherActiveAssignments = Assignment::where('worker_id', $worker->id)
                ->where('id', '!=', $assignment->id)
                ->active()
                ->exists();

            // Set worker back to available only if no other active assignments
            if (!$otherActiveAssignments) {
                $worker->update(['status' => WorkerStatus::Available]);
            }

            // Update order quantity_filled
            $newQuantityFilled = $order->assignments()->active()->count();
            $order->update(['quantity_filled' => $newQuantityFilled]);

            // If the order was Filled and now has open slots, revert to Recruiting
            $order->refresh();
            if ($order->status === OrderStatus::Filled && $order->quantity_filled < $order->quantity_needed) {
                $order->update(['status' => OrderStatus::Recruiting]);
            }

            // Log activity
            ActivityLog::create([
                'user_id' => $user->id,
                'action' => 'assignment.removed',
                'description' => "Removed worker {$worker->full_name} from order {$order->order_code}",
                'loggable_type' => Assignment::class,
                'loggable_id' => $assignment->id,
                'metadata' => [
                    'order_code' => $order->order_code,
                    'worker_code' => $worker->worker_code,
                    'worker_name' => $worker->full_name,
                    'previous_status' => $previousStatus,
                    'reason' => $reason,
                    'quantity_filled' => $order->quantity_filled,
                    'quantity_needed' => $order->quantity_needed,
                ],
                'ip_address' => request()?->ip(),
            ]);

            event(new WorkerUnassigned($assignment));

            return $assignment->fresh();
        });
    }
}
