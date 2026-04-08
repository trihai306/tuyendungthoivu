<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskAssignmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'type' => $this->type,
            'type_label' => $this->type->label(),
            'priority' => $this->priority,
            'priority_label' => $this->priority->label(),
            'status' => $this->status,
            'status_label' => $this->status->label(),
            'is_overdue' => $this->is_overdue,
            'related_type' => $this->related_type,
            'related_id' => $this->related_id,
            'deadline' => $this->deadline,
            'started_at' => $this->started_at,
            'completed_at' => $this->completed_at,
            'notes' => $this->notes,
            'assigner' => new UserResource($this->whenLoaded('assigner')),
            'assignee' => new UserResource($this->whenLoaded('assignee')),
            'comments' => TaskCommentResource::collection($this->whenLoaded('comments')),
            'comments_count' => $this->whenCounted('comments'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
