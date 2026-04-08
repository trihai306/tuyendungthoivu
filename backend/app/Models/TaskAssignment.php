<?php

namespace App\Models;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use App\Enums\TaskType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class TaskAssignment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title',
        'description',
        'type',
        'priority',
        'status',
        'assigned_by',
        'assigned_to',
        'related_type',
        'related_id',
        'deadline',
        'started_at',
        'completed_at',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'type' => TaskType::class,
            'priority' => TaskPriority::class,
            'status' => TaskStatus::class,
            'deadline' => 'datetime',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    // ── Relationships ────────────────────────────────────────────────

    /**
     * The user who created/assigned this task.
     */
    public function assigner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    /**
     * The user to whom this task is assigned.
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * The related entity (polymorphic: Application, JobPost, etc.).
     */
    public function related(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Comments on this task.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(TaskComment::class, 'task_id');
    }

    // ── Scopes ───────────────────────────────────────────────────────

    /**
     * Scope to tasks assigned to a specific user.
     */
    public function scopeAssignedTo($query, string $userId)
    {
        return $query->where('assigned_to', $userId);
    }

    /**
     * Scope to tasks created by a specific user.
     */
    public function scopeAssignedBy($query, string $userId)
    {
        return $query->where('assigned_by', $userId);
    }

    /**
     * Scope to filter by status.
     */
    public function scopeWithStatus($query, TaskStatus|string $status)
    {
        $value = $status instanceof TaskStatus ? $status->value : $status;
        return $query->where('status', $value);
    }

    /**
     * Scope to filter by priority.
     */
    public function scopeWithPriority($query, TaskPriority|string $priority)
    {
        $value = $priority instanceof TaskPriority ? $priority->value : $priority;
        return $query->where('priority', $value);
    }

    /**
     * Scope to tasks that are overdue (past deadline and not completed/cancelled).
     */
    public function scopeOverdue($query)
    {
        return $query->whereNotNull('deadline')
            ->where('deadline', '<', now())
            ->whereNotIn('status', [TaskStatus::Completed->value, TaskStatus::Cancelled->value]);
    }

    /**
     * Scope to pending or in_progress tasks.
     */
    public function scopeOpen($query)
    {
        return $query->whereIn('status', [TaskStatus::Pending->value, TaskStatus::InProgress->value]);
    }

    // ── Accessors ────────────────────────────────────────────────────

    /**
     * Check if the task is overdue.
     */
    public function getIsOverdueAttribute(): bool
    {
        return $this->deadline
            && $this->deadline->isPast()
            && !in_array($this->status, [TaskStatus::Completed, TaskStatus::Cancelled]);
    }
}
