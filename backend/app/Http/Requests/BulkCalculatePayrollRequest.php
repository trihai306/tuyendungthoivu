<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkCalculatePayrollRequest extends FormRequest
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
            'period_month' => ['required', 'integer', 'between:1,12'],
            'period_year' => ['required', 'integer', 'digits:4'],
            'order_id' => ['nullable', 'uuid', 'exists:staffing_orders,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'period_month.required' => 'Tháng là bắt buộc.',
            'period_month.between' => 'Tháng phải từ 1 đến 12.',
            'period_year.required' => 'Năm là bắt buộc.',
            'period_year.digits' => 'Năm phải có 4 chữ số.',
        ];
    }
}
