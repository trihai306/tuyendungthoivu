<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role,
            'status' => $this->status,
            'credit_score' => $this->credit_score,
            'avatar_url' => $this->avatar_url,
            'last_login_at' => $this->last_login_at,
            'position' => $this->position,
            'phone_ext' => $this->phone_ext,
            'employee_code' => $this->employee_code,
            'hire_date' => $this->hire_date,
            'is_active' => $this->is_active,
            'department_id' => $this->department_id,
            'team_id' => $this->team_id,
            'created_at' => $this->created_at,
            'worker_profile' => new WorkerProfileResource($this->whenLoaded('workerProfile')),
            'employer' => new EmployerResource($this->whenLoaded('employer')),
            'department' => new DepartmentResource($this->whenLoaded('department')),
            'team' => new TeamResource($this->whenLoaded('team')),
            'roles' => RoleResource::collection($this->whenLoaded('roles')),
        ];
    }
}
