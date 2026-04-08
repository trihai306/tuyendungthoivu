<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInvoiceRequest extends FormRequest
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
            'client_id' => ['sometimes', 'uuid', 'exists:clients,id'],
            'period_start' => ['sometimes', 'date', 'date_format:Y-m-d'],
            'period_end' => ['sometimes', 'date', 'date_format:Y-m-d', 'after_or_equal:period_start'],
            'due_date' => ['nullable', 'date', 'date_format:Y-m-d'],
            'vat_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'items' => ['sometimes', 'array', 'min:1'],
            'items.*.description' => ['required_with:items', 'string', 'max:500'],
            'items.*.quantity' => ['required_with:items', 'numeric', 'min:0.01'],
            'items.*.unit_price' => ['required_with:items', 'numeric', 'min:0'],
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
            'client_id.exists' => 'Khach hang khong ton tai.',
            'period_end.after_or_equal' => 'Ngay ket thuc phai sau ngay bat dau.',
            'items.*.description.required_with' => 'Mo ta hang muc la bat buoc.',
            'items.*.quantity.required_with' => 'So luong la bat buoc.',
            'items.*.unit_price.required_with' => 'Don gia la bat buoc.',
        ];
    }
}
