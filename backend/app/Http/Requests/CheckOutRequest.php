<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckOutRequest extends FormRequest
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
            'attendance_id' => ['required', 'uuid', 'exists:attendances_v2,id'],
            'check_out' => ['required', 'date_format:H:i'],
            'gps_lat' => ['nullable', 'numeric', 'between:-90,90'],
            'gps_lng' => ['nullable', 'numeric', 'between:-180,180'],
            'note' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'attendance_id.required' => 'Vui lòng chọn bản ghi chấm công.',
            'attendance_id.exists' => 'Bản ghi chấm công không tồn tại.',
            'check_out.required' => 'Giờ check-out là bắt buộc.',
            'check_out.date_format' => 'Giờ check-out phải theo định dạng HH:mm.',
        ];
    }
}
