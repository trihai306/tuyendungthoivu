<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'dormitory_id' => $this->dormitory_id,
            'room_number' => $this->room_number,
            'floor' => $this->floor,
            'room_type' => $this->room_type,
            'area_sqm' => $this->area_sqm,
            'capacity' => $this->capacity,
            'current_occupancy' => $this->current_occupancy,
            'price' => $this->price,
            'amenities' => $this->amenities,
            'photos' => $this->photos,
            'status' => $this->status,
            'dormitory' => new DormitoryResource($this->whenLoaded('dormitory')),
            'beds' => BedResource::collection($this->whenLoaded('beds')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
