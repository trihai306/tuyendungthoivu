<?php

namespace App\Http\Requests;

use App\Enums\WorkerStatus;
use App\Models\Worker;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssignmentRequest extends FormRequest
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
            'staffing_order_id' => ['required', 'uuid', Rule::exists('staffing_orders', 'id')],
            'worker_id' => ['required', 'uuid', Rule::exists('workers', 'id')],
            'dispatch_info' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            // Validate worker is available
            $worker = Worker::find($this->input('worker_id'));
            if ($worker && $worker->status !== WorkerStatus::Available) {
                $validator->errors()->add(
                    'worker_id',
                    'Worker hiện không sẵn sàng để phân công (trạng thái: ' . $worker->status->label() . ').'
                );
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'staffing_order_id.required' => 'Đơn hàng là bắt buộc.',
            'staffing_order_id.exists' => 'Đơn hàng không tồn tại.',
            'worker_id.required' => 'Worker là bắt buộc.',
            'worker_id.exists' => 'Worker không tồn tại.',
        ];
    }
}
