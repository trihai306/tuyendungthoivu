<?php

namespace App\Actions\Worker;

use App\Enums\WorkerStatus;
use App\Models\ActivityLog;
use App\Models\User;
use App\Models\Worker;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CreateWorker
{
    /**
     * Create a new worker, optionally creating a linked user account.
     *
     * @param  array<string, mixed>  $data
     * @param  bool  $createUserAccount  Whether to create a User record for this worker.
     */
    public function execute(array $data, User $registeredBy, bool $createUserAccount = false): Worker
    {
        return DB::transaction(function () use ($data, $registeredBy, $createUserAccount) {
            // Auto-generate worker code if not provided
            if (empty($data['worker_code'])) {
                $data['worker_code'] = Worker::generateWorkerCode();
            }

            // Set defaults
            $data['status'] = $data['status'] ?? WorkerStatus::Available->value;
            $data['registered_by'] = $registeredBy->id;
            $data['total_orders'] = 0;
            $data['total_days_worked'] = 0;
            $data['average_rating'] = 0;
            $data['no_show_count'] = 0;

            // Optionally create a user account for the worker
            if ($createUserAccount && !empty($data['phone'])) {
                $user = User::create([
                    'name' => $data['full_name'],
                    'email' => $data['email'] ?? null,
                    'phone' => $data['phone'],
                    'password' => Hash::make($data['phone']), // Default password = phone number
                    'role' => 'worker',
                    'status' => 'active',
                ]);
                $data['user_id'] = $user->id;
            }

            $worker = Worker::create($data);

            // Log activity
            ActivityLog::create([
                'user_id' => $registeredBy->id,
                'action' => 'worker.created',
                'description' => "Created worker {$worker->full_name} ({$worker->worker_code})",
                'loggable_type' => Worker::class,
                'loggable_id' => $worker->id,
                'metadata' => [
                    'worker_code' => $worker->worker_code,
                    'full_name' => $worker->full_name,
                    'user_account_created' => $createUserAccount,
                ],
                'ip_address' => request()?->ip(),
            ]);

            return $worker;
        });
    }
}
