<?php

namespace App\Http\Requests;

use App\Enums\DepartmentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'head_user_id' => ['nullable', 'uuid', 'exists:users,id'],
            'status' => ['sometimes', Rule::enum(DepartmentStatus::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Tên phòng ban là bắt buộc.',
            'head_user_id.exists' => 'Trưởng phòng không tồn tại.',
        ];
    }
}
