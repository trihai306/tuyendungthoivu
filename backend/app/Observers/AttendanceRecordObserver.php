<?php

namespace App\Observers;

use App\Models\AttendanceRecord;
use App\Services\WorkerEvaluationService;

class AttendanceRecordObserver
{
    public function __construct(
        private readonly WorkerEvaluationService $evaluationService,
    ) {}

    public function created(AttendanceRecord $record): void
    {
        $this->syncWorkerStats($record);
    }

    public function updated(AttendanceRecord $record): void
    {
        $this->syncWorkerStats($record);
    }

    private function syncWorkerStats(AttendanceRecord $record): void
    {
        if ($record->worker_id && $record->worker) {
            $this->evaluationService->syncWorkerStats($record->worker);
        }
    }
}
