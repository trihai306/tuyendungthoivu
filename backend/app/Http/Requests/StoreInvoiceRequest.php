<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
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
            'client_id' => ['required', 'uuid', 'exists:clients,id'],
            'period_start' => ['required', 'date', 'date_format:Y-m-d'],
            'period_end' => ['required', 'date', 'date_format:Y-m-d', 'after_or_equal:period_start'],
            'due_date' => ['nullable', 'date', 'date_format:Y-m-d'],
            'vat_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.description' => ['required', 'string', 'max:500'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.unit' => ['nullable', 'string', 'in:hour,day,shift,person'],
            'items.*.order_id' => ['nullable', 'uuid', 'exists:staffing_orders,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'client_id.required' => 'Khach hang la bat buoc.',
            'client_id.exists' => 'Khach hang khong ton tai.',
            'period_start.required' => 'Ngay bat dau ky la bat buoc.',
            'period_end.required' => 'Ngay ket thuc ky la bat buoc.',
            'period_end.after_or_equal' => 'Ngay ket thuc phai sau ngay bat dau.',
            'items.required' => 'Can it nhat 1 hang muc.',
            'items.*.description.required' => 'Mo ta hang muc la bat buoc.',
            'items.*.quantity.required' => 'So luong la bat buoc.',
            'items.*.unit_price.required' => 'Don gia la bat buoc.',
        ];
    }
}
