<?php

namespace App\Services;

use App\Models\Department;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class DepartmentService
{
    public function __construct(
        private readonly ActivityLogService $activityLogService
    ) {}

    /**
     * List departments with optional filters.
     */
    public function list(array $filters): LengthAwarePaginator
    {
        $query = Department::with(['head', 'teams'])->latest();

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $query->where('name', 'ilike', '%' . $filters['search'] . '%');
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Create a new department.
     */
    public function create(array $data, ?string $userId = null, ?string $ip = null): Department
    {
        return DB::transaction(function () use ($data, $userId, $ip) {
            $department = Department::create($data);

            $this->activityLogService->log(
                userId: $userId,
                action: 'created',
                description: "Created department: {$department->name}",
                loggable: $department,
                ipAddress: $ip,
            );

            return $department->load(['head', 'teams']);
        });
    }

    /**
     * Update a department.
     */
    public function update(Department $department, array $data, ?string $userId = null, ?string $ip = null): Department
    {
        return DB::transaction(function () use ($department, $data, $userId, $ip) {
            $department->update($data);

            $this->activityLogService->log(
                userId: $userId,
                action: 'updated',
                description: "Updated department: {$department->name}",
                loggable: $department,
                metadata: ['changes' => $data],
                ipAddress: $ip,
            );

            return $department->load(['head', 'teams']);
        });
    }

    /**
     * Delete a department.
     */
    public function delete(Department $department, ?string $userId = null, ?string $ip = null): void
    {
        DB::transaction(function () use ($department, $userId, $ip) {
            $this->activityLogService->log(
                userId: $userId,
                action: 'deleted',
                description: "Deleted department: {$department->name}",
                loggable: $department,
                ipAddress: $ip,
            );

            $department->delete();
        });
    }
}
