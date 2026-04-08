<?php

namespace App\Services;

use App\Enums\TaskStatus;
use App\Models\TaskAssignment;
use App\Models\TaskComment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class TaskAssignmentService
{
    public function __construct(
        private readonly ActivityLogService $activityLogService
    ) {}

    /**
     * List tasks with optional filters.
     */
    public function list(array $filters): LengthAwarePaginator
    {
        $query = TaskAssignment::with(['assigner', 'assignee', 'comments.user'])->latest();

        if (!empty($filters['assigned_to'])) {
            $query->assignedTo($filters['assigned_to']);
        }

        if (!empty($filters['assigned_by'])) {
            $query->assignedBy($filters['assigned_by']);
        }

        if (!empty($filters['status'])) {
            $query->withStatus($filters['status']);
        }

        if (!empty($filters['priority'])) {
            $query->withPriority($filters['priority']);
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'ilike', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'ilike', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['overdue']) && $filters['overdue'] === 'true') {
            $query->overdue();
        }

        // Sort by priority weight then deadline
        if (!empty($filters['sort_by']) && $filters['sort_by'] === 'priority') {
            $query->orderByRaw("
                CASE priority
                    WHEN 'urgent' THEN 4
                    WHEN 'high' THEN 3
                    WHEN 'medium' THEN 2
                    WHEN 'low' THEN 1
                    ELSE 0
                END DESC
            ");
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Get tasks for the authenticated user.
     */
    public function myTasks(string $userId, array $filters): LengthAwarePaginator
    {
        $filters['assigned_to'] = $userId;
        return $this->list($filters);
    }

    /**
     * Get tasks for a team (all members).
     */
    public function teamTasks(string $teamId, array $filters): LengthAwarePaginator
    {
        $query = TaskAssignment::with(['assigner', 'assignee', 'comments.user'])
            ->whereHas('assignee', function ($q) use ($teamId) {
                $q->whereHas('teams', function ($q2) use ($teamId) {
                    $q2->where('teams.id', $teamId);
                });
            })
            ->latest();

        if (!empty($filters['status'])) {
            $query->withStatus($filters['status']);
        }

        if (!empty($filters['priority'])) {
            $query->withPriority($filters['priority']);
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Create a new task assignment.
     */
    public function create(array $data, string $assignedBy, ?string $ip = null): TaskAssignment
    {
        return DB::transaction(function () use ($data, $assignedBy, $ip) {
            $data['assigned_by'] = $assignedBy;
            $data['status'] = TaskStatus::Pending->value;

            $task = TaskAssignment::create($data);

            $this->activityLogService->log(
                userId: $assignedBy,
                action: 'assigned',
                description: "Assigned task: {$task->title} to user {$task->assigned_to}",
                loggable: $task,
                metadata: [
                    'assigned_to' => $task->assigned_to,
                    'type' => $task->type->value,
                    'priority' => $task->priority->value,
                ],
                ipAddress: $ip,
            );

            return $task->load(['assigner', 'assignee']);
        });
    }

    /**
     * Update task status with proper transition validation.
     */
    public function updateStatus(TaskAssignment $task, TaskStatus $newStatus, ?string $notes = null, ?string $userId = null, ?string $ip = null): TaskAssignment
    {
        $currentStatus = $task->status;

        if (!$currentStatus->canTransitionTo($newStatus)) {
            throw new \InvalidArgumentException(
                "Không thể chuyển trạng thái từ '{$currentStatus->label()}' sang '{$newStatus->label()}'."
            );
        }

        return DB::transaction(function () use ($task, $newStatus, $notes, $userId, $ip) {
            $updates = ['status' => $newStatus->value];

            if ($newStatus === TaskStatus::InProgress && !$task->started_at) {
                $updates['started_at'] = now();
            }

            if ($newStatus === TaskStatus::Completed) {
                $updates['completed_at'] = now();
            }

            if ($notes) {
                $updates['notes'] = $notes;
            }

            $task->update($updates);

            $this->activityLogService->log(
                userId: $userId,
                action: 'status_changed',
                description: "Task '{$task->title}' status changed to {$newStatus->label()}",
                loggable: $task,
                metadata: [
                    'old_status' => $task->getOriginal('status'),
                    'new_status' => $newStatus->value,
                ],
                ipAddress: $ip,
            );

            return $task->load(['assigner', 'assignee', 'comments.user']);
        });
    }

    /**
     * Add a comment to a task.
     */
    public function addComment(TaskAssignment $task, string $userId, string $content, ?string $ip = null): TaskComment
    {
        return DB::transaction(function () use ($task, $userId, $content, $ip) {
            $comment = $task->comments()->create([
                'user_id' => $userId,
                'content' => $content,
            ]);

            $this->activityLogService->log(
                userId: $userId,
                action: 'commented',
                description: "Commented on task: {$task->title}",
                loggable: $task,
                ipAddress: $ip,
            );

            return $comment->load('user');
        });
    }

    /**
     * Get a single task with all relations.
     */
    public function find(string $taskId): TaskAssignment
    {
        return TaskAssignment::with(['assigner', 'assignee', 'related', 'comments.user'])
            ->findOrFail($taskId);
    }
}
