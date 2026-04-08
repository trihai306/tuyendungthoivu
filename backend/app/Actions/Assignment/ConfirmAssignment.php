<?php

namespace App\Actions\Assignment;

use App\Enums\AssignmentStatus;
use App\Models\ActivityLog;
use App\Models\Assignment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ConfirmAssignment
{
    /**
     * Worker confirms their assignment. Transitions from Created/Contacted to Confirmed.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function execute(Assignment $assignment, User $user, string $confirmationNote = ''): Assignment
    {
        return DB::transaction(function () use ($assignment, $user, $confirmationNote) {
            // Validate the assignment can be confirmed
            $confirmableStatuses = [
                AssignmentStatus::Created,
                AssignmentStatus::Contacted,
            ];
            if (!in_array($assignment->status, $confirmableStatuses)) {
                throw ValidationException::withMessages([
                    'status' => ["Cannot confirm assignment in '{$assignment->status->value}' status."],
                ]);
            }

            $previousStatus = $assignment->status->value;

            $assignment->update([
                'status' => AssignmentStatus::Confirmed,
                'confirmed_at' => now(),
                'confirmation_note' => $confirmationNote,
            ]);

            // Log activity
            ActivityLog::create([
                'user_id' => $user->id,
                'action' => 'assignment.confirmed',
                'description' => "Worker confirmed assignment for order {$assignment->order->order_code}",
                'loggable_type' => Assignment::class,
                'loggable_id' => $assignment->id,
                'metadata' => [
                    'order_code' => $assignment->order->order_code,
                    'worker_id' => $assignment->worker_id,
                    'previous_status' => $previousStatus,
                    'confirmation_note' => $confirmationNote,
                ],
                'ip_address' => request()?->ip(),
            ]);

            return $assignment->fresh();
        });
    }
}
