<?php

namespace App\Models;

use App\Enums\DepartmentStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'description',
        'head_user_id',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => DepartmentStatus::class,
        ];
    }

    // ── Relationships ────────────────────────────────────────────────

    /**
     * The department head (user).
     */
    public function head(): BelongsTo
    {
        return $this->belongsTo(User::class, 'head_user_id');
    }

    /**
     * Teams within this department.
     */
    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }

    /**
     * Users (employees) directly in this department.
     */
    public function members(): HasMany
    {
        return $this->hasMany(User::class, 'department_id');
    }

    // ── Scopes ───────────────────────────────────────────────────────

    /**
     * Scope to only active departments.
     */
    public function scopeActive($query)
    {
        return $query->where('status', DepartmentStatus::Active);
    }

    // ── Accessors ────────────────────────────────────────────────────

    /**
     * Get the total member count across all teams.
     */
    public function getMemberCountAttribute(): int
    {
        return $this->members()->count();
    }
}
