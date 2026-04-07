<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasUuids;

    protected $fillable = [
        'contract_id',
        'worker_profile_id',
        'work_date',
        'check_in_at',
        'check_out_at',
        'check_in_method',
        'total_hours',
        'ot_hours',
        'is_approved',
        'approved_by',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'work_date' => 'date',
            'check_in_at' => 'datetime',
            'check_out_at' => 'datetime',
            'is_approved' => 'boolean',
            'total_hours' => 'decimal:1',
            'ot_hours' => 'decimal:1',
        ];
    }

    public function laborContract()
    {
        return $this->belongsTo(LaborContract::class, 'contract_id');
    }

    public function workerProfile()
    {
        return $this->belongsTo(WorkerProfile::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
