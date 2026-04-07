<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class RoomInvoice extends Model
{
    use HasUuids;

    protected $fillable = [
        'invoice_number',
        'room_contract_id',
        'worker_profile_id',
        'billing_month',
        'rent_amount',
        'electricity_amount',
        'water_amount',
        'total_amount',
        'paid_amount',
        'status',
        'due_date',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'billing_month' => 'date',
            'due_date' => 'date',
            'paid_at' => 'datetime',
        ];
    }

    public function roomContract()
    {
        return $this->belongsTo(RoomContract::class);
    }

    public function workerProfile()
    {
        return $this->belongsTo(WorkerProfile::class);
    }
}
