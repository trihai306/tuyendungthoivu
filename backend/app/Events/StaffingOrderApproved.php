<?php

namespace App\Events;

use App\Models\StaffingOrder;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StaffingOrderApproved
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly StaffingOrder $order
    ) {}
}
