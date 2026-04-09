<?php

namespace App\Http\Requests;

use App\Enums\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePaymentRequest extends FormRequest
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
            'payable_type' => ['required', 'string', 'in:invoice,payroll'],
            'payable_id' => ['required', 'uuid'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'payment_method' => ['required', Rule::enum(PaymentMethod::class)],
            'payment_date' => ['required', 'date', 'date_format:Y-m-d'],
            'reference_number' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'payable_type.required' => 'Loại thanh toán là bắt buộc.',
            'payable_type.in' => 'Loại thanh toán phải là invoice hoặc payroll.',
            'payable_id.required' => 'ID đối tượng thanh toán là bắt buộc.',
            'amount.required' => 'Số tiền là bắt buộc.',
            'amount.min' => 'Số tiền phải lớn hơn 0.',
            'payment_method.required' => 'Phương thức thanh toán là bắt buộc.',
            'payment_date.required' => 'Ngày thanh toán là bắt buộc.',
        ];
    }
}
