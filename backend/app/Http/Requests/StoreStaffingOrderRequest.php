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
            'client_id.required' => 'Khách hàng là bắt buộc.',
            'client_id.exists' => 'Khách hàng không tồn tại.',
            'position_name.required' => 'Vị trí tuyển dụng là bắt buộc.',
            'quantity_needed.required' => 'Số lượng cần tuyển là bắt buộc.',
            'quantity_needed.min' => 'Số lượng cần tuyển phải ít nhất là 1.',
            'start_date.required' => 'Ngày bắt đầu là bắt buộc.',
            'start_date.after_or_equal' => 'Ngày bắt đầu phải từ hôm nay trở đi.',
            'end_date.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',
            'service_type.required' => 'Loại dịch vụ là bắt buộc.',
            'age_max.gte' => 'Tuổi tối đa phải lớn hơn hoặc bằng tuổi tối thiểu.',
        ];
    }
}
