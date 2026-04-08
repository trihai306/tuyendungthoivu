<?php

namespace App\Models;

use App\Enums\AttendanceStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceRecord extends Model
{
    use HasFactory, HasUuids;

    /**
     * Use a separate table to avoid conflict with the legacy attendances table.
     */
    protected $table = 'attendances_new';

    protected $fillable = [
        'assignment_id',
        'worker_id',
        'order_id',
        'work_date',
        'check_in_time',
        'check_in_by',
        'check_in_note',
        'check_out_time',
        'check_out_by',
        'check_out_note',
        'break_minutes',
        'total_hours',
        'overtime_hours',
        'status',
        'is_approved',
        'approved_by',
        'approved_at',
        'adjustment_reason',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => AttendanceStatus::class,
            'work_date' => 'date',
            'check_in_time' => 'datetime',
            'check_out_time' => 'datetime',
            'break_minutes' => 'integer',
            'total_hours' => 'decimal:1',
            'overtime_hours' => 'decimal:1',
            'is_approved' => 'boolean',
            'approved_at' => 'datetime',
        ];
    }

    // ── Relationships ───────────────────────────────────────────────

    /**
     * The assignment this attendance belongs to.
     */
    public function assignment(): BelongsTo
    {
        return $this->belongsTo(Assignment::class);
    }

    /**
     * Alias for the assignment relationship using WorkerAssignment name.
     */
    public function workerAssignment(): BelongsTo
    {
        return $this->assignment();
    }

    /**
     * The worker who this attendance record is for.
     */
    public function worker(): BelongsTo
    {
        return $this->belongsTo(Worker::class);
    }

    /**
     * The staffing order this attendance is associated with.
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
     * The user who recorded check-in.
     */
    public function checkInBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'check_in_by');
    }

    /**
     * Alias for checkInBy.
     */
    public function checkedInBy(): BelongsTo
    {
        return $this->checkInBy();
    }

    /**
     * The user who recorded check-out.
     */
    public function checkOutBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'check_out_by');
    }

    /**
     * Alias for checkOutBy.
     */
    public function checkedOutBy(): BelongsTo
    {
        return $this->checkOutBy();
    }

    /**
     * The user who approved (verified) this attendance record.
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Alias for approvedBy.
     */
    public function verifiedBy(): BelongsTo
    {
        return $this->approvedBy();
    }

    // ── Scopes ──────────────────────────────────────────────────────

    /**
     * Scope to filter by a specific work date.
     */
    public function scopeForDate(Builder $query, string $date): void
    {
        $query->where('work_date', $date);
    }

    /**
     * Scope to filter by work date range.
     */
    public function scopeForDateRange(Builder $query, string $from, string $to): void
    {
        $query->whereBetween('work_date', [$from, $to]);
    }

    /**
     * Scope to filter by order ID.
     */
    public function scopeForOrder(Builder $query, string $orderId): void
    {
        $query->where('order_id', $orderId);
    }

    /**
     * Scope to filter by worker ID.
     */
    public function scopeForWorker(Builder $query, string $workerId): void
    {
        $query->where('worker_id', $workerId);
    }

    /**
     * Scope to filter approved records only.
     */
    public function scopeApproved(Builder $query): void
    {
        $query->where('is_approved', true);
    }

    /**
     * Scope to filter pending (unapproved) records.
     */
    public function scopePending(Builder $query): void
    {
        $query->where('is_approved', false);
    }

    // ── Methods ─────────────────────────────────────────────────────

    /**
     * Calculate total working hours from check-in/check-out times.
     *
     * @return float|null Total hours worked, or null if times are incomplete.
     */
    public function calculateHours(): ?float
    {
        if (!$this->check_in_time || !$this->check_out_time) {
            return null;
        }

        $diffMinutes = $this->check_in_time->diffInMinutes($this->check_out_time);
        $workMinutes = $diffMinutes - ($this->break_minutes ?? 0);

        return round(max(0, $workMinutes) / 60, 1);
    }

    /**
     * Determine if the worker was late based on the order's start time.
     */
    public function isLate(): bool
    {
        if (!$this->check_in_time) {
            return false;
        }

        $order = $this->staffingOrder;
        if (!$order || !$order->start_time) {
            return false;
        }

        $expectedStart = $this->work_date->copy()->setTimeFromTimeString($order->start_time);

        return $this->check_in_time->gt($expectedStart);
    }
}
