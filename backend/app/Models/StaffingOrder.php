<?php

namespace App\Models;

use App\Enums\Gender;
use App\Enums\OrderStatus;
use App\Enums\OrderUrgency;
use App\Enums\RateType;
use App\Enums\ServiceType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class StaffingOrder extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'order_code',
        'client_id',
        'client_contact_id',
        'contract_id',
        'position_name',
        'job_description',
        'work_address',
        'work_district',
        'work_city',
        'quantity_needed',
        'quantity_filled',
        'gender_requirement',
        'age_min',
        'age_max',
        'required_skills',
        'other_requirements',
        'start_date',
        'end_date',
        'shift_type',
        'start_time',
        'end_time',
        'break_minutes',
        'worker_rate',
        'rate_type',
        'service_fee',
        'service_fee_type',
        'overtime_rate',
        'urgency',
        'service_type',
        'status',
        'assigned_recruiter_id',
        'created_by',
        'approved_by',
        'approved_at',
        'rejection_reason',
        'cancellation_reason',
        'notes',
        'uniform_requirement',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'urgency' => OrderUrgency::class,
            'service_type' => ServiceType::class,
            'rate_type' => RateType::class,
            'gender_requirement' => Gender::class,
            'required_skills' => 'array',
            'start_date' => 'date',
            'end_date' => 'date',
            'approved_at' => 'datetime',
            'quantity_needed' => 'integer',
            'quantity_filled' => 'integer',
            'age_min' => 'integer',
            'age_max' => 'integer',
            'break_minutes' => 'integer',
            'worker_rate' => 'decimal:0',
            'service_fee' => 'decimal:0',
            'overtime_rate' => 'decimal:0',
        ];
    }

    // ── Boot ────────────────────────────────────────────────────────

    protected static function booted(): void
    {
        static::creating(function (StaffingOrder $order) {
            if (empty($order->order_code)) {
                $order->order_code = static::generateOrderCode();
            }
        });
    }

    // ── Relationships ───────────────────────────────────────────────

    /**
     * The client who placed this order.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * The client contact for this order.
     */
    public function clientContact(): BelongsTo
    {
        return $this->belongsTo(ClientContact::class);
    }

    /**
     * The contract this order falls under.
     */
    public function contract(): BelongsTo
    {
        return $this->belongsTo(ClientContract::class, 'contract_id');
    }

    /**
     * Worker assignments for this order.
     */
    public function assignments(): HasMany
    {
        return $this->hasMany(Assignment::class, 'order_id');
    }

    /**
     * Workers assigned to this order (through assignments pivot).
     */
    public function workers(): BelongsToMany
    {
        return $this->belongsToMany(Worker::class, 'assignments', 'order_id', 'worker_id')
            ->withPivot(['status', 'assigned_by', 'confirmed_at', 'completed_at'])
            ->withTimestamps();
    }

    /**
     * The recruiter assigned to handle this order.
     */
    public function assignedRecruiter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_recruiter_id');
    }

    /**
     * Alias: the user this order is assigned to (recruiter).
     */
    public function assignedTo(): BelongsTo
    {
        return $this->assignedRecruiter();
    }

    /**
     * The manager who approved this order.
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Alias for approvedBy.
     */
    public function approver(): BelongsTo
    {
        return $this->approvedBy();
    }

    /**
     * The user (Sales) who created this order.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Alias for createdBy.
     */
    public function creator(): BelongsTo
    {
        return $this->createdBy();
    }

    /**
     * Attendance records for this order.
     */
    public function attendances(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class, 'order_id');
    }

    /**
     * Payroll records associated with this order.
     */
    public function payrolls(): HasMany
    {
        return $this->hasMany(PayrollRecord::class, 'order_id');
    }

    /**
     * Invoice items referencing this order.
     */
    public function invoiceItems(): HasMany
    {
        return $this->hasMany(InvoiceItem::class, 'order_id');
    }

    /**
     * Worker ratings for this order.
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(WorkerRating::class, 'order_id');
    }

    // ── Scopes ──────────────────────────────────────────────────────

    /**
     * Scope to filter active (non-completed, non-cancelled) orders.
     */
    public function scopeActive(Builder $query): void
    {
        $query->whereNotIn('status', [
            OrderStatus::Completed,
            OrderStatus::Cancelled,
        ]);
    }

    /**
     * Scope to filter orders by status.
     */
    public function scopeByStatus(Builder $query, OrderStatus $status): void
    {
        $query->where('status', $status);
    }

    /**
     * Scope to filter orders by urgency.
     */
    public function scopeByUrgency(Builder $query, OrderUrgency $urgency): void
    {
        $query->where('urgency', $urgency);
    }

    /**
     * Scope to filter orders that still need workers.
     */
    public function scopeNeedsWorkers(Builder $query): void
    {
        $query->whereColumn('quantity_filled', '<', 'quantity_needed')
            ->whereIn('status', [
                OrderStatus::Approved,
                OrderStatus::Recruiting,
            ]);
    }

    /**
     * Scope to filter orders by city.
     */
    public function scopeByCity(Builder $query, string $city): void
    {
        $query->where('work_city', $city);
    }

    /**
     * Scope for search by order code, position name, or client name.
     */
    public function scopeSearch(Builder $query, string $term): void
    {
        $query->where(function (Builder $q) use ($term) {
            $q->where('order_code', 'ilike', "%{$term}%")
                ->orWhere('position_name', 'ilike', "%{$term}%")
                ->orWhereHas('client', function (Builder $clientQuery) use ($term) {
                    $clientQuery->where('company_name', 'ilike', "%{$term}%");
                });
        });
    }

    // ── Computed Attributes ─────────────────────────────────────────

    /**
     * Get the progress percentage of filled positions.
     */
    public function getProgressPercentAttribute(): float
    {
        if ($this->quantity_needed <= 0) {
            return 0;
        }

        return round(($this->quantity_filled / $this->quantity_needed) * 100, 1);
    }

    // ── Methods ─────────────────────────────────────────────────────

    /**
     * Check if the order is fully staffed.
     */
    public function isFullyStaffed(): bool
    {
        return $this->quantity_filled >= $this->quantity_needed;
    }

    /**
     * Get the number of remaining worker slots.
     */
    public function remainingSlots(): int
    {
        return max(0, $this->quantity_needed - $this->quantity_filled);
    }

    /**
     * Check if the order can be approved.
     */
    public function canBeApproved(): bool
    {
        return $this->status === OrderStatus::Pending
            && $this->client_id !== null
            && $this->quantity_needed > 0
            && $this->start_date !== null;
    }

    /**
     * Generate a unique order code in the format DH-YYYYMMDD-XXX.
     */
    public static function generateOrderCode(): string
    {
        $today = now()->format('Ymd');
        $prefix = "DH-{$today}-";

        $latestOrder = static::withTrashed()
            ->where('order_code', 'like', "{$prefix}%")
            ->orderByDesc('order_code')
            ->first();

        if ($latestOrder) {
            $lastNumber = (int) substr($latestOrder->order_code, -3);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return $prefix . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    }
}
