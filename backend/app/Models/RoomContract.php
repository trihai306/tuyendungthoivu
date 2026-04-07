<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class RoomContract extends Model
{
    use HasUuids;

    protected $fillable = [
        'contract_number',
        'worker_profile_id',
        'dormitory_id',
        'room_id',
        'bed_id',
        'labor_contract_id',
        'start_date',
        'end_date',
        'monthly_rent',
        'deposit_amount',
        'payment_method',
        'status',
        'signed_at',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'signed_at' => 'datetime',
        ];
    }

    public function workerProfile()
    {
        return $this->belongsTo(WorkerProfile::class);
    }

    public function dormitory()
    {
        return $this->belongsTo(Dormitory::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function bed()
    {
        return $this->belongsTo(Bed::class);
    }

    public function laborContract()
    {
        return $this->belongsTo(LaborContract::class);
    }

    public function invoices()
    {
        return $this->hasMany(RoomInvoice::class);
    }
}
