<?php

namespace App\Http\Requests;

use App\Enums\Gender;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWorkerRequest extends FormRequest
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
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'gender' => ['required', 'string', Rule::in(['male', 'female'])],
            'id_number' => ['required', 'string', 'max:20', Rule::unique('workers', 'id_number')],
            'phone' => ['required', 'string', 'max:15', Rule::unique('workers', 'phone')],
            'email' => ['nullable', 'email', 'max:255'],
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
            'full_name.required' => 'Ho ten la bat buoc.',
            'date_of_birth.required' => 'Ngay sinh la bat buoc.',
            'gender.required' => 'Gioi tinh la bat buoc.',
            'id_number.required' => 'So CCCD/CMND la bat buoc.',
            'id_number.unique' => 'So CCCD/CMND da ton tai trong he thong.',
            'phone.required' => 'So dien thoai la bat buoc.',
            'phone.unique' => 'So dien thoai da ton tai trong he thong.',
        ];
    }
}
