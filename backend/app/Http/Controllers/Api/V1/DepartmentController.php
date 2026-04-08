<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use App\Services\DepartmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function __construct(
        private readonly DepartmentService $service
    ) {}

    /**
     * List all departments.
     */
    public function index(Request $request): JsonResponse
    {
        $result = $this->service->list($request->only(['status', 'search', 'per_page']));
        return DepartmentResource::collection($result)->response();
    }

    /**
     * Show a single department with teams and head.
     */
    public function show(string $id): JsonResponse
    {
        $department = Department::with(['head', 'teams.lead', 'teams.members'])->findOrFail($id);
        return (new DepartmentResource($department))->response();
    }

    /**
     * Create a new department.
     */
    public function store(StoreDepartmentRequest $request): JsonResponse
    {
        $department = $this->service->create(
            data: $request->validated(),
            userId: $request->user()->id,
            ip: $request->ip(),
        );

        return (new DepartmentResource($department))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Update a department.
     */
    public function update(UpdateDepartmentRequest $request, string $id): JsonResponse
    {
        $department = Department::findOrFail($id);
        $department = $this->service->update(
            department: $department,
            data: $request->validated(),
            userId: $request->user()->id,
            ip: $request->ip(),
        );

        return (new DepartmentResource($department))->response();
    }

    /**
     * Delete a department.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $department = Department::findOrFail($id);

        if ($department->teams()->exists()) {
            return response()->json([
                'message' => 'Không thể xóa phòng ban khi còn nhóm trực thuộc.',
            ], 422);
        }

        $this->service->delete(
            department: $department,
            userId: $request->user()->id,
            ip: $request->ip(),
        );

        return response()->json(['message' => 'Xóa phòng ban thành công.']);
    }
}
