<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StaffResource;
use App\Services\StaffService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    public function __construct(
        private readonly StaffService $service
    ) {}

    /**
     * List staff members with optional filters.
     */
    public function index(Request $request): JsonResponse
    {
        $result = $this->service->list(
            $request->only(['search', 'role', 'department_id', 'is_active', 'per_page', 'page'])
        );

        return StaffResource::collection($result)->response();
    }

    /**
     * Show a single staff member.
     */
    public function show(string $id): JsonResponse
    {
        $staff = $this->service->show($id);
        return (new StaffResource($staff))->response();
    }

    /**
     * Toggle active/inactive status.
     */
    public function toggleActive(Request $request, string $id): JsonResponse
    {
        $staff = $this->service->toggleActive(
            id: $id,
            userId: $request->user()?->id,
            ip: $request->ip(),
        );

        return (new StaffResource($staff))->response();
    }
}
