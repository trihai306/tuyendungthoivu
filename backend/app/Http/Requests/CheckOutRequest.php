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
            'attendance_id' => ['required', 'uuid', 'exists:attendances_new,id'],
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
            'attendance_id.required' => 'Vui long chon ban ghi cham cong.',
            'attendance_id.exists' => 'Ban ghi cham cong khong ton tai.',
            'check_out.required' => 'Gio check-out la bat buoc.',
            'check_out.date_format' => 'Gio check-out phai theo dinh dang HH:mm.',
        ];
    }
}
