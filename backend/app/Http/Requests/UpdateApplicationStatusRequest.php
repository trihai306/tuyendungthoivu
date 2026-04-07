<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateApplicationStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|string|in:new,reviewing,interview_invited,interviewed,passed,rejected,hired,cancelled',
            'notes' => 'nullable|string|max:2000',
        ];
    }
}
