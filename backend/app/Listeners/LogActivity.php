<?php

namespace App\Listeners;

use App\Events\AttendanceRecorded;
use App\Events\InvoiceGenerated;
use App\Events\PaymentReceived;
use App\Events\PayrollCalculated;
use App\Events\StaffingOrderApproved;
use App\Events\StaffingOrderCreated;
use App\Events\WorkerAssigned;
use App\Events\WorkerUnassigned;
use App\Models\ActivityLog;
use Illuminate\Contracts\Queue\ShouldQueue;

class LogActivity implements ShouldQueue
{
    /**
     * Handle a generic event by logging it to the activity log.
     * This listener provides a catch-all for events that do not already log
     * activity inside their Action. It can be attached to any event that
     * should produce an audit trail entry.
     */
    public function handle(object $event): void
    {
        $mapping = $this->resolveMapping($event);

        if (!$mapping) {
            return;
        }

        ActivityLog::create([
            'user_id' => $mapping['user_id'],
            'action' => $mapping['action'],
            'description' => $mapping['description'],
            'loggable_type' => $mapping['loggable_type'],
            'loggable_id' => $mapping['loggable_id'],
            'metadata' => $mapping['metadata'] ?? [],
            'ip_address' => request()?->ip(),
        ]);
    }

    /**
     * Map an event to the activity log fields.
     *
     * @return array<string, mixed>|null
     */
    private function resolveMapping(object $event): ?array
    {
        if ($event instanceof PaymentReceived) {
            $payment = $event->payment;
            return [
                'user_id' => $payment->recorded_by,
                'action' => 'payment.received',
                'description' => "Payment of {$payment->amount} recorded via {$payment->payment_method?->value}",
                'loggable_type' => $payment::class,
                'loggable_id' => $payment->id,
                'metadata' => [
                    'amount' => $payment->amount,
                    'method' => $payment->payment_method?->value,
                    'reference' => $payment->reference_number,
                ],
            ];
        }

        if ($event instanceof AttendanceRecorded) {
            $attendance = $event->attendance;
            return [
                'user_id' => $attendance->approved_by,
                'action' => 'attendance.recorded',
                'description' => "Attendance recorded for worker on {$attendance->work_date}",
                'loggable_type' => $attendance::class,
                'loggable_id' => $attendance->id,
                'metadata' => [
                    'work_date' => $attendance->work_date?->format('Y-m-d'),
                    'status' => $attendance->status,
                ],
            ];
        }

        // Actions already log activity for these events, so return null
        // to avoid double-logging. This listener is kept as a safety net.
        return null;
    }
}
