<?php

namespace App\Observers;

use App\Enums\AssignmentStatus;
use App\Events\WorkerAssigned;
use App\Events\WorkerUnassigned;
use App\Models\Assignment;

class WorkerAssignmentObserver
{
    /**
     * Handle the Assignment "created" event.
     * Dispatches the WorkerAssigned event when a new assignment is created.
     */
    public function created(Assignment $assignment): void
    {
        // Only fire if the assignment is in an active state
        if ($assignment->status && $assignment->status->isActive()) {
            event(new WorkerAssigned($assignment));
        }
    }

    /**
     * Handle the Assignment "updated" event.
     * Dispatches appropriate events based on status changes.
     */
    public function updated(Assignment $assignment): void
    {
        if ($assignment->isDirty('status')) {
            $newStatus = $assignment->status;
            $originalStatus = $assignment->getOriginal('status');

            if (is_string($originalStatus)) {
                $originalStatus = AssignmentStatus::from($originalStatus);
            }

            // If transitioned to a terminal state, fire unassigned event
            if ($newStatus->isTerminal() && $originalStatus instanceof AssignmentStatus && $originalStatus->isActive()) {
                event(new WorkerUnassigned($assignment));
            }
        }
    }

    /**
     * Handle the Assignment "deleted" event.
     * Dispatches the WorkerUnassigned event when an assignment is deleted.
     */
    public function deleted(Assignment $assignment): void
    {
        event(new WorkerUnassigned($assignment));
    }
}
