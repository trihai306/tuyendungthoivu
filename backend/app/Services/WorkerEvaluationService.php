<?php

namespace App\Services;

use App\Enums\AssignmentStatus;
use App\Enums\AttendanceStatus;
use App\Models\Assignment;
use App\Models\AttendanceRecord;
use App\Models\Worker;

class WorkerEvaluationService
{
    /**
     * Get full work history with auto-calculated evaluation for a worker.
     * Each completed assignment becomes a "work period" with stats from attendance data.
     */
    public function getWorkHistory(Worker $worker): array
    {
        $assignments = Assignment::with(['order.client'])
            ->where('worker_id', $worker->id)
            ->whereIn('status', [
                AssignmentStatus::Completed,
                AssignmentStatus::Working,
            ])
            ->orderByDesc('created_at')
            ->get();

        return $assignments->map(function (Assignment $assignment) {
            $attendances = AttendanceRecord::where('assignment_id', $assignment->id)
                ->orderBy('work_date')
                ->get();

            $totalDays = $attendances->count();
            $presentDays = $attendances->whereIn('status', [
                AttendanceStatus::Present,
                AttendanceStatus::Late,
                AttendanceStatus::HalfDay,
            ])->count();
            $lateDays = $attendances->where('status', AttendanceStatus::Late)->count();
            $absentDays = $attendances->where('status', AttendanceStatus::Absent)->count();
            $excusedDays = $attendances->where('status', AttendanceStatus::Excused)->count();
            $totalHours = $attendances->sum('total_hours');
            $overtimeHours = $attendances->sum('overtime_hours');

            // Auto-calculate evaluation scores (1-5 scale)
            $evaluation = $this->calculateEvaluation(
                totalDays: $totalDays,
                presentDays: $presentDays,
                lateDays: $lateDays,
                absentDays: $absentDays,
            );

            // Build violations list
            $violations = $this->buildViolations($attendances);

            return [
                'id' => $assignment->id,
                'order_id' => $assignment->order_id,
                'order_code' => $assignment->order?->order_code,
                'client' => $assignment->order?->client?->company_name,
                'position' => $assignment->order?->position_name,
                'status' => $assignment->status->value,
                'status_label' => $assignment->status->label(),
                'started_at' => $assignment->started_at?->toDateString(),
                'completed_at' => $assignment->completed_at?->toDateString(),
                // Attendance stats
                'total_days' => $totalDays,
                'present_days' => $presentDays,
                'late_days' => $lateDays,
                'absent_days' => $absentDays,
                'excused_days' => $excusedDays,
                'total_hours' => round($totalHours, 1),
                'overtime_hours' => round($overtimeHours, 1),
                // Auto evaluation (1-5)
                'evaluation' => $evaluation,
                // Violations
                'violations' => $violations,
            ];
        })->values()->toArray();
    }

    /**
     * Get recent attendance records for a worker.
     */
    public function getRecentAttendance(Worker $worker, int $limit = 20): array
    {
        return AttendanceRecord::with(['order'])
            ->where('worker_id', $worker->id)
            ->orderByDesc('work_date')
            ->limit($limit)
            ->get()
            ->map(fn (AttendanceRecord $att) => [
                'id' => $att->id,
                'date' => $att->work_date?->toDateString(),
                'order_code' => $att->order?->order_code,
                'check_in' => $att->check_in_time?->format('H:i'),
                'check_out' => $att->check_out_time?->format('H:i'),
                'hours' => $att->total_hours,
                'status' => $att->status?->value,
                'status_label' => $att->status?->label(),
            ])
            ->toArray();
    }

    /**
     * Calculate overall auto-rating for a worker from all their attendance.
     * Returns scores 1-5 for punctuality, attendance_rate, and overall.
     */
    public function calculateOverallRating(Worker $worker): array
    {
        $attendances = AttendanceRecord::where('worker_id', $worker->id)->get();
        $totalDays = $attendances->count();

        if ($totalDays === 0) {
            return [
                'overall' => 0,
                'punctuality' => 0,
                'attendance_rate' => 0,
                'total_days' => 0,
                'present_days' => 0,
                'late_days' => 0,
                'absent_days' => 0,
                'no_show_count' => 0,
            ];
        }

        $presentDays = $attendances->whereIn('status', [
            AttendanceStatus::Present,
            AttendanceStatus::Late,
            AttendanceStatus::HalfDay,
        ])->count();
        $lateDays = $attendances->where('status', AttendanceStatus::Late)->count();
        $absentDays = $attendances->where('status', AttendanceStatus::Absent)->count();

        $eval = $this->calculateEvaluation($totalDays, $presentDays, $lateDays, $absentDays);

        return [
            'overall' => $eval['overall'],
            'punctuality' => $eval['punctuality'],
            'attendance_rate' => $eval['attendance_rate'],
            'total_days' => $totalDays,
            'present_days' => $presentDays,
            'late_days' => $lateDays,
            'absent_days' => $absentDays,
            'no_show_count' => $absentDays,
        ];
    }

    /**
     * Auto-update denormalized stats on the worker model.
     */
    public function syncWorkerStats(Worker $worker): void
    {
        $totalDays = AttendanceRecord::where('worker_id', $worker->id)
            ->whereIn('status', [AttendanceStatus::Present, AttendanceStatus::Late, AttendanceStatus::HalfDay])
            ->count();

        $totalOrders = Assignment::where('worker_id', $worker->id)
            ->where('status', AssignmentStatus::Completed)
            ->count();

        $lastWorked = AttendanceRecord::where('worker_id', $worker->id)
            ->whereNotNull('check_in_time')
            ->max('work_date');

        $noShowCount = AttendanceRecord::where('worker_id', $worker->id)
            ->where('status', AttendanceStatus::Absent)
            ->count();

        $rating = $this->calculateOverallRating($worker);

        $worker->update([
            'total_days_worked' => $totalDays,
            'total_orders' => $totalOrders,
            'last_worked_date' => $lastWorked,
            'no_show_count' => $noShowCount,
            'average_rating' => $rating['overall'],
        ]);
    }

    // ── Private helpers ─────────────────────────────────────────────

    /**
     * Calculate evaluation scores (1-5 scale) from attendance stats.
     *
     * Punctuality: based on late ratio (0% late = 5, >30% late = 1)
     * Attendance rate: based on present ratio (100% = 5, <70% = 1)
     * Overall: weighted average (punctuality 40% + attendance 60%)
     */
    private function calculateEvaluation(
        int $totalDays,
        int $presentDays,
        int $lateDays,
        int $absentDays,
    ): array {
        if ($totalDays === 0) {
            return ['punctuality' => 0, 'attendance_rate' => 0, 'overall' => 0];
        }

        // Attendance rate score
        $attendanceRatio = $presentDays / $totalDays;
        $attendanceScore = match (true) {
            $attendanceRatio >= 0.98 => 5.0,
            $attendanceRatio >= 0.95 => 4.5,
            $attendanceRatio >= 0.90 => 4.0,
            $attendanceRatio >= 0.85 => 3.5,
            $attendanceRatio >= 0.80 => 3.0,
            $attendanceRatio >= 0.75 => 2.5,
            $attendanceRatio >= 0.70 => 2.0,
            default => 1.0,
        };

        // Punctuality score (among present days, how many were late?)
        $onTimeDays = $presentDays - $lateDays;
        $punctualityRatio = $presentDays > 0 ? $onTimeDays / $presentDays : 1;
        $punctualityScore = match (true) {
            $punctualityRatio >= 0.98 => 5.0,
            $punctualityRatio >= 0.95 => 4.5,
            $punctualityRatio >= 0.90 => 4.0,
            $punctualityRatio >= 0.85 => 3.5,
            $punctualityRatio >= 0.80 => 3.0,
            $punctualityRatio >= 0.70 => 2.5,
            default => 1.0,
        };

        // Overall = weighted average
        $overall = round(($punctualityScore * 0.4) + ($attendanceScore * 0.6), 1);

        return [
            'punctuality' => $punctualityScore,
            'attendance_rate' => $attendanceScore,
            'overall' => $overall,
        ];
    }

    /**
     * Build a list of violations from attendance records.
     */
    private function buildViolations(\Illuminate\Support\Collection $attendances): array
    {
        $violations = [];

        foreach ($attendances as $att) {
            if ($att->status === AttendanceStatus::Absent) {
                $violations[] = [
                    'date' => $att->work_date?->toDateString(),
                    'type' => 'absent',
                    'label' => 'Vắng mặt không phép',
                ];
            } elseif ($att->status === AttendanceStatus::Late) {
                $lateMinutes = null;
                if ($att->check_in_time && $att->order?->start_time) {
                    $scheduled = Carbon\Carbon::parse($att->work_date->format('Y-m-d') . ' ' . $att->order->start_time);
                    $lateMinutes = max(0, $att->check_in_time->diffInMinutes($scheduled, false) * -1);
                }
                $violations[] = [
                    'date' => $att->work_date?->toDateString(),
                    'type' => 'late',
                    'label' => 'Đi trễ' . ($lateMinutes ? " {$lateMinutes} phút" : ''),
                ];
            }
        }

        return $violations;
    }
}
