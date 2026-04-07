<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkerSkillResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'worker_profile_id' => $this->worker_profile_id,
            'skill_name' => $this->skill_name,
            'level' => $this->level,
            'years' => $this->years,
        ];
    }
}
