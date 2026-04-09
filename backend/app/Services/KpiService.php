<?php

namespace App\Services;

use App\Enums\KpiCalculationMethod;
use App\Enums\KpiPeriodStatus;
use App\Models\KpiConfig;
use App\Models\KpiPeriod;
use App\Models\KpiRecord;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\StaffingOrder;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class KpiService
{
    /**
     * Initialize KPI records for all applicable staff in a period.
     */
    public function initializePeriod(KpiPeriod $period): int
    {
        $configs = KpiConfig::active()->get();
        $created = 0;

        // Get all active staff users
        $staffUsers = User::where('status', 'active')
            ->whereNotNull('employee_code')
            ->get();

        DB::transaction(function () use ($period, $configs, $staffUsers, &$created) {
            foreach ($staffUsers as $user) {
                $userRole = $this->getUserKpiRole($user);

                foreach ($configs as $config) {
                    $applicableRoles = $config->applicable_roles ?? [];
                    if (!in_array($userRole, $applicableRoles)) {
                        continue;
                    }

                    // Skip if already exists
                    $exists = KpiRecord::where('kpi_period_id', $period->id)
                        ->where('user_id', $user->id)
                        ->where('kpi_config_id', $config->id)
                        ->exists();

                    if ($exists) {
                        continue;
                    }

                    KpiRecord::create([
                        'kpi_period_id' => $period->id,
                        'user_id' => $user->id,
                        'kpi_config_id' => $config->id,
                        'target_value' => $config->default_target,
                        'weight' => $config->weight,
                    ]);

                    $created++;
                }
            }
        });

        return $created;
    }

    /**
     * Auto-calculate KPI values from system data.
     */
    public function autoCalculate(KpiPeriod $period): int
    {
        $autoConfigs = KpiConfig::active()
            ->where('calculation_method', KpiCalculationMethod::Auto)
            ->get();

        $updated = 0;

        foreach ($autoConfigs as $config) {
            $records = KpiRecord::where('kpi_period_id', $period->id)
                ->where('kpi_config_id', $config->id)
                ->get();

            foreach ($records as $record) {
                $value = $this->calculateAutoValue($config, $record->user_id, $period);

                if ($value !== null) {
                    $record->actual_value = $value;
                    $record->score = $record->calculateScore();
                    $record->save();
                    $updated++;
                }
            }
        }

        return $updated;
    }

    /**
     * Calculate the overall KPI score for a user in a period.
     */
    public function getUserOverallScore(string $userId, string $periodId): ?float
    {
        $records = KpiRecord::where('kpi_period_id', $periodId)
            ->where('user_id', $userId)
            ->whereNotNull('score')
            ->get();

        if ($records->isEmpty()) {
            return null;
        }

        $totalWeight = $records->sum('weight');
        if ($totalWeight == 0) {
            return null;
        }

        $weightedScore = $records->sum(fn ($r) => (float) $r->score * (float) $r->weight);

        return round($weightedScore / $totalWeight, 2);
    }

    /**
     * Get KPI summary for all staff in a period.
     */
    public function getPeriodSummary(string $periodId): array
    {
        $records = KpiRecord::with(['user', 'kpiConfig'])
            ->where('kpi_period_id', $periodId)
            ->get()
            ->groupBy('user_id');

        $summary = [];

        foreach ($records as $userId => $userRecords) {
            $user = $userRecords->first()->user;
            $totalWeight = $userRecords->sum('weight');
            $evaluatedRecords = $userRecords->whereNotNull('score');
            $overallScore = $totalWeight > 0
                ? round($evaluatedRecords->sum(fn ($r) => (float) $r->score * (float) $r->weight) / $totalWeight, 2)
                : null;

            $summary[] = [
                'user_id' => $userId,
                'user_name' => $user->name,
                'user_position' => $user->position,
                'employee_code' => $user->employee_code,
                'department' => $user->department?->name,
                'total_kpis' => $userRecords->count(),
                'evaluated_kpis' => $evaluatedRecords->count(),
                'overall_score' => $overallScore,
                'grade' => $this->scoreToGrade($overallScore),
            ];
        }

        // Sort by overall_score descending
        usort($summary, fn ($a, $b) => ($b['overall_score'] ?? 0) <=> ($a['overall_score'] ?? 0));

        return $summary;
    }

    /**
     * Determine user KPI role from their RBAC roles.
     */
    private function getUserKpiRole(User $user): string
    {
        $roleName = $user->roles->first()?->name ?? '';

        return match (true) {
            str_contains($roleName, 'manager') => 'manager',
            str_contains($roleName, 'sales') => 'sales',
            str_contains($roleName, 'recruiter') => 'recruiter',
            str_contains($roleName, 'coordinator') => 'coordinator',
            str_contains($roleName, 'accountant') => 'accountant',
            str_contains($roleName, 'admin') => 'manager',
            default => 'staff',
        };
    }

    /**
     * Calculate auto KPI value based on source.
     */
    private function calculateAutoValue(KpiConfig $config, string $userId, KpiPeriod $period): ?float
    {
        $startDate = $period->start_date->format('Y-m-d');
        $endDate = $period->end_date->format('Y-m-d');

        return match ($config->auto_source) {
            'orders_created' => StaffingOrder::where('created_by', $userId)
                ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
                ->count(),

            'orders_completed' => StaffingOrder::where('assigned_recruiter_id', $userId)
                ->where('status', 'completed')
                ->whereBetween('updated_at', [$startDate, $endDate . ' 23:59:59'])
                ->count(),

            'fill_rate' => $this->calculateFillRate($userId, $startDate, $endDate),

            'workers_assigned' => DB::table('assignments')
                ->where('assigned_by', $userId)
                ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
                ->count(),

            'revenue' => $this->calculateUserRevenue($userId, $startDate, $endDate),

            'new_clients' => Client::where('created_by', $userId)
                ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
                ->count(),

            'contract_value' => (float) DB::table('client_contracts')
                ->where('approved_by', $userId)
                ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
                ->sum('value'),

            'invoice_collected' => (float) Invoice::whereHas('payments', function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('payment_date', [$startDate, $endDate]);
                })
                ->whereHas('client', function ($q) use ($userId) {
                    $q->where('created_by', $userId);
                })
                ->withSum(['payments as collected' => function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('payment_date', [$startDate, $endDate]);
                }], 'amount')
                ->get()
                ->sum('collected'),

            default => null,
        };
    }

    private function calculateFillRate(string $userId, string $start, string $end): float
    {
        $orders = StaffingOrder::where('assigned_recruiter_id', $userId)
            ->whereBetween('created_at', [$start, $end . ' 23:59:59'])
            ->get();

        if ($orders->isEmpty()) {
            return 0;
        }

        $totalNeeded = $orders->sum('quantity_needed');
        $totalFilled = $orders->sum('quantity_filled');

        return $totalNeeded > 0 ? round(($totalFilled / $totalNeeded) * 100, 2) : 0;
    }

    private function calculateUserRevenue(string $userId, string $start, string $end): float
    {
        return (float) StaffingOrder::where('created_by', $userId)
            ->whereBetween('created_at', [$start, $end . ' 23:59:59'])
            ->sum('service_fee');
    }

    private function scoreToGrade(?float $score): string
    {
        if ($score === null) {
            return '-';
        }

        return match (true) {
            $score >= 95 => 'A+',
            $score >= 85 => 'A',
            $score >= 75 => 'B+',
            $score >= 65 => 'B',
            $score >= 50 => 'C',
            default => 'D',
        };
    }
}
