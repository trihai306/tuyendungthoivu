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
            'order_id.required' => 'Đơn hàng là bắt buộc.',
            'order_id.exists' => 'Đơn hàng không tồn tại.',
            'date.required' => 'Ngày làm việc là bắt buộc.',
            'check_in.required' => 'Giờ check-in là bắt buộc.',
            'records.required' => 'Danh sách chấm công là bắt buộc.',
            'records.min' => 'Cần ít nhất 1 bản ghi.',
        ];
    }
}
