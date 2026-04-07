<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Interview extends Model
{
    use HasUuids;

    protected $fillable = [
        'application_id',
        'interview_type',
        'scheduled_at',
        'location',
        'meeting_link',
        'status',
        'rating_attitude',
        'rating_communication',
        'rating_fit',
        'feedback',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
        ];
    }

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
