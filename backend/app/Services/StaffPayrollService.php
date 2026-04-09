<?php

namespace App\Services;

use App\Enums\StaffPayrollStatus;
use App\Models\KpiRecord;
use App\Models\StaffPayroll;
use App\Models\StaffSalaryConfig;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class StaffPayrollService
{
    public function __construct(
        private KpiService $kpiService,
    ) {}

    /**
     * Calculate payroll for a single staff member.
     */
    public function calculate(string $userId, int $month, int $year, ?string $calculatedBy = null): StaffPayroll
    {
        // Check if already exists
        $existing = StaffPayroll::where('user_id', $userId)
            ->forPeriod($month, $year)
            ->first();

        if ($existing) {
            throw new \RuntimeException('Đã tồn tại bảng lương cho nhân viên này trong kỳ này.');
        }

        $user = User::findOrFail($userId);
        $salaryConfig = StaffSalaryConfig::activeFor($userId, sprintf('%04d-%02d-01', $year, $month));

        if (!$salaryConfig) {
            throw new \RuntimeException("Chưa cấu hình lương cho nhân viên {$user->name}.");
        }

        // Get KPI score for bonus calculation
        $kpiScore = $this->getKpiScoreForPeriod($userId, $month, $year);
        $kpiBonus = $this->calculateKpiBonus(
            (float) $salaryConfig->base_salary,
            (float) $salaryConfig->kpi_bonus_rate,
            $kpiScore,
        );

        $baseSalary = (float) $salaryConfig->base_salary;
        $allowance = (float) $salaryConfig->allowance;
        $grossAmount = $baseSalary + $allowance + $kpiBonus;

        // Standard deductions (simplified)
        $insuranceAmount = $this->calculateInsurance($baseSalary);
        $taxAmount = $this->calculateTax($grossAmount - $insuranceAmount);
        $netAmount = $grossAmount - $insuranceAmount - $taxAmount;

        return StaffPayroll::create([
            'user_id' => $userId,
            'period_month' => $month,
            'period_year' => $year,
            'base_salary' => $baseSalary,
            'allowance' => $allowance,
            'kpi_score' => $kpiScore,
            'kpi_bonus' => $kpiBonus,
            'overtime_amount' => 0,
            'deduction_amount' => 0,
            'gross_amount' => $grossAmount,
            'insurance_amount' => $insuranceAmount,
            'tax_amount' => $taxAmount,
            'net_amount' => $netAmount,
            'working_days' => $this->getStandardWorkingDays($month, $year),
            'status' => StaffPayrollStatus::Draft,
            'calculated_by' => $calculatedBy,
        ]);
    }

    /**
     * Bulk calculate payroll for all active staff.
     */
    public function bulkCalculate(int $month, int $year, ?string $calculatedBy = null): array
    {
        $staffUsers = User::where('status', 'active')
            ->whereNotNull('employee_code')
            ->get();

        $created = 0;
        $skipped = 0;
        $errors = [];

        DB::transaction(function () use ($staffUsers, $month, $year, $calculatedBy, &$created, &$skipped, &$errors) {
            foreach ($staffUsers as $user) {
                try {
                    // Skip if already calculated
                    $existing = StaffPayroll::where('user_id', $user->id)
                        ->forPeriod($month, $year)
                        ->exists();

                    if ($existing) {
                        $skipped++;
                        continue;
                    }

                    $salaryConfig = StaffSalaryConfig::activeFor($user->id, sprintf('%04d-%02d-01', $year, $month));
                    if (!$salaryConfig) {
                        $skipped++;
                        continue;
                    }

                    $this->calculate($user->id, $month, $year, $calculatedBy);
                    $created++;
                } catch (\Throwable $e) {
                    $errors[] = [
                        'user_id' => $user->id,
                        'name' => $user->name,
                        'error' => $e->getMessage(),
                    ];
                }
            }
        });

        return compact('created', 'skipped', 'errors');
    }

    /**
     * Get KPI score for a user in the given month.
     */
    private function getKpiScoreForPeriod(string $userId, int $month, int $year): ?float
    {
        // Find KPI period that covers this month
        $startOfMonth = sprintf('%04d-%02d-01', $year, $month);
        $endOfMonth = date('Y-m-t', strtotime($startOfMonth));

        $period = \App\Models\KpiPeriod::where('start_date', '<=', $endOfMonth)
            ->where('end_date', '>=', $startOfMonth)
            ->first();

        if (!$period) {
            return null;
        }

        return $this->kpiService->getUserOverallScore($userId, $period->id);
    }

    /**
     * Calculate KPI bonus.
     */
    private function calculateKpiBonus(float $baseSalary, float $bonusRate, ?float $kpiScore): float
    {
        if (!$kpiScore || $bonusRate <= 0) {
            return 0;
        }

        // Bonus = base_salary * bonus_rate% * (kpi_score / 100)
        return round($baseSalary * ($bonusRate / 100) * ($kpiScore / 100));
    }

    /**
     * Calculate social insurance (BHXH 8% + BHYT 1.5% + BHTN 1% = 10.5%).
     */
    private function calculateInsurance(float $baseSalary): float
    {
        $maxInsurableSalary = 36_000_000; // 20x base salary ceiling
        $insurable = min($baseSalary, $maxInsurableSalary);

        return round($insurable * 0.105);
    }

    /**
     * Calculate personal income tax (simplified progressive rates).
     */
    private function calculateTax(float $taxableIncome): float
    {
        $personalDeduction = 11_000_000;
        $taxable = $taxableIncome - $personalDeduction;

        if ($taxable <= 0) {
            return 0;
        }

        // Simplified progressive tax
        $brackets = [
            [5_000_000, 0.05],
            [5_000_000, 0.10],
            [8_000_000, 0.15],
            [14_000_000, 0.20],
            [20_000_000, 0.25],
            [28_000_000, 0.30],
            [PHP_FLOAT_MAX, 0.35],
        ];

        $tax = 0;
        $remaining = $taxable;

        foreach ($brackets as [$bracketSize, $rate]) {
            if ($remaining <= 0) {
                break;
            }
            $amount = min($remaining, $bracketSize);
            $tax += $amount * $rate;
            $remaining -= $amount;
        }

        return round($tax);
    }

    /**
     * Get standard working days in a month (Mon-Sat, excluding Sun).
     */
    private function getStandardWorkingDays(int $month, int $year): int
    {
        $days = 0;
        $totalDays = cal_days_in_month(CAL_GREGORIAN, $month, $year);

        for ($d = 1; $d <= $totalDays; $d++) {
            $dayOfWeek = date('N', mktime(0, 0, 0, $month, $d, $year));
            if ($dayOfWeek < 7) { // Mon=1 to Sat=6
                $days++;
            }
        }

        return $days;
    }
}
