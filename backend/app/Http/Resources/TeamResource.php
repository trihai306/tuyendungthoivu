<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'department_id' => $this->department_id,
            'name' => $this->name,
            'description' => $this->description,
            'status' => $this->status,
            'department' => new DepartmentResource($this->whenLoaded('department')),
            'lead' => new UserResource($this->whenLoaded('lead')),
            'members' => TeamMemberResource::collection($this->whenLoaded('members')),
            'member_count' => $this->when(isset($this->member_count), $this->member_count),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
