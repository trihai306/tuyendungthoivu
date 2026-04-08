<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceNewResource extends JsonResource
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
            'invoice_number' => $this->invoice_number,
            'client' => [
                'id' => $this->client?->id,
                'company_name' => $this->client?->company_name,
                'contact_name' => $this->client?->contact_name,
                'contact_phone' => $this->client?->contact_phone,
                'contact_email' => $this->client?->contact_email,
            ],
            'period_start' => $this->period_start?->format('Y-m-d'),
            'period_end' => $this->period_end?->format('Y-m-d'),
            'items' => InvoiceItemResource::collection($this->whenLoaded('items')),
            'subtotal' => $this->subtotal,
            'tax_rate' => $this->tax_rate,
            'tax_amount' => $this->tax_amount,
            'total_amount' => $this->total_amount,
            'paid_amount' => $this->paid_amount,
            'remaining' => $this->remaining_balance,
            'status' => $this->status?->value,
            'status_label' => $this->status?->label(),
            'status_color' => $this->status?->color(),
            'due_date' => $this->due_date?->format('Y-m-d'),
            'approved_by' => $this->approver?->name,
            'approved_at' => $this->approved_at,
            'sent_at' => $this->sent_at,
            'notes' => $this->notes,
            'created_by' => $this->creator?->name,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
