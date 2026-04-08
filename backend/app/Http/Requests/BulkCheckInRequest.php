<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkCheckInRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'order_id' => ['required', 'uuid', 'exists:staffing_orders,id'],
            'date' => ['required', 'date', 'date_format:Y-m-d'],
            'check_in' => ['required', 'date_format:H:i'],
            'records' => ['required', 'array', 'min:1'],
            'records.*.assignment_id' => ['required', 'uuid', 'exists:assignments,id'],
            'records.*.status' => ['nullable', 'string', 'in:present,late,absent,half_day,excused'],
            'records.*.note' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'order_id.required' => 'Don hang la bat buoc.',
            'order_id.exists' => 'Don hang khong ton tai.',
            'date.required' => 'Ngay lam viec la bat buoc.',
            'check_in.required' => 'Gio check-in la bat buoc.',
            'records.required' => 'Danh sach cham cong la bat buoc.',
            'records.min' => 'Can it nhat 1 ban ghi.',
        ];
    }
}
