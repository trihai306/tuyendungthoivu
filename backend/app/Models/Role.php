<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'level',
    ];

    protected function casts(): array
    {
        return [
            'level' => 'integer',
        ];
    }

    // ── Relationships ────────────────────────────────────────────────

    /**
     * Permissions assigned to this role.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_permission');
    }

    /**
     * Users who have this role.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'role_user');
    }

    // ── Scopes ───────────────────────────────────────────────────────

    /**
     * Scope to order by authority level descending.
     */
    public function scopeByLevel($query)
    {
        return $query->orderByDesc('level');
    }

    // ── Helpers ──────────────────────────────────────────────────────

    /**
     * Check if this role has a specific permission.
     */
    public function hasPermission(string $permissionName): bool
    {
        return $this->permissions()->where('name', $permissionName)->exists();
    }

    /**
     * Check if this role has higher or equal authority than another role.
     */
    public function hasHigherOrEqualLevel(Role $other): bool
    {
        return $this->level >= $other->level;
    }
}
