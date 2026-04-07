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
            'skills' => WorkerSkillResource::collection($this->whenLoaded('skills')),
            'user' => new UserResource($this->whenLoaded('user')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
