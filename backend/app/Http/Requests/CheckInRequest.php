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
            'assignment_id.required' => 'Vui long chon phan cong.',
            'assignment_id.exists' => 'Phan cong khong ton tai.',
            'date.required' => 'Ngay lam viec la bat buoc.',
            'check_in.required' => 'Gio check-in la bat buoc.',
            'check_in.date_format' => 'Gio check-in phai theo dinh dang HH:mm.',
        ];
    }
}
