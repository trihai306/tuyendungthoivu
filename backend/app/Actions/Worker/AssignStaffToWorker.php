<?php

namespace App\Actions\Worker;

use App\Models\ActivityLog;
use App\Models\User;
use App\Models\Worker;
use Illuminate\Support\Facades\DB;

class AssignStaffToWorker
{
    /**
     * Assign a staff member (recruiter) as the person in charge of a worker.
     */
    public function execute(Worker $worker, User $staff, User $assignedBy): Worker
    {
        return DB::transaction(function () use ($worker, $staff, $assignedBy) {
            $previousStaff = $worker->registered_by;

            $worker->update([
                'registered_by' => $staff->id,
            ]);

            // Log activity
            ActivityLog::create([
                'user_id' => $assignedBy->id,
                'action' => 'worker.staff_assigned',
                'description' => "Assigned staff {$staff->name} to worker {$worker->full_name}",
                'loggable_type' => Worker::class,
                'loggable_id' => $worker->id,
                'metadata' => [
                    'worker_code' => $worker->worker_code,
                    'previous_staff_id' => $previousStaff,
                    'new_staff_id' => $staff->id,
                    'new_staff_name' => $staff->name,
                ],
                'ip_address' => request()?->ip(),
            ]);

            return $worker->fresh();
        });
    }
}
