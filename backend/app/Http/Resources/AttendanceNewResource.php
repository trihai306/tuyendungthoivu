<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceNewResource extends JsonResource
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
            'worker' => [
                'id' => $this->worker?->id,
                'name' => $this->worker?->full_name,
                'phone' => $this->worker?->phone,
                'worker_code' => $this->worker?->worker_code,
            ],
            'staffing_order' => [
                'id' => $this->order?->id,
                'code' => $this->order?->order_code,
                'client' => $this->order?->client?->company_name,
                'position' => $this->order?->position_name,
            ],
            'assignment_id' => $this->assignment_id,
            'date' => $this->work_date?->format('Y-m-d'),
            'check_in' => $this->check_in_time?->format('H:i'),
            'check_out' => $this->check_out_time?->format('H:i'),
            'check_in_time' => $this->check_in_time,
            'check_out_time' => $this->check_out_time,
            'break_minutes' => $this->break_minutes,
            'hours_worked' => $this->total_hours,
            'overtime_hours' => $this->overtime_hours,
            'status' => $this->status?->value,
            'status_label' => $this->status?->label(),
            'status_color' => $this->status?->color(),
            'is_approved' => $this->is_approved,
            'approved_by' => $this->approvedBy?->name,
            'approved_at' => $this->approved_at,
            'check_in_note' => $this->check_in_note,
            'check_out_note' => $this->check_out_note,
            'adjustment_reason' => $this->adjustment_reason,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
