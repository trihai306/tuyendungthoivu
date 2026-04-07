<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'dormitory_id' => 'required|uuid|exists:dormitories,id',
            'room_number' => 'required|string|max:20',
            'floor' => 'nullable|integer|min:0',
            'room_type' => 'nullable|string|in:single,double,dorm',
            'area_sqm' => 'nullable|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'amenities' => 'nullable|array',
            'photos' => 'nullable|array',
            'photos.*' => 'string|max:500',
        ];
    }
}
