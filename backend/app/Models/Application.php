<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasUuids;

    protected $fillable = [
        'job_post_id',
        'worker_profile_id',
        'cover_letter',
        'status',
        'match_score',
        'notes',
        'applied_at',
    ];

    protected function casts(): array
    {
        return [
            'applied_at' => 'datetime',
            'match_score' => 'decimal:2',
        ];
    }

    public function jobPost()
    {
        return $this->belongsTo(JobPost::class);
    }

    public function workerProfile()
    {
        return $this->belongsTo(WorkerProfile::class);
    }

    public function interviews()
    {
        return $this->hasMany(Interview::class);
    }

    public function laborContract()
    {
        return $this->hasOne(LaborContract::class);
    }
}
