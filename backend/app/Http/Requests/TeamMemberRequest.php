<?php

namespace App\Http\Requests;

use App\Enums\TeamMemberRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TeamMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'uuid', 'exists:users,id'],
            'role_in_team' => ['sometimes', Rule::enum(TeamMemberRole::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'Thành viên là bắt buộc.',
            'user_id.exists' => 'Người dùng không tồn tại.',
        ];
    }
}
