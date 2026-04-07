<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'job_post_id' => 'required|uuid|exists:job_posts,id',
            'cover_letter' => 'nullable|string|max:5000',
        ];
    }
}
