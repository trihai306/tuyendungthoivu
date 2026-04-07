<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWorkerProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => 'required|string|max:255',
            'date_of_birth' => 'nullable|date|before:today',
            'gender' => 'nullable|string|in:Nam,Nữ,Khác',
            'id_card_number' => 'nullable|string|max:20',
            'permanent_address' => 'nullable|string|max:500',
            'current_address' => 'nullable|string|max:500',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:15',
            'bank_name' => 'nullable|string|max:100',
            'bank_account' => 'nullable|string|max:30',
            'bank_holder' => 'nullable|string|max:255',
            'needs_housing' => 'nullable|boolean',
        ];
    }
}
