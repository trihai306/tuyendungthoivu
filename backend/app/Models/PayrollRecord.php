<?php

namespace App\Models;

use App\Enums\PaymentMethod;
use App\Enums\PayrollStatus;
use App\Enums\RateType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class PayrollRecord extends Model
{
    use HasFactory, HasUuids;

    /**
     * Use a separate table to avoid conflict with the legacy payrolls table.
     */
    protected $table = 'payrolls_v2';

    protected $fillable = [
        'payroll_code',
        'worker_id',
        'order_id',
        'period_start',
        'period_end',
        'total_days',
        'total_hours',
        'overtime_hours',
        'unit_price',
        'rate_type',
        'base_amount',
        'overtime_amount',
        'allowance_amount',
        'deduction_amount',
        'net_amount',
        'status',
        'reviewed_by',
        'reviewed_at',
        'approved_by',
        'approved_at',
        'paid_at',
        'payment_method',
        'payment_reference',
        'notes',
        'created_by',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => PayrollStatus::class,
            'rate_type' => RateType::class,
            'payment_method' => PaymentMethod::class,
            'period_start' => 'date',
            'period_end' => 'date',
            'reviewed_at' => 'datetime',
            'approved_at' => 'datetime',
            'paid_at' => 'datetime',
            'total_days' => 'integer',
            'total_hours' => 'decimal:1',
            'overtime_hours' => 'decimal:1',
            'unit_price' => 'decimal:0',
            'base_amount' => 'decimal:2',
            'overtime_amount' => 'decimal:2',
            'allowance_amount' => 'decimal:2',
            'deduction_amount' => 'decimal:2',
            'net_amount' => 'decimal:2',
        ];
    }

    // ── Boot ────────────────────────────────────────────────────────

    protected static function booted(): void
    {
        static::creating(function (PayrollRecord $payroll) {
            if (empty($payroll->payroll_code)) {
                $payroll->payroll_code = static::generatePayrollCode();
            }
        });
    }

    // ── Relationships ───────────────────────────────────────────────

    /**
     * The worker this payroll belongs to.
     */
    public function worker(): BelongsTo
    {
        return $this->belongsTo(Worker::class);
    }

    /**
     * The staffing order this payroll is for.
     */
    public function staffingOrder(): BelongsTo
    {
        return $this->belongsTo(StaffingOrder::class, 'order_id');
    }

    /**
     * Alias for staffingOrder.
     */
    public function order(): BelongsTo
    {
        return $this->staffingOrder();
    }

    /**
     * The user who reviewed this payroll.
     */
    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Alias for reviewedBy.
     */
    public function reviewedByUser(): BelongsTo
    {
        return $this->reviewedBy();
    }

    /**
     * The user who approved this payroll.
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Alias for approvedBy.
     */
    public function approvedByUser(): BelongsTo
    {
        return $this->approvedBy();
    }

    /**
     * The user who created this payroll.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Alias for createdBy.
     */
    public function createdByUser(): BelongsTo
    {
        return $this->createdBy();
    }

    /**
     * Payments made for this payroll (polymorphic).
     */
    public function payments(): MorphMany
    {
        return $this->morphMany(Payment::class, 'payable');
    }

    // ── Scopes ──────────────────────────────────────────────────────

    /**
     * Scope to filter by status.
     */
    public function scopeByStatus(Builder $query, PayrollStatus $status): void
    {
        $query->where('status', $status);
    }

    /**
     * Scope to filter by period date range.
     */
    public function scopeForPeriod(Builder $query, string $from, string $to): void
    {
        $query->where('period_start', '>=', $from)
            ->where('period_end', '<=', $to);
    }

    /**
     * Scope to filter for a specific month and year.
     */
    public function scopeForMonth(Builder $query, int $month, int $year): void
    {
        $query->whereMonth('period_start', $month)
            ->whereYear('period_start', $year);
    }

    /**
     * Scope to filter by worker ID.
     */
    public function scopeForWorker(Builder $query, string $workerId): void
    {
        $query->where('worker_id', $workerId);
    }

    /**
     * Scope to filter unpaid payrolls.
     */
    public function scopeUnpaid(Builder $query): void
    {
        $query->whereNull('paid_at');
    }

    // ── Methods ─────────────────────────────────────────────────────

    /**
     * Calculate the net salary (base + overtime + allowance - deduction).
     */
    public function calculateNetSalary(): float
    {
        return (float) $this->base_amount
            + (float) $this->overtime_amount
            + (float) $this->allowance_amount
            - (float) $this->deduction_amount;
    }

    /**
     * Approve this payroll record.
     */
    public function approve(string $approvedById): bool
    {
        if (!in_array($this->status, [PayrollStatus::Draft, PayrollStatus::Reviewed])) {
            return false;
        }

        $this->update([
            'status' => PayrollStatus::Approved,
            'approved_by' => $approvedById,
            'approved_at' => now(),
        ]);

        return true;
    }

    /**
     * Mark this payroll as paid.
     */
    public function markPaid(?PaymentMethod $method = null, ?string $reference = null): bool
    {
        if ($this->status !== PayrollStatus::Approved) {
            return false;
        }

        $this->update([
            'status' => PayrollStatus::Paid,
            'paid_at' => now(),
            'payment_method' => $method,
            'payment_reference' => $reference,
        ]);

        return true;
    }

    /**
     * Generate a unique payroll code in the format PRL-YYYYMM-XXX.
     */
    public static function generatePayrollCode(): string
    {
        $prefix = 'PRL-' . now()->format('Ym') . '-';

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
