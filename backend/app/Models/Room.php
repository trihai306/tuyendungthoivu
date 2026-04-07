<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasUuids;

    protected $fillable = [
        'dormitory_id',
        'room_number',
        'floor',
        'room_type',
        'area_sqm',
        'capacity',
        'current_occupancy',
        'price',
        'amenities',
        'photos',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'amenities' => 'array',
            'photos' => 'array',
            'area_sqm' => 'decimal:1',
        ];
    }

    public function dormitory()
    {
        return $this->belongsTo(Dormitory::class);
    }

    public function beds()
    {
        return $this->hasMany(Bed::class);
    }

    public function roomContracts()
    {
        return $this->hasMany(RoomContract::class);
    }
}
