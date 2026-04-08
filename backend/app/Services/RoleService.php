<?php

namespace App\Services;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class RoleService
{
    public function __construct(
        private readonly ActivityLogService $activityLogService
    ) {}

    /**
     * List all roles with their permissions.
     */
    public function list(array $filters): LengthAwarePaginator
    {
        $query = Role::with('permissions')->withCount('users')->byLevel();

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'ilike', '%' . $filters['search'] . '%')
                  ->orWhere('display_name', 'ilike', '%' . $filters['search'] . '%');
            });
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Create a new role.
     */
    public function create(array $data, ?string $userId = null, ?string $ip = null): Role
    {
        return DB::transaction(function () use ($data, $userId, $ip) {
            $role = Role::create($data);

            $this->activityLogService->log(
                userId: $userId,
                action: 'created',
                description: "Created role: {$role->display_name}",
                loggable: $role,
                ipAddress: $ip,
            );

            return $role->load('permissions');
        });
    }

    /**
     * Update an existing role.
     */
    public function update(Role $role, array $data, ?string $userId = null, ?string $ip = null): Role
    {
        return DB::transaction(function () use ($role, $data, $userId, $ip) {
            $role->update($data);

            $this->activityLogService->log(
                userId: $userId,
                action: 'updated',
                description: "Updated role: {$role->display_name}",
                loggable: $role,
                metadata: ['changes' => $data],
                ipAddress: $ip,
            );

            return $role->load('permissions');
        });
    }

    /**
     * Delete a role.
     */
    public function delete(Role $role, ?string $userId = null, ?string $ip = null): void
    {
        DB::transaction(function () use ($role, $userId, $ip) {
            $this->activityLogService->log(
                userId: $userId,
                action: 'deleted',
                description: "Deleted role: {$role->display_name}",
                loggable: $role,
                ipAddress: $ip,
            );

            $role->permissions()->detach();
            $role->users()->detach();
            $role->delete();
        });
    }

    /**
     * Sync permissions to a role.
     */
    public function syncPermissions(Role $role, array $permissionIds, ?string $userId = null, ?string $ip = null): Role
    {
        return DB::transaction(function () use ($role, $permissionIds, $userId, $ip) {
            $role->permissions()->sync($permissionIds);

            $this->activityLogService->log(
                userId: $userId,
                action: 'synced_permissions',
                description: "Synced permissions for role: {$role->display_name}",
                loggable: $role,
                metadata: ['permission_ids' => $permissionIds],
                ipAddress: $ip,
            );

            return $role->load('permissions');
        });
    }

    /**
     * Attach specific permissions to a role.
     */
    public function attachPermissions(Role $role, array $permissionIds, ?string $userId = null, ?string $ip = null): Role
    {
        return DB::transaction(function () use ($role, $permissionIds, $userId, $ip) {
            $role->permissions()->syncWithoutDetaching($permissionIds);

            $this->activityLogService->log(
                userId: $userId,
                action: 'attached_permissions',
                description: "Attached permissions to role: {$role->display_name}",
                loggable: $role,
                metadata: ['permission_ids' => $permissionIds],
                ipAddress: $ip,
            );

            return $role->load('permissions');
        });
    }

    /**
     * Detach specific permissions from a role.
     */
    public function detachPermissions(Role $role, array $permissionIds, ?string $userId = null, ?string $ip = null): Role
    {
        return DB::transaction(function () use ($role, $permissionIds, $userId, $ip) {
            $role->permissions()->detach($permissionIds);

            $this->activityLogService->log(
                userId: $userId,
                action: 'detached_permissions',
                description: "Detached permissions from role: {$role->display_name}",
                loggable: $role,
                metadata: ['permission_ids' => $permissionIds],
                ipAddress: $ip,
            );

            return $role->load('permissions');
        });
    }

    /**
     * Get all permissions grouped by module.
     */
    public function getPermissionsByModule(): Collection
    {
        return Permission::orderBy('module')->orderBy('name')->get()
            ->groupBy('module');
    }
}
