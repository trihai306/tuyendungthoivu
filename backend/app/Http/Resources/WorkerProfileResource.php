<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkerProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'full_name' => $this->full_name,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'gender' => $this->gender,
            'id_card_number' => $this->id_card_number,
            'permanent_address' => $this->permanent_address,
            'current_address' => $this->current_address,
            'emergency_contact_name' => $this->emergency_contact_name,
            'emergency_contact_phone' => $this->emergency_contact_phone,
            'bank_name' => $this->bank_name,
            'bank_account' => $this->bank_account,
            'bank_holder' => $this->bank_holder,
            'needs_housing' => $this->needs_housing,
            'ekyc_status' => $this->ekyc_status,
            'skills' => $this->skills,
            'experience_years' => $this->experience_years,
            'education' => $this->education,
            'bio' => $this->bio,
            'availability_status' => $this->availability_status,
            'rating' => $this->rating,
            'review_count' => $this->review_count,
            'city' => $this->city,
            'district' => $this->district,
            'desired_job_types' => $this->desired_job_types,
            'desired_locations' => $this->desired_locations,
            'desired_salary' => $this->desired_salary,
            'preferred_shift' => $this->preferred_shift,
            'health_status' => $this->health_status,
            'vehicle' => $this->vehicle,
            'ekyc_verified_at' => $this->ekyc_verified_at,
            'id_card_front' => $this->id_card_front,
            'id_card_back' => $this->id_card_back,
            'selfie_url' => $this->selfie_url,
            'user' => new UserResource($this->whenLoaded('user')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
