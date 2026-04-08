<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkerRating extends Model
{
    use HasFactory, HasUuids;

    /**
     * Indicates this model only uses created_at (no updated_at).
     */
    const UPDATED_AT = null;

    protected $fillable = [
        'worker_id',
        'order_id',
        'rated_by',
        'overall_score',
        'punctuality',
        'skill_level',
        'attitude',
        'diligence',
        'comment',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'overall_score' => 'integer',
            'punctuality' => 'integer',
            'skill_level' => 'integer',
            'attitude' => 'integer',
            'diligence' => 'integer',
        ];
    }

    // ── Relationships ───────────────────────────────────────────────

    /**
     * The worker being rated.
     */
    public function worker(): BelongsTo
    {
        return $this->belongsTo(Worker::class);
    }

    /**
     * The staffing order this rating is for.
     */
    public function staffingOrder(): BelongsTo
    {
        return $this->belongsTo(StaffingOrder::class, 'order_id');
    }

    /**
     * The user (recruiter) who gave this rating.
     */
    public function ratedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rated_by');
    }
}
