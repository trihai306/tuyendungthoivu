<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayrollNewResource extends JsonResource
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
            'payroll_code' => $this->payroll_code,
            'worker' => [
                'id' => $this->worker?->id,
                'name' => $this->worker?->full_name,
                'phone' => $this->worker?->phone,
                'worker_code' => $this->worker?->worker_code,
                'bank_name' => $this->worker?->bank_name,
                'bank_account' => $this->worker?->bank_account,
                'bank_account_name' => $this->worker?->bank_account_name,
            ],
            'staffing_order' => $this->when($this->order, [
                'id' => $this->order?->id,
                'code' => $this->order?->order_code,
                'client' => $this->order?->client?->company_name,
                'position' => $this->order?->position_name,
            ]),
            'period_start' => $this->period_start?->format('Y-m-d'),
            'period_end' => $this->period_end?->format('Y-m-d'),
            'total_days' => $this->total_days,
            'total_hours' => $this->total_hours,
            'overtime_hours' => $this->overtime_hours,
            'unit_price' => $this->unit_price,
            'rate_type' => $this->rate_type?->value,
            'rate_type_label' => $this->rate_type?->label(),
            'base_amount' => $this->base_amount,
            'overtime_amount' => $this->overtime_amount,
            'allowance_amount' => $this->allowance_amount,
            'deduction_amount' => $this->deduction_amount,
            'net_amount' => $this->net_amount,
            'status' => $this->status?->value,
            'status_label' => $this->status?->label(),
            'status_color' => $this->status?->color(),
            'approved_by' => $this->approvedByUser?->name,
            'approved_at' => $this->approved_at,
            'paid_at' => $this->paid_at,
            'payment_method' => $this->payment_method?->value,
            'payment_method_label' => $this->payment_method?->label(),
            'payment_reference' => $this->payment_reference,
            'notes' => $this->notes,
            'created_by' => $this->createdByUser?->name,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
