<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DormitoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'landlord_id' => $this->landlord_id,
            'region_id' => $this->region_id,
            'name' => $this->name,
            'address' => $this->address,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'total_rooms' => $this->total_rooms,
            'total_beds' => $this->total_beds,
            'has_wifi' => $this->has_wifi,
            'has_ac' => $this->has_ac,
            'has_hot_water' => $this->has_hot_water,
            'has_kitchen' => $this->has_kitchen,
            'has_parking' => $this->has_parking,
            'has_security' => $this->has_security,
            'electricity_rate' => $this->electricity_rate,
            'water_rate' => $this->water_rate,
            'deposit_amount' => $this->deposit_amount,
            'rules' => $this->rules,
            'photos' => $this->photos,
            'rating' => $this->rating,
            'status' => $this->status,
            'rooms' => RoomResource::collection($this->whenLoaded('rooms')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
