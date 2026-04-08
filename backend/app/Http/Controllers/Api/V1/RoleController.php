<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\SyncRolePermissionsRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Http\Resources\PermissionResource;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use App\Services\RoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function __construct(
        private readonly RoleService $service
    ) {}

    /**
     * List all roles with their permissions.
     */
    public function index(Request $request): JsonResponse
    {
        $result = $this->service->list($request->only(['search', 'per_page']));
        return RoleResource::collection($result)->response();
    }

    /**
     * Show a single role.
     */
    public function show(string $id): JsonResponse
    {
        $role = Role::with('permissions')->findOrFail($id);
        return (new RoleResource($role))->response();
    }

    /**
     * Create a new role.
     */
    public function store(StoreRoleRequest $request): JsonResponse
    {
        $role = $this->service->create(
            data: $request->validated(),
            userId: $request->user()->id,
            ip: $request->ip(),
        );

        return (new RoleResource($role))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Update a role.
     */
    public function update(UpdateRoleRequest $request, string $id): JsonResponse
    {
        $role = Role::findOrFail($id);
        $role = $this->service->update(
            role: $role,
            data: $request->validated(),
            userId: $request->user()->id,
            ip: $request->ip(),
        );

        return (new RoleResource($role))->response();
    }

    /**
     * Delete a role.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $role = Role::findOrFail($id);
        $this->service->delete(
            role: $role,
            userId: $request->user()->id,
            ip: $request->ip(),
        );

        return response()->json(['message' => 'Xóa vai trò thành công.']);
    }

    /**
     * Sync permissions for a role (replace all).
     */
    public function syncPermissions(SyncRolePermissionsRequest $request, string $id): JsonResponse
    {
        $role = Role::findOrFail($id);
        $role = $this->service->syncPermissions(
            role: $role,
            permissionIds: $request->validated('permission_ids'),
            userId: $request->user()->id,
            ip: $request->ip(),
        );

        return (new RoleResource($role))->response();
    }

    /**
     * Attach permissions to a role (add without removing existing).
     */
    public function attachPermissions(SyncRolePermissionsRequest $request, string $id): JsonResponse
    {
        $role = Role::findOrFail($id);
        $role = $this->service->attachPermissions(
            role: $role,
            permissionIds: $request->validated('permission_ids'),
            userId: $request->user()->id,
            ip: $request->ip(),
        );

        return (new RoleResource($role))->response();
    }

    /**
     * Detach permissions from a role.
     */
    public function detachPermissions(SyncRolePermissionsRequest $request, string $id): JsonResponse
    {
        $role = Role::findOrFail($id);
        $role = $this->service->detachPermissions(
            role: $role,
            permissionIds: $request->validated('permission_ids'),
            userId: $request->user()->id,
            ip: $request->ip(),
        );

        return (new RoleResource($role))->response();
    }

    /**
     * List all permissions grouped by module.
     */
    public function permissions(): JsonResponse
    {
        $grouped = $this->service->getPermissionsByModule();

        $result = $grouped->map(function ($permissions, $module) {
            return [
                'module' => $module,
                'permissions' => PermissionResource::collection($permissions),
            ];
        })->values();

        return response()->json(['data' => $result]);
    }
}
