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
            'client_id.required' => 'Khách hàng là bắt buộc.',
            'client_id.exists' => 'Khách hàng không tồn tại.',
            'period_start.required' => 'Ngày bắt đầu kỳ là bắt buộc.',
            'period_end.required' => 'Ngày kết thúc kỳ là bắt buộc.',
            'period_end.after_or_equal' => 'Ngày kết thúc phải sau ngày bắt đầu.',
            'items.required' => 'Cần ít nhất 1 hạng mục.',
            'items.*.description.required' => 'Mô tả hạng mục là bắt buộc.',
            'items.*.quantity.required' => 'Số lượng là bắt buộc.',
            'items.*.unit_price.required' => 'Đơn giá là bắt buộc.',
        ];
    }
}
