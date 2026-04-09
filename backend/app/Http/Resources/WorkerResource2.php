<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource for the new Worker model (staffing system).
 * Named WorkerResource2 to avoid conflict with the existing WorkerProfileResource.
 */
class WorkerResource2 extends JsonResource
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
            'worker_code' => $this->worker_code,
            'user_id' => $this->user_id,

            // Personal info
            'full_name' => $this->full_name,
            'date_of_birth' => $this->date_of_birth?->toDateString(),
            'gender' => $this->gender?->value,
            'gender_label' => $this->gender?->label(),
            'id_number' => $this->id_number,
            'id_issued_date' => $this->id_issued_date,
            'id_issued_place' => $this->id_issued_place,
            'id_card_front_url' => $this->id_card_front_url,
            'id_card_back_url' => $this->id_card_back_url,
            'phone' => $this->phone,
            'email' => $this->email,
            'zalo' => $this->zalo,
            'facebook_url' => $this->facebook_url,
            'address' => $this->address,
            'district' => $this->district,
            'city' => $this->city,
            'avatar_url' => $this->avatar_url,

            // Work info
            'experience_notes' => $this->experience_notes,
            'preferred_districts' => $this->preferred_districts,
            'availability' => $this->availability,

            // Skills
            'skills' => SkillResource::collection($this->whenLoaded('skills')),

            // Bank info
            'bank_name' => $this->bank_name,
            'bank_account' => $this->bank_account,
            'bank_account_name' => $this->bank_account_name,

            // Stats
            'total_orders' => $this->total_orders,
            'total_days_worked' => $this->total_days_worked,
            'average_rating' => $this->average_rating,
            'no_show_count' => $this->no_show_count,
            'last_worked_date' => $this->last_worked_date?->toDateString(),

            // Status
            'status' => $this->status?->value,
            'status_label' => $this->status?->label(),
            'status_color' => $this->status?->color(),
            'blacklist_reason' => $this->blacklist_reason,

            // Management
            'registered_by' => new UserResource($this->whenLoaded('registeredBy')),
            'notes' => $this->notes,
            'emergency_contact_name' => $this->emergency_contact_name,
            'emergency_contact_phone' => $this->emergency_contact_phone,

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
