<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StaffService
{
    public function __construct(
        private readonly ActivityLogService $activityLogService
    ) {}

    /**
     * List staff members (users who are internal staff, not workers/employers).
     */
    public function list(array $filters): LengthAwarePaginator
    {
        $query = User::with(['department', 'team', 'roles', 'assignedTasks'])
            ->whereNotNull('employee_code') // Only users with employee codes are staff
            ->latest();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('employee_code', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        if (!empty($filters['role'])) {
            $roleName = $filters['role'];
            $query->where(function ($q) use ($roleName) {
                $q->where('role', $roleName)
                    ->orWhereHas('roles', function ($rq) use ($roleName) {
                        $rq->where('name', $roleName);
                    });
            });
        }

        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Show a single staff member.
     */
    public function show(string $id): User
    {
        return User::with(['department', 'team', 'roles', 'assignedTasks'])
            ->findOrFail($id);
    }

    /**
     * Toggle active status of a staff member.
     */
    public function toggleActive(string $id, ?string $userId = null, ?string $ip = null): User
    {
        $staff = User::findOrFail($id);
        $staff->is_active = !$staff->is_active;
        $staff->save();

        $this->activityLogService->log(
            userId: $userId,
            action: 'updated',
            description: "Toggled staff active status: {$staff->name} -> " . ($staff->is_active ? 'active' : 'inactive'),
            loggable: $staff,
            ipAddress: $ip,
        );

        return $staff->load(['department', 'team', 'roles', 'assignedTasks']);
    }
}
