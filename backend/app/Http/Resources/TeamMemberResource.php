<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamMemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'avatar_url' => $this->avatar_url,
            'position' => $this->position,
            'role_in_team' => $this->whenPivotLoaded('team_members', fn () => $this->pivot->role_in_team),
            'joined_at' => $this->whenPivotLoaded('team_members', fn () => $this->pivot->joined_at),
        ];
    }
}
