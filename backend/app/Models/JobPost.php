<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobPost extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'employer_id',
        'title',
        'description',
        'requirements',
        'benefits',
        'job_type',
        'positions_count',
        'filled_count',
        'salary_type',
        'salary_amount',
        'shift_type',
        'work_start_date',
        'work_end_date',
        'work_address',
        'latitude',
        'longitude',
        'region_id',
        'has_housing',
        'min_age',
        'max_age',
        'gender_req',
        'deadline',
        'status',
        'view_count',
    ];

    protected function casts(): array
    {
        return [
            'work_start_date' => 'date',
            'work_end_date' => 'date',
            'deadline' => 'date',
            'has_housing' => 'boolean',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
        ];
    }

    public function employer()
    {
        return $this->belongsTo(Employer::class);
    }

    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}
