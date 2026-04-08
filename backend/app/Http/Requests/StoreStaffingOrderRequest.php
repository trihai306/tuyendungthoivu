<?php

namespace App\Http\Requests;

use App\Enums\Gender;
use App\Enums\OrderUrgency;
use App\Enums\RateType;
use App\Enums\ServiceType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStaffingOrderRequest extends FormRequest
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
            // Client
            'client_id' => ['required', 'uuid', Rule::exists('clients', 'id')],
            'client_contact_id' => ['nullable', 'uuid'],
            'contract_id' => ['nullable', 'uuid', Rule::exists('client_contracts', 'id')],

            // Job info
            'position_name' => ['required', 'string', 'max:255'],
            'job_description' => ['nullable', 'string', 'max:5000'],
            'work_address' => ['nullable', 'string', 'max:1000'],
            'work_district' => ['nullable', 'string', 'max:100'],
            'work_city' => ['nullable', 'string', 'max:100'],

            // Quantity & requirements
            'quantity_needed' => ['required', 'integer', 'min:1', 'max:500'],
            'gender_requirement' => ['nullable', 'string', Rule::in(Gender::values())],
            'age_min' => ['nullable', 'integer', 'min:16', 'max:65'],
            'age_max' => ['nullable', 'integer', 'min:16', 'max:65', 'gte:age_min'],
            'required_skills' => ['nullable', 'array'],
            'required_skills.*' => ['uuid'],
            'other_requirements' => ['nullable', 'string', 'max:5000'],

            // Schedule
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'shift_type' => ['nullable', 'string', Rule::in(['morning', 'afternoon', 'evening', 'double', 'continuous'])],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i'],
            'break_minutes' => ['nullable', 'integer', 'min:0', 'max:180'],

            // Financial
            'worker_rate' => ['nullable', 'numeric', 'min:0'],
            'rate_type' => ['nullable', 'string', Rule::in(RateType::values())],
            'service_fee' => ['nullable', 'numeric', 'min:0'],
            'service_fee_type' => ['nullable', 'string', Rule::in(['percent', 'fixed'])],
            'overtime_rate' => ['nullable', 'numeric', 'min:0'],

            // Management
            'urgency' => ['nullable', 'string', Rule::in(OrderUrgency::values())],
            'service_type' => ['required', 'string', Rule::in(ServiceType::values())],
            'notes' => ['nullable', 'string', 'max:5000'],
            'uniform_requirement' => ['nullable', 'string', 'max:255'],
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
            'client_id.required' => 'Khach hang la bat buoc.',
            'client_id.exists' => 'Khach hang khong ton tai.',
            'position_name.required' => 'Vi tri tuyen dung la bat buoc.',
            'quantity_needed.required' => 'So luong can tuyen la bat buoc.',
            'quantity_needed.min' => 'So luong can tuyen phai it nhat la 1.',
            'start_date.required' => 'Ngay bat dau la bat buoc.',
            'start_date.after_or_equal' => 'Ngay bat dau phai tu hom nay tro di.',
            'end_date.after_or_equal' => 'Ngay ket thuc phai sau hoac bang ngay bat dau.',
            'service_type.required' => 'Loai dich vu la bat buoc.',
            'age_max.gte' => 'Tuoi toi da phai lon hon hoac bang tuoi toi thieu.',
        ];
    }
}
