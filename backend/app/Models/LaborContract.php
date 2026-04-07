<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LaborContract extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'contract_number',
        'application_id',
        'employer_id',
        'worker_profile_id',
        'position',
        'start_date',
        'end_date',
        'salary_type',
        'salary_amount',
        'shift_type',
        'work_address',
        'terms',
        'has_housing',
        'status',
        'worker_signed_at',
        'employer_signed_at',
        'terminated_at',
        'termination_reason',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'terms' => 'array',
            'has_housing' => 'boolean',
            'worker_signed_at' => 'datetime',
            'employer_signed_at' => 'datetime',
            'terminated_at' => 'datetime',
        ];
    }

    public function employer()
    {
        return $this->belongsTo(Employer::class);
    }

    public function workerProfile()
    {
        return $this->belongsTo(WorkerProfile::class);
    }

    public function application()
    {
        return $this->belongsTo(Application::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'contract_id');
    }

    public function payrolls()
    {
        return $this->hasMany(Payroll::class, 'contract_id');
    }

    public function roomContracts()
    {
        return $this->hasMany(RoomContract::class);
    }
}
