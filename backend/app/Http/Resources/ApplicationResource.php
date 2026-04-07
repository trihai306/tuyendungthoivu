<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'job_post_id' => $this->job_post_id,
            'worker_profile_id' => $this->worker_profile_id,
            'cover_letter' => $this->cover_letter,
            'status' => $this->status,
            'match_score' => $this->match_score,
            'notes' => $this->notes,
            'applied_at' => $this->applied_at,
            'job_post' => new JobPostResource($this->whenLoaded('jobPost')),
            'worker_profile' => new WorkerProfileResource($this->whenLoaded('workerProfile')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
