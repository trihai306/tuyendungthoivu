<?php

namespace App\Actions\Payroll;

use App\Enums\PayrollStatus;
use App\Events\PayrollCalculated;
use App\Models\ActivityLog;
use App\Models\Attendance;
use App\Models\Payroll;
use App\Models\User;
use App\Models\Worker;
use Illuminate\Support\Facades\DB;

class CalculatePayroll
{
    /**
     * Calculate payroll for a single worker for a given period.
     * Queries attendance records to compute work_days, ot_hours, base_salary, net_salary.
     *
     * @param  array<string, mixed>  $config  Configuration overrides (base_rate, ot_multiplier, deductions, etc.)
     */
    public function execute(
        Worker $worker,
        string $periodStart,
        string $periodEnd,
        User $calculatedBy,
        array $config = []
    ): Payroll {
        return DB::transaction(function () use ($worker, $periodStart, $periodEnd, $calculatedBy, $config) {
            // Query attendance records for the worker in the given period
            $attendances = Attendance::where('worker_profile_id', $worker->id)
                ->whereBetween('work_date', [$periodStart, $periodEnd])
                ->where('is_approved', true)
                ->get();

            $totalShifts = $attendances->count();
            $totalHours = $attendances->sum('total_hours');
            $otHours = $attendances->sum('ot_hours');

            // Calculate salary components
            $baseRate = $config['base_rate'] ?? 200000; // Default daily rate in VND
            $otMultiplier = $config['ot_multiplier'] ?? 1.5;
            $hourlyRate = $baseRate / 8; // Assuming 8-hour workday

            $baseSalary = $totalShifts * $baseRate;
            $otSalary = $otHours * $hourlyRate * $otMultiplier;
            $allowances = $config['allowances'] ?? 0;
            $grossSalary = $baseSalary + $otSalary + $allowances;

            // Deductions
            $housingDeduct = $config['housing_deduct'] ?? 0;
            $advanceDeduct = $config['advance_deduct'] ?? 0;
            $netSalary = $grossSalary - $housingDeduct - $advanceDeduct;

            // Create or update the payroll record
            $payroll = Payroll::updateOrCreate(
                [
                    'worker_profile_id' => $worker->id,
                    'period_start' => $periodStart,
                    'period_end' => $periodEnd,
                ],
                [
                    'total_shifts' => $totalShifts,
                    'total_hours' => $totalHours,
                    'ot_hours' => $otHours,
                    'base_salary' => $baseSalary,
                    'ot_salary' => $otSalary,
                    'allowances' => $allowances,
                    'gross_salary' => $grossSalary,
                    'housing_deduct' => $housingDeduct,
                    'advance_deduct' => $advanceDeduct,
                    'net_salary' => $netSalary,
                    'status' => PayrollStatus::Draft->value,
                ]
            );

            // Log activity
            ActivityLog::create([
                'user_id' => $calculatedBy->id,
                'action' => 'payroll.calculated',
                'description' => "Calculated payroll for worker {$worker->full_name} ({$periodStart} to {$periodEnd})",
                'loggable_type' => Payroll::class,
                'loggable_id' => $payroll->id,
                'metadata' => [
                    'worker_code' => $worker->worker_code,
                    'period' => "{$periodStart} to {$periodEnd}",
                    'total_shifts' => $totalShifts,
                    'net_salary' => $netSalary,
                ],
                'ip_address' => request()?->ip(),
            ]);

            event(new PayrollCalculated($payroll));

            return $payroll;
        });
    }
}
