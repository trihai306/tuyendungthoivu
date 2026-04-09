<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CalculatePayrollRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'worker_id' => ['required', 'uuid', 'exists:workers,id'],
            'period_month' => ['required', 'integer', 'between:1,12'],
            'period_year' => ['required', 'integer', 'digits:4'],
            'order_id' => ['nullable', 'uuid', 'exists:staffing_orders,id'],
            'period_start' => ['nullable', 'date', 'date_format:Y-m-d'],
            'period_end' => ['nullable', 'date', 'date_format:Y-m-d', 'after_or_equal:period_start'],
            'allowance' => ['nullable', 'numeric', 'min:0'],
            'deduction' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'worker_id.required' => 'Worker là bắt buộc.',
            'worker_id.exists' => 'Worker không tồn tại.',
            'period_month.required' => 'Tháng là bắt buộc.',
            'period_month.between' => 'Tháng phải từ 1 đến 12.',
            'period_year.required' => 'Năm là bắt buộc.',
            'period_year.digits' => 'Năm phải có 4 chữ số.',
        ];
    }
}
