<?php

namespace App\Models;

use App\Enums\DepartmentStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Team extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'department_id',
        'name',
        'description',
        'lead_user_id',
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
     * The department this team belongs to.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * The team lead (user).
     */
    public function lead(): BelongsTo
    {
        return $this->belongsTo(User::class, 'lead_user_id');
    }

    /**
     * Members of this team via pivot table.
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_members')
            ->withPivot('role_in_team', 'joined_at');
    }

    // ── Scopes ───────────────────────────────────────────────────────

    /**
     * Scope to only active teams.
     */
    public function scopeActive($query)
    {
        return $query->where('status', DepartmentStatus::Active);
    }

    // ── Helpers ──────────────────────────────────────────────────────

    /**
     * Check if a user is a member of this team.
     */
    public function hasMember(User $user): bool
    {
        return $this->members()->where('user_id', $user->id)->exists();
    }

    /**
     * Get the count of members.
     */
    public function getMemberCountAttribute(): int
    {
        return $this->members()->count();
    }
}
