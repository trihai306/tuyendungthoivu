<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SkillResource extends JsonResource
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
            'name' => $this->name,
            'category' => $this->category,
            'description' => $this->description,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            // Pivot data (when loaded through worker relationship)
            'level' => $this->whenPivotLoaded('worker_skill', fn () => $this->pivot->level),
            'years_experience' => $this->whenPivotLoaded('worker_skill', fn () => $this->pivot->years_experience),
        ];
    }
}
