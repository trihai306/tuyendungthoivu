<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityLogResource;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function __construct(
        private readonly ActivityLogService $service
    ) {}

    /**
     * List activity logs with optional filters.
     */
    public function index(Request $request): JsonResponse
    {
        $result = $this->service->list(
            $request->only([
                'user_id', 'action', 'loggable_type',
                'from', 'to', 'search', 'per_page',
            ])
        );

        return ActivityLogResource::collection($result)->response();
    }
}
