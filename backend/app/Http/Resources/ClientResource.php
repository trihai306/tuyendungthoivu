<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
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
            'company_name' => $this->company_name,
            'tax_code' => $this->tax_code,
            'industry' => $this->industry,
            'company_size' => $this->company_size,
            'address' => $this->address,
            'district' => $this->district,
            'city' => $this->city,
            'contact_name' => $this->contact_name,
            'contact_phone' => $this->contact_phone,
            'contact_email' => $this->contact_email,
            'website' => $this->website,
            'status' => $this->status?->value,
            'status_label' => $this->status?->label(),
            'status_color' => $this->status?->color(),
            'logo_path' => $this->logo_path,
            'notes' => $this->notes,
            'active_orders_count' => $this->when(
                $this->relationLoaded('staffingOrders') || $this->active_orders_count !== null,
                fn () => $this->active_orders_count
            ),
            'created_by' => new UserResource($this->whenLoaded('createdBy')),
            'contracts_count' => $this->when(
                $this->contracts_count !== null,
                $this->contracts_count
            ),
            'staffing_orders_count' => $this->when(
                $this->staffing_orders_count !== null,
                $this->staffing_orders_count
            ),
            'contracts' => ClientContractResource::collection($this->whenLoaded('contracts')),
            'staffing_orders' => StaffingOrderResource::collection($this->whenLoaded('staffingOrders')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
