<?php

namespace App\Http\Requests;

use App\Enums\ClientStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClientRequest extends FormRequest
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
            'company_name' => ['required', 'string', 'max:255'],
            'tax_code' => ['nullable', 'string', 'max:20', Rule::unique('clients', 'tax_code')],
            'industry' => ['nullable', 'string', 'max:100'],
            'company_size' => ['nullable', 'string', Rule::in(['small', 'medium', 'large'])],
            'address' => ['nullable', 'string', 'max:1000'],
            'district' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'contact_name' => ['required', 'string', 'max:255'],
            'contact_phone' => ['required', 'string', 'max:15'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'website' => ['nullable', 'url', 'max:500'],
            'status' => ['nullable', 'string', Rule::in(ClientStatus::values())],
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
            'company_name.required' => 'Ten cong ty la bat buoc.',
            'contact_name.required' => 'Ten nguoi lien he la bat buoc.',
            'contact_phone.required' => 'So dien thoai lien he la bat buoc.',
            'tax_code.unique' => 'Ma so thue da ton tai trong he thong.',
        ];
    }
}
