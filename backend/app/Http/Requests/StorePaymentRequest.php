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
            'payable_type.required' => 'Loai thanh toan la bat buoc.',
            'payable_type.in' => 'Loai thanh toan phai la invoice hoac payroll.',
            'payable_id.required' => 'ID doi tuong thanh toan la bat buoc.',
            'amount.required' => 'So tien la bat buoc.',
            'amount.min' => 'So tien phai lon hon 0.',
            'payment_method.required' => 'Phuong thuc thanh toan la bat buoc.',
            'payment_date.required' => 'Ngay thanh toan la bat buoc.',
        ];
    }
}
