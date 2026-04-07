<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDormitoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'region_id' => 'nullable|uuid|exists:regions,id',
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'total_rooms' => 'nullable|integer|min:0',
            'total_beds' => 'nullable|integer|min:0',
            'has_wifi' => 'nullable|boolean',
            'has_ac' => 'nullable|boolean',
            'has_hot_water' => 'nullable|boolean',
            'has_kitchen' => 'nullable|boolean',
            'has_parking' => 'nullable|boolean',
            'has_security' => 'nullable|boolean',
            'electricity_rate' => 'nullable|numeric|min:0',
            'water_rate' => 'nullable|numeric|min:0',
            'deposit_amount' => 'nullable|numeric|min:0',
            'rules' => 'nullable|string|max:5000',
            'photos' => 'nullable|array',
            'photos.*' => 'string|max:500',
        ];
    }
}
