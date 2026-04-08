<?php

namespace App\Http\Requests;

use App\Enums\ClientStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateClientRequest extends FormRequest
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
        $clientId = $this->route('client');

        return [
            'company_name' => ['sometimes', 'string', 'max:255'],
            'tax_code' => ['nullable', 'string', 'max:20', Rule::unique('clients', 'tax_code')->ignore($clientId)],
            'industry' => ['nullable', 'string', 'max:100'],
            'company_size' => ['nullable', 'string', Rule::in(['small', 'medium', 'large'])],
            'address' => ['nullable', 'string', 'max:1000'],
            'district' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'contact_name' => ['sometimes', 'string', 'max:255'],
            'contact_phone' => ['sometimes', 'string', 'max:15'],
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
            'tax_code.unique' => 'Ma so thue da ton tai trong he thong.',
        ];
    }
}
