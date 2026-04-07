<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Dormitory extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'landlord_id',
        'region_id',
        'name',
        'address',
        'latitude',
        'longitude',
        'total_rooms',
        'total_beds',
        'has_wifi',
        'has_ac',
        'has_hot_water',
        'has_kitchen',
        'has_parking',
        'has_security',
        'electricity_rate',
        'water_rate',
        'deposit_amount',
        'rules',
        'photos',
        'rating',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'has_wifi' => 'boolean',
            'has_ac' => 'boolean',
            'has_hot_water' => 'boolean',
            'has_kitchen' => 'boolean',
            'has_parking' => 'boolean',
            'has_security' => 'boolean',
            'photos' => 'array',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'rating' => 'decimal:1',
        ];
    }

    public function landlord()
    {
        return $this->belongsTo(User::class, 'landlord_id');
    }

    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function roomContracts()
    {
        return $this->hasMany(RoomContract::class);
    }
}
