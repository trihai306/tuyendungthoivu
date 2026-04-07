<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Employer extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'company_name',
        'business_license',
        'industry',
        'company_size',
        'address',
        'latitude',
        'longitude',
        'contact_name',
        'contact_phone',
        'description',
        'verified',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'verified' => 'boolean',
            'verified_at' => 'datetime',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobPosts()
    {
        return $this->hasMany(JobPost::class);
    }

    public function laborContracts()
    {
        return $this->hasMany(LaborContract::class);
    }
}
