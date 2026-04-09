<?php

namespace App\Models;

use App\Enums\PaymentMethod;
use App\Enums\StaffPayrollStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffPayroll extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'payroll_code',
        'user_id',
        'period_month',
        'period_year',
        'base_salary',
        'allowance',
        'kpi_score',
        'kpi_bonus',
        'overtime_amount',
        'deduction_amount',
        'deduction_notes',
        'gross_amount',
        'insurance_amount',
        'tax_amount',
        'net_amount',
        'working_days',
        'absent_days',
        'late_count',
        'status',
        'calculated_by',
        'reviewed_by',
        'reviewed_at',
        'approved_by',
        'approved_at',
        'paid_at',
        'payment_method',
        'payment_reference',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'status' => StaffPayrollStatus::class,
            'payment_method' => PaymentMethod::class,
            'period_month' => 'integer',
            'period_year' => 'integer',
            'base_salary' => 'decimal:0',
            'allowance' => 'decimal:0',
            'kpi_score' => 'decimal:2',
            'kpi_bonus' => 'decimal:0',
            'overtime_amount' => 'decimal:0',
            'deduction_amount' => 'decimal:0',
            'gross_amount' => 'decimal:0',
            'insurance_amount' => 'decimal:0',
            'tax_amount' => 'decimal:0',
            'net_amount' => 'decimal:0',
            'working_days' => 'integer',
            'absent_days' => 'integer',
            'late_count' => 'integer',
            'reviewed_at' => 'datetime',
            'approved_at' => 'datetime',
            'paid_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (StaffPayroll $payroll) {
            if (empty($payroll->payroll_code)) {
                $payroll->payroll_code = static::generatePayrollCode($payroll->period_month, $payroll->period_year);
            }
        });
    }

    // ── Relationships ───────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function calculatedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'calculated_by');
    }

    public function reviewedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function approvedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // ── Scopes ──────────────────────────────────────────────────────

    public function scopeForPeriod(Builder $query, int $month, int $year): void
    {
        $query->where('period_month', $month)->where('period_year', $year);
    }

    public function scopeByStatus(Builder $query, StaffPayrollStatus $status): void
    {
        $query->where('status', $status);
    }

    // ── Methods ─────────────────────────────────────────────────────

    public function calculateGross(): float
    {
        return (float) $this->base_salary
            + (float) $this->allowance
            + (float) $this->kpi_bonus
            + (float) $this->overtime_amount
            - (float) $this->deduction_amount;
    }

    public function calculateNet(): float
    {
        return $this->calculateGross()
            - (float) $this->insurance_amount
            - (float) $this->tax_amount;
    }

    public static function generatePayrollCode(int $month, int $year): string
    {
        $prefix = sprintf('SPR-%04d%02d-', $year, $month);

        $lastCode = static::where('payroll_code', 'like', $prefix . '%')
            ->orderByDesc('payroll_code')
            ->value('payroll_code');

        if ($lastCode) {
            $lastNumber = (int) substr($lastCode, -3);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return $prefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    }
}
