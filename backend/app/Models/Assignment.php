<?php

namespace App\Models;

use App\Enums\AssignmentStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Assignment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'order_id',
        'worker_id',
        'assigned_by',
        'status',
        'confirmation_note',
        'rejection_reason',
        'dispatch_info',
        'is_reconfirmed',
        'reconfirmed_at',
        'replaced_by_id',
        'replacement_reason',
        'confirmed_at',
        'started_at',
        'completed_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => AssignmentStatus::class,
            'is_reconfirmed' => 'boolean',
            'reconfirmed_at' => 'datetime',
            'confirmed_at' => 'datetime',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    // ── Relationships ───────────────────────────────────────────────

    /**
     * The staffing order this assignment belongs to.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(StaffingOrder::class, 'order_id');
    }

    /**
     * Alias for order relationship.
     */
    public function staffingOrder(): BelongsTo
    {
        return $this->order();
    }

    /**
     * The worker assigned.
     */
    public function worker(): BelongsTo
    {
        return $this->belongsTo(Worker::class);
    }

    /**
     * The user (recruiter) who made this assignment.
     */
    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    /**
     * The assignment that replaced this one (self-reference).
     */
    public function replacedBy(): BelongsTo
    {
        return $this->belongsTo(self::class, 'replaced_by_id');
    }

    /**
     * The original assignment that this one replaces.
     */
    public function replaces(): HasMany
    {
        return $this->hasMany(self::class, 'replaced_by_id');
    }

    /**
     * Attendance records for this assignment.
     */
    public function attendances(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class, 'assignment_id');
    }

    // ── Scopes ──────────────────────────────────────────────────────

    /**
     * Scope to filter active (non-terminal) assignments.
     */
    public function scopeActive(Builder $query): void
    {
        $query->whereIn('status', [
            AssignmentStatus::Created,
            AssignmentStatus::Contacted,
            AssignmentStatus::Confirmed,
            AssignmentStatus::Working,
        ]);
    }

    /**
     * Scope to filter terminal assignments.
     */
    public function scopeTerminal(Builder $query): void
    {
        $query->whereIn('status', [
            AssignmentStatus::Completed,
            AssignmentStatus::Rejected,
            AssignmentStatus::Cancelled,
            AssignmentStatus::Replaced,
        ]);
    }

    // ── Methods ─────────────────────────────────────────────────────

    /**
     * Confirm this assignment (worker accepted).
     */
    public function confirm(?string $note = null): bool
    {
        if (!in_array($this->status, [AssignmentStatus::Created, AssignmentStatus::Contacted])) {
            return false;
        }

        $this->update([
            'status' => AssignmentStatus::Confirmed,
            'confirmed_at' => now(),
            'confirmation_note' => $note,
        ]);

        return true;
    }

    /**
     * Reject this assignment (worker declined or unavailable).
     */
    public function reject(?string $reason = null): bool
    {
        if ($this->status->isTerminal()) {
            return false;
        }

        $this->update([
            'status' => AssignmentStatus::Rejected,
            'rejection_reason' => $reason,
        ]);

        return true;
    }

    /**
     * Mark this assignment as completed.
     */
    public function complete(): bool
    {
        if ($this->status !== AssignmentStatus::Working) {
            return false;
        }

        $this->update([
            'status' => AssignmentStatus::Completed,
            'completed_at' => now(),
        ]);

        return true;
    }
}
