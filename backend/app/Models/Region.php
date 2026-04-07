<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'description',
        'province',
        'district',
        'status',
    ];

    public function dormitories()
    {
        return $this->hasMany(Dormitory::class);
    }

    public function jobPosts()
    {
        return $this->hasMany(JobPost::class);
    }
}
