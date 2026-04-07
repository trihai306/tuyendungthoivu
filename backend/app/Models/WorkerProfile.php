<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class WorkerProfile extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'full_name',
        'date_of_birth',
        'gender',
        'id_card_number',
        'permanent_address',
        'current_address',
        'emergency_contact_name',
        'emergency_contact_phone',
        'bank_name',
        'bank_account',
        'bank_holder',
        'needs_housing',
        'ekyc_status',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'needs_housing' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function skills()
    {
        return $this->hasMany(WorkerSkill::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function laborContracts()
    {
        return $this->hasMany(LaborContract::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function payrolls()
    {
        return $this->hasMany(Payroll::class);
    }

    public function roomContracts()
    {
        return $this->hasMany(RoomContract::class);
    }
}
