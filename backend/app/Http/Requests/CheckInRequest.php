<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckInRequest extends FormRequest
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
            'assignment_id' => ['required', 'uuid', 'exists:assignments,id'],
            'date' => ['required', 'date', 'date_format:Y-m-d'],
            'check_in' => ['required', 'date_format:H:i'],
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
            'assignment_id.required' => 'Vui lòng chọn phân công.',
            'assignment_id.exists' => 'Phân công không tồn tại.',
            'date.required' => 'Ngày làm việc là bắt buộc.',
            'check_in.required' => 'Giờ check-in là bắt buộc.',
            'check_in.date_format' => 'Giờ check-in phải theo định dạng HH:mm.',
        ];
    }
}
