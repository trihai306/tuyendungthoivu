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
            'created_at' => $this->created_at,
            'worker_profile' => new WorkerProfileResource($this->whenLoaded('workerProfile')),
            'employer' => new EmployerResource($this->whenLoaded('employer')),
        ];
    }
}
