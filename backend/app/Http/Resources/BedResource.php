<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BedResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'room_id' => $this->room_id,
            'bed_number' => $this->bed_number,
            'bed_position' => $this->bed_position,
            'price' => $this->price,
            'status' => $this->status,
            'current_occupant_id' => $this->current_occupant_id,
            'current_occupant' => new WorkerProfileResource($this->whenLoaded('currentOccupant')),
            'room' => new RoomResource($this->whenLoaded('room')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
