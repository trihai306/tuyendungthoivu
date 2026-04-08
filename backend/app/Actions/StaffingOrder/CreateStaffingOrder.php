<?php

namespace App\Actions\StaffingOrder;

use App\Enums\OrderStatus;
use App\Events\StaffingOrderCreated;
use App\Models\ActivityLog;
use App\Models\StaffingOrder;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreateStaffingOrder
{
    /**
     * Create a new staffing order with auto-generated code and activity logging.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data, User $user): StaffingOrder
    {
        return DB::transaction(function () use ($data, $user) {
            // Auto-generate order code if not provided
            if (empty($data['order_code'])) {
                $data['order_code'] = StaffingOrder::generateOrderCode();
            }

            // Set defaults
            $data['status'] = $data['status'] ?? OrderStatus::Draft->value;
            $data['created_by'] = $user->id;
            $data['quantity_filled'] = 0;

            $order = StaffingOrder::create($data);

            // Log activity
            ActivityLog::create([
                'user_id' => $user->id,
                'action' => 'order.created',
                'description' => "Created staffing order {$order->order_code}",
                'loggable_type' => StaffingOrder::class,
                'loggable_id' => $order->id,
                'metadata' => [
                    'order_code' => $order->order_code,
                    'client_id' => $order->client_id,
                    'position' => $order->position_name,
                    'quantity_needed' => $order->quantity_needed,
                ],
                'ip_address' => request()?->ip(),
            ]);

            event(new StaffingOrderCreated($order));

            return $order;
        });
    }
}
