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
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'worker_id.required' => 'Worker la bat buoc.',
            'worker_id.exists' => 'Worker khong ton tai.',
            'period_month.required' => 'Thang la bat buoc.',
            'period_month.between' => 'Thang phai tu 1 den 12.',
            'period_year.required' => 'Nam la bat buoc.',
            'period_year.digits' => 'Nam phai co 4 chu so.',
        ];
    }
}
