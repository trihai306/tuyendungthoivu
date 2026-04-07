<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Bed extends Model
{
    use HasUuids;

    protected $fillable = [
        'room_id',
        'bed_number',
        'bed_position',
        'price',
        'status',
        'current_occupant_id',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function currentOccupant()
    {
        return $this->belongsTo(WorkerProfile::class, 'current_occupant_id');
    }

    public function roomContracts()
    {
        return $this->hasMany(RoomContract::class);
    }
}
