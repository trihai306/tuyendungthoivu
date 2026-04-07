<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class WorkerSkill extends Model
{
    use HasUuids;

    protected $fillable = [
        'worker_profile_id',
        'skill_name',
        'level',
        'years',
    ];

    protected function casts(): array
    {
        return [
            'years' => 'decimal:1',
        ];
    }

    public function workerProfile()
    {
        return $this->belongsTo(WorkerProfile::class);
    }
}
