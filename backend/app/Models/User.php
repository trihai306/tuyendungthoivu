<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, HasUuids;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'status',
        'credit_score',
        'avatar_url',
        'last_login_at',
        'department_id',
        'team_id',
        'position',
        'phone_ext',
        'employee_code',
        'hire_date',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'credit_score' => 'integer',
            'hire_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    // ── Existing Relationships ───────────────────────────────────────

    public function workerProfile()
    {
        return $this->hasOne(WorkerProfile::class);
    }

    public function employer()
    {
        return $this->hasOne(Employer::class);
    }

    public function dormitories()
    {
        return $this->hasMany(Dormitory::class, 'landlord_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function reviewsGiven()
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    public function reviewsReceived()
    {
        return $this->hasMany(Review::class, 'reviewee_id');
    }

    // ── RBAC Relationships ───────────────────────────────────────────

    /**
     * Roles assigned to this user.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_user');
    }

    // ── Organization Relationships ───────────────────────────────────

    /**
     * The department this user belongs to.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * The primary team this user belongs to.
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * All teams the user is a member of (via pivot).
     */
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_members')
            ->withPivot('role_in_team', 'joined_at');
    }

    // ── Staffing Relationships ───────────────────────────────────────

    /**
     * Workers managed/registered by this user (as recruiter).
     */
    public function managedWorkers(): HasMany
    {
        return $this->hasMany(Worker::class, 'registered_by');
    }

    /**
     * Staffing orders assigned to this user (as recruiter).
     */
    public function assignedOrders(): HasMany
    {
        return $this->hasMany(StaffingOrder::class, 'assigned_recruiter_id');
    }

    /**
     * Staffing orders created by this user (as sales).
     */
    public function staffingOrdersCreated(): HasMany
    {
        return $this->hasMany(StaffingOrder::class, 'created_by');
    }

    // ── Task Relationships ───────────────────────────────────────────

    /**
     * Tasks assigned to this user.
     */
    public function assignedTasks(): HasMany
    {
        return $this->hasMany(TaskAssignment::class, 'assigned_to');
    }

    /**
     * Tasks created/assigned by this user.
     */
    public function createdTasks(): HasMany
    {
        return $this->hasMany(TaskAssignment::class, 'assigned_by');
    }

    /**
     * Activity logs for this user.
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    // ── RBAC Helper Methods ──────────────────────────────────────────

    /**
     * Check if the user has a specific role by name.
     */
    public function hasRole(string $roleName): bool
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    /**
     * Check if the user has any of the given roles.
     */
    public function hasAnyRole(array $roleNames): bool
    {
        return $this->roles()->whereIn('name', $roleNames)->exists();
    }

    /**
     * Check if the user has a specific permission (through any of their roles).
     */
    public function hasPermission(string $permissionName): bool
    {
        // Super admin has all permissions
        if ($this->hasRole('super_admin')) {
            return true;
        }

        return $this->roles()
            ->whereHas('permissions', function ($query) use ($permissionName) {
                $query->where('name', $permissionName);
            })
            ->exists();
    }

    /**
     * Check if the user has any of the given permissions.
     */
    public function hasAnyPermission(array $permissionNames): bool
    {
        if ($this->hasRole('super_admin')) {
            return true;
        }

        return $this->roles()
            ->whereHas('permissions', function ($query) use ($permissionNames) {
                $query->whereIn('name', $permissionNames);
            })
            ->exists();
    }

    /**
     * Get the highest role level for this user.
     */
    public function getHighestRoleLevelAttribute(): int
    {
        return $this->roles()->max('level') ?? 0;
    }

    /**
     * Get all permission names for this user (aggregated from all roles).
     *
     * @return \Illuminate\Support\Collection<int, string>
     */
    public function getAllPermissions(): \Illuminate\Support\Collection
    {
        if ($this->hasRole('super_admin')) {
            return Permission::pluck('name');
        }

        return Permission::whereHas('roles', function ($query) {
            $query->whereIn('roles.id', $this->roles()->pluck('roles.id'));
        })->pluck('name');
    }
}
