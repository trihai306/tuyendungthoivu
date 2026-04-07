<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJobPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'benefits' => 'nullable|string',
            'job_type' => 'nullable|string',
            'positions_count' => 'required|integer|min:1',
            'salary_type' => 'required|string|max:20',
            'salary_amount' => 'required|numeric|min:0',
            'shift_type' => 'nullable|string',
            'work_start_date' => 'required|date',
            'work_end_date' => 'required|date|after_or_equal:work_start_date',
            'work_address' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'region_id' => 'nullable|exists:regions,id',
            'has_housing' => 'nullable|boolean',
            'min_age' => 'nullable|integer',
            'max_age' => 'nullable|integer',
            'gender_req' => 'nullable|string',
            'deadline' => 'nullable|date',
            'status' => 'nullable|string',
        ];
    }
}
