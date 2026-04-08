<?php

namespace App\Http\Requests;

use App\Enums\DepartmentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTeamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'department_id' => ['required', 'uuid', 'exists:departments,id'],
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'lead_user_id' => ['nullable', 'uuid', 'exists:users,id'],
            'status' => ['sometimes', Rule::enum(DepartmentStatus::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'department_id.required' => 'Phòng ban là bắt buộc.',
            'department_id.exists' => 'Phòng ban không tồn tại.',
            'name.required' => 'Tên nhóm là bắt buộc.',
            'lead_user_id.exists' => 'Trưởng nhóm không tồn tại.',
        ];
    }
}
