<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StaffingOrderResource extends JsonResource
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
            'order_code' => $this->order_code,

            // Client info
            'client_id' => $this->client_id,
            'client' => new ClientResource($this->whenLoaded('client')),
            'contract_id' => $this->contract_id,

            // Job info
            'position_name' => $this->position_name,
            'job_description' => $this->job_description,
            'work_address' => $this->work_address,
            'work_district' => $this->work_district,
            'work_city' => $this->work_city,

            // Quantity
            'quantity_needed' => $this->quantity_needed,
            'quantity_filled' => $this->quantity_filled,
            'progress_percent' => $this->progress_percent,

            // Requirements
            'gender_requirement' => $this->gender_requirement?->value,
            'age_min' => $this->age_min,
            'age_max' => $this->age_max,
            'required_skills' => $this->required_skills,
            'other_requirements' => $this->other_requirements,

            // Schedule
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'shift_type' => $this->shift_type,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'break_minutes' => $this->break_minutes,

            // Financial
            'worker_rate' => $this->worker_rate,
            'rate_type' => $this->rate_type?->value,
            'service_fee' => $this->service_fee,
            'service_fee_type' => $this->service_fee_type,
            'overtime_rate' => $this->overtime_rate,

            // Management
            'urgency' => $this->urgency?->value,
            'urgency_label' => $this->urgency?->label(),
            'urgency_color' => $this->urgency?->color(),
            'service_type' => $this->service_type?->value,
            'service_type_label' => $this->service_type?->label(),
            'status' => $this->status?->value,
            'status_label' => $this->status?->label(),
            'status_color' => $this->status?->color(),

            // People
            'assigned_recruiter_id' => $this->assigned_recruiter_id,
            'assigned_to' => new UserResource($this->whenLoaded('assignedRecruiter')),
            'created_by' => new UserResource($this->whenLoaded('createdBy')),
            'approved_by' => new UserResource($this->whenLoaded('approvedBy')),
            'approved_at' => $this->approved_at,

            // Additional info
            'rejection_reason' => $this->rejection_reason,
            'cancellation_reason' => $this->cancellation_reason,
            'notes' => $this->notes,
            'uniform_requirement' => $this->uniform_requirement,

            // Counts
            'assignments_count' => $this->when(
                $this->assignments_count !== null,
                $this->assignments_count
            ),

            // Relations
            'assignments' => AssignmentResource::collection($this->whenLoaded('assignments')),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
