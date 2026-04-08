<?php

namespace App\Http\Requests;

use App\Enums\TaskPriority;
use App\Enums\TaskType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskAssignmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'type' => ['required', Rule::enum(TaskType::class)],
            'priority' => ['sometimes', Rule::enum(TaskPriority::class)],
            'assigned_to' => ['required', 'uuid', 'exists:users,id'],
            'related_type' => ['nullable', 'string', 'in:App\\Models\\Application,App\\Models\\JobPost,App\\Models\\Employer,App\\Models\\Dormitory'],
            'related_id' => ['nullable', 'required_with:related_type', 'uuid'],
            'deadline' => ['nullable', 'date', 'after:now'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Tiêu đề công việc là bắt buộc.',
            'type.required' => 'Loại công việc là bắt buộc.',
            'assigned_to.required' => 'Người được giao việc là bắt buộc.',
            'assigned_to.exists' => 'Người được giao việc không tồn tại.',
            'deadline.after' => 'Hạn chót phải sau thời điểm hiện tại.',
            'related_id.required_with' => 'ID đối tượng liên quan là bắt buộc khi chỉ định loại đối tượng.',
        ];
    }
}
