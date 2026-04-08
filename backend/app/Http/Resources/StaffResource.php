<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StaffResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Determine role: prefer RBAC roles, fallback to legacy role column
        $primaryRole = $this->roles?->first()?->name ?? $this->role ?? 'viewer';

        // Compute stats from task assignments if loaded
        $tasksCompleted = 0;
        $tasksPending = 0;
        if ($this->relationLoaded('assignedTasks')) {
            $tasksCompleted = $this->assignedTasks->where('status', 'completed')->count();
            $tasksPending = $this->assignedTasks->whereIn('status', ['pending', 'in_progress'])->count();
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'phone_ext' => $this->phone_ext,
            'employee_code' => $this->employee_code,
            'role' => $primaryRole,
            'department' => new DepartmentResource($this->whenLoaded('department')),
            'team' => new TeamResource($this->whenLoaded('team')),
            'position' => $this->position,
            'avatar' => $this->avatar_url,
            'is_active' => (bool) $this->is_active,
            'hire_date' => $this->hire_date?->toDateString(),
            'stats' => [
                'tasks_completed' => $tasksCompleted,
                'tasks_pending' => $tasksPending,
                'interviews_done' => 0, // placeholder until interview tracking is implemented
                'applications_reviewed' => 0, // placeholder
            ],
        ];
    }
}
