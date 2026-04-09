<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWorkerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $workerId = $this->route('workers_new');

        return [
            'full_name' => ['sometimes', 'string', 'max:255'],
            'date_of_birth' => ['sometimes', 'date', 'before:today'],
            'gender' => ['sometimes', 'string', Rule::in(['male', 'female'])],
            'id_number' => ['sometimes', 'string', 'max:20', Rule::unique('workers', 'id_number')->ignore($workerId)],
            'id_issued_date' => ['nullable', 'string', 'max:20'],
            'id_issued_place' => ['nullable', 'string', 'max:255'],
            'id_card_front_url' => ['nullable', 'string', 'max:500'],
            'id_card_back_url' => ['nullable', 'string', 'max:500'],
            'phone' => ['sometimes', 'string', 'max:15', Rule::unique('workers', 'phone')->ignore($workerId)],
            'email' => ['nullable', 'email', 'max:255'],
            'zalo' => ['nullable', 'string', 'max:50'],
            'facebook_url' => ['nullable', 'string', 'max:500'],
            'avatar_url' => ['nullable', 'string', 'max:500'],
            'address' => ['nullable', 'string', 'max:1000'],
            'district' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'skill_ids' => ['nullable', 'array'],
            'skill_ids.*' => ['uuid', Rule::exists('skills', 'id')],
            'experience_notes' => ['nullable', 'string', 'max:5000'],
            'preferred_districts' => ['nullable', 'array'],
            'preferred_districts.*' => ['string', 'max:100'],
            'availability' => ['nullable', 'string', Rule::in(['full_time', 'part_time', 'weekends_only'])],
            'bank_name' => ['nullable', 'string', 'max:100'],
            'bank_account' => ['nullable', 'string', 'max:30'],
            'bank_account_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:15'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'id_number.unique' => 'So CCCD/CMND da ton tai trong he thong.',
            'phone.unique' => 'So dien thoai da ton tai trong he thong.',
        ];
    }
}
