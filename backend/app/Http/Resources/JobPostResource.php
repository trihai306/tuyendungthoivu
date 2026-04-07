<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobPostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'employer_id' => $this->employer_id,
            'title' => $this->title,
            'description' => $this->description,
            'requirements' => $this->requirements,
            'benefits' => $this->benefits,
            'job_type' => $this->job_type,
            'positions_count' => $this->positions_count,
            'filled_count' => $this->filled_count,
            'salary_type' => $this->salary_type,
            'salary_amount' => $this->salary_amount,
            'shift_type' => $this->shift_type,
            'work_start_date' => $this->work_start_date?->format('Y-m-d'),
            'work_end_date' => $this->work_end_date?->format('Y-m-d'),
            'work_address' => $this->work_address,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'region_id' => $this->region_id,
            'has_housing' => $this->has_housing,
            'min_age' => $this->min_age,
            'max_age' => $this->max_age,
            'gender_req' => $this->gender_req,
            'deadline' => $this->deadline?->format('Y-m-d'),
            'status' => $this->status,
            'view_count' => $this->view_count,
            'employer' => new EmployerResource($this->whenLoaded('employer')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
