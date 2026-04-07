<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    use HasUuids;

    protected $fillable = [
        'contract_id',
        'worker_profile_id',
        'period_start',
        'period_end',
        'total_shifts',
        'total_hours',
        'ot_hours',
        'base_salary',
        'ot_salary',
        'allowances',
        'gross_salary',
        'housing_deduct',
        'advance_deduct',
        'net_salary',
        'status',
        'paid_at',
        'payment_method',
    ];

    protected function casts(): array
    {
        return [
            'period_start' => 'date',
            'period_end' => 'date',
            'paid_at' => 'datetime',
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
}
