<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
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
            'payable_type' => $this->payable_type,
            'payable_id' => $this->payable_id,
            'payable_info' => $this->getPayableInfo(),
            'amount' => $this->amount,
            'payment_method' => $this->payment_method?->value,
            'payment_method_label' => $this->payment_method?->label(),
            'payment_date' => $this->payment_date?->format('Y-m-d'),
            'reference_number' => $this->reference_number,
            'notes' => $this->notes,
            'recorded_by' => $this->recorder?->name,
            'created_at' => $this->created_at,
        ];
    }

    /**
     * Get summary info about the payable entity.
     *
     * @return array<string, mixed>|null
     */
    protected function getPayableInfo(): ?array
    {
        $payable = $this->payable;

        if (!$payable) {
            return null;
        }

        // Invoice
        if ($this->payable_type === 'invoice') {
            return [
                'code' => $payable->invoice_number ?? null,
                'client' => $payable->client?->company_name ?? null,
                'total' => $payable->total_amount ?? null,
            ];
        }

        // PayrollRecord
        if ($this->payable_type === 'payroll') {
            return [
                'code' => $payable->payroll_code ?? null,
                'worker' => $payable->worker?->full_name ?? null,
                'total' => $payable->net_amount ?? null,
            ];
        }

        return null;
    }
}
