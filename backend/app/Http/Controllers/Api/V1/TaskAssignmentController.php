<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\TaskStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskAssignmentRequest;
use App\Http\Requests\StoreTaskCommentRequest;
use App\Http\Requests\UpdateTaskStatusRequest;
use App\Http\Resources\TaskAssignmentResource;
use App\Http\Resources\TaskCommentResource;
use App\Services\TaskAssignmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskAssignmentController extends Controller
{
    public function __construct(
        private readonly TaskAssignmentService $service
    ) {}

    /**
     * List all tasks (admin/manager view) with filters.
     */
    public function index(Request $request): JsonResponse
    {
        $result = $this->service->list(
            $request->only([
                'assigned_to', 'assigned_by', 'status', 'priority',
                'type', 'search', 'overdue', 'sort_by', 'per_page',
            ])
        );

        return TaskAssignmentResource::collection($result)->response();
    }

    /**
     * Show a single task.
     */
    public function show(string $id): JsonResponse
    {
        $task = $this->service->find($id);
        return (new TaskAssignmentResource($task))->response();
    }

    /**
     * Create a new task assignment.
     */
    public function store(StoreTaskAssignmentRequest $request): JsonResponse
    {
        $task = $this->service->create(
            data: $request->validated(),
            assignedBy: $request->user()->id,
            ip: $request->ip(),
        );

        return (new TaskAssignmentResource($task))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Update task status.
     */
    public function updateStatus(UpdateTaskStatusRequest $request, string $id): JsonResponse
    {
        $task = $this->service->find($id);
        $newStatus = TaskStatus::from($request->validated('status'));

        try {
            $task = $this->service->updateStatus(
                task: $task,
                newStatus: $newStatus,
                notes: $request->validated('notes'),
                userId: $request->user()->id,
                ip: $request->ip(),
            );
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return (new TaskAssignmentResource($task))->response();
    }

    /**
     * Get tasks assigned to the authenticated user.
     */
    public function myTasks(Request $request): JsonResponse
    {
        $result = $this->service->myTasks(
            userId: $request->user()->id,
            filters: $request->only(['status', 'priority', 'type', 'search', 'overdue', 'sort_by', 'per_page']),
        );

        return TaskAssignmentResource::collection($result)->response();
    }

    /**
     * Get tasks for a specific team.
     */
    public function teamTasks(Request $request, string $teamId): JsonResponse
    {
        $result = $this->service->teamTasks(
            teamId: $teamId,
            filters: $request->only(['status', 'priority', 'per_page']),
        );

        return TaskAssignmentResource::collection($result)->response();
    }

    /**
     * Add a comment to a task.
     */
    public function addComment(StoreTaskCommentRequest $request, string $id): JsonResponse
    {
        $task = $this->service->find($id);
        $comment = $this->service->addComment(
            task: $task,
            userId: $request->user()->id,
            content: $request->validated('content'),
            ip: $request->ip(),
        );

        return (new TaskCommentResource($comment))
            ->response()
            ->setStatusCode(201);
    }
}
