<?php

namespace App\Listeners;

use App\Enums\WorkerStatus;
use App\Events\WorkerAssigned;
use App\Events\WorkerUnassigned;
use App\Models\Assignment;

class UpdateWorkerStatus
{
    /**
     * Handle worker assignment/unassignment events to keep worker status in sync.
     * Note: The DispatchWorker and RemoveWorkerFromOrder actions already handle
     * the primary status updates. This listener acts as a safety net for events
     * dispatched from other sources (e.g., Observers).
     */
    public function handle(WorkerAssigned|WorkerUnassigned $event): void
    {
        $assignment = $event->assignment;
        $worker = $assignment->worker;

        if (!$worker) {
            return;
        }

        // Count active assignments for this worker
        $activeAssignmentCount = Assignment::where('worker_id', $worker->id)
            ->active()
            ->count();

        if ($event instanceof WorkerAssigned) {
            // Worker should be in assigned status if they have active assignments
            if ($activeAssignmentCount > 0 && $worker->status === WorkerStatus::Available) {
                $worker->update(['status' => WorkerStatus::Assigned]);
            }
        }

        if ($event instanceof WorkerUnassigned) {
            // If no more active assignments, set worker back to available
            if ($activeAssignmentCount === 0 && $worker->status === WorkerStatus::Assigned) {
                $worker->update(['status' => WorkerStatus::Available]);
            }
        }
    }
}
