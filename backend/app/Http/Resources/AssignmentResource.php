<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssignmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'worker_id' => $this->worker_id,

            // Status
            'status' => $this->status?->value,
            'status_label' => $this->status?->label(),
            'status_color' => $this->status?->color(),
            'is_active' => $this->status?->isActive(),

            // Notes & reasons
            'confirmation_note' => $this->confirmation_note,
            'rejection_reason' => $this->rejection_reason,
            'dispatch_info' => $this->dispatch_info,
            'replacement_reason' => $this->replacement_reason,

            // Reconfirmation
            'is_reconfirmed' => $this->is_reconfirmed,
            'reconfirmed_at' => $this->reconfirmed_at,

            // Replacement
            'replaced_by_id' => $this->replaced_by_id,

            // Timestamps
            'confirmed_at' => $this->confirmed_at,
            'started_at' => $this->started_at,
            'completed_at' => $this->completed_at,

            // Relations
            'order' => new StaffingOrderResource($this->whenLoaded('order')),
            'worker' => new WorkerResource2($this->whenLoaded('worker')),
            'assigned_by' => new UserResource($this->whenLoaded('assignedBy')),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
