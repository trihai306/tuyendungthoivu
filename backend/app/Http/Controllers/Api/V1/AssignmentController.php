<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\AssignmentStatus;
use App\Enums\WorkerStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssignmentRequest;
use App\Http\Resources\AssignmentResource;
use App\Models\Assignment;
use App\Models\StaffingOrder;
use App\Models\Worker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AssignmentController extends Controller
{
    /**
     * Display a paginated list of assignments.
     * Supports filtering by order_id, worker_id, status.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Assignment::query()
            ->with(['order.client', 'worker', 'assignedBy']);

        // Filter by order
        if ($request->filled('order_id')) {
            $query->where('order_id', $request->input('order_id'));
        }

        // Filter by worker
        if ($request->filled('worker_id')) {
            $query->where('worker_id', $request->input('worker_id'));
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter active only
        if ($request->boolean('active_only')) {
            $query->active();
        }

        // Filter by assigned_by (recruiter)
        if ($request->filled('assigned_by')) {
            $query->where('assigned_by', $request->input('assigned_by'));
        }

        // Sorting
        $sortField = $request->input('sort', '-created_at');
        $sortDirection = 'asc';
        if (str_starts_with($sortField, '-')) {
            $sortDirection = 'desc';
            $sortField = ltrim($sortField, '-');
        }

        $allowedSorts = ['created_at', 'status', 'confirmed_at', 'started_at', 'completed_at'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->latest();
        }

        $perPage = min($request->integer('per_page', 20), 100);
        $assignments = $query->paginate($perPage);

        return AssignmentResource::collection($assignments)
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Display the specified assignment.
     */
    public function show(string $assignment): JsonResponse
    {
        $assignment = Assignment::with(['order.client', 'worker.skills', 'assignedBy'])
            ->findOrFail($assignment);

        return response()->json([
            'data' => new AssignmentResource($assignment),
            'message' => 'Chi tiet phan cong',
        ]);
    }

    /**
     * Create a new assignment (assign a worker to an order).
     * Validates that the worker is available and the order has slots.
     */
    public function store(StoreAssignmentRequest $request): JsonResponse
    {
        $data = $request->validated();

        $order = StaffingOrder::findOrFail($data['staffing_order_id']);
        $worker = Worker::findOrFail($data['worker_id']);

        // Check if the order has available slots
        if ($order->quantity_filled >= $order->quantity_needed) {
            return response()->json([
                'message' => 'Don hang da du nguoi, khong the phan cong them.',
            ], 422);
        }

        // Check if the worker is already assigned to this order
        $existingAssignment = Assignment::where('order_id', $order->id)
            ->where('worker_id', $worker->id)
            ->active()
            ->first();

        if ($existingAssignment) {
            return response()->json([
                'message' => 'Worker da duoc phan cong cho don hang nay.',
            ], 422);
        }

        $assignment = DB::transaction(function () use ($data, $order, $request) {
            $assignment = Assignment::create([
                'order_id' => $data['staffing_order_id'],
                'worker_id' => $data['worker_id'],
                'assigned_by' => $request->user()->id,
                'status' => AssignmentStatus::Created,
                'dispatch_info' => $data['dispatch_info'] ?? null,
            ]);

            // Update order filled count
            $order->increment('quantity_filled');

            return $assignment;
        });

        return response()->json([
            'data' => new AssignmentResource($assignment->load(['order.client', 'worker', 'assignedBy'])),
            'message' => 'Phan cong worker thanh cong',
        ], 201);
    }

    /**
     * Update the status of an assignment.
     * Handles workflow transitions.
     */
    public function updateStatus(Request $request, string $assignment): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'string', 'in:' . implode(',', AssignmentStatus::values())],
            'note' => ['nullable', 'string', 'max:1000'],
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $assignment = Assignment::findOrFail($assignment);
        $newStatus = AssignmentStatus::from($request->input('status'));

        // Prevent updates on terminal assignments
        if ($assignment->status->isTerminal()) {
            return response()->json([
                'message' => 'Khong the cap nhat phan cong da ket thuc.',
            ], 422);
        }

        $updateData = ['status' => $newStatus];

        // Handle specific status transitions
        switch ($newStatus) {
            case AssignmentStatus::Confirmed:
                $updateData['confirmed_at'] = now();
                $updateData['confirmation_note'] = $request->input('note');
                break;

            case AssignmentStatus::Working:
                $updateData['started_at'] = now();
                break;

            case AssignmentStatus::Completed:
                $updateData['completed_at'] = now();
                break;

            case AssignmentStatus::Rejected:
                $updateData['rejection_reason'] = $request->input('reason');
                // Decrement order filled count when worker rejects
                $assignment->order->decrement('quantity_filled');
                break;

            case AssignmentStatus::Cancelled:
                // Decrement order filled count when assignment is cancelled
                $assignment->order->decrement('quantity_filled');
                break;

            case AssignmentStatus::Replaced:
                $updateData['replacement_reason'] = $request->input('reason');
                break;
        }

        $assignment->update($updateData);

        // Reset worker status to available if no other active assignments remain
        if ($newStatus->isTerminal()) {
            $worker = $assignment->worker;
            if ($worker) {
                $hasOtherActiveAssignments = Assignment::where('worker_id', $worker->id)
                    ->where('id', '!=', $assignment->id)
                    ->active()
                    ->exists();

                if (!$hasOtherActiveAssignments && $worker->status === WorkerStatus::Assigned) {
                    $worker->update(['status' => WorkerStatus::Available]);
                }
            }
        }

        return response()->json([
            'data' => new AssignmentResource($assignment->fresh()->load(['order.client', 'worker', 'assignedBy'])),
            'message' => 'Cap nhat trang thai phan cong thanh cong',
        ]);
    }

    /**
     * Bulk assign multiple workers to an order at once.
     */
    public function bulkAssign(Request $request): JsonResponse
    {
        $request->validate([
            'staffing_order_id' => ['required', 'uuid', 'exists:staffing_orders,id'],
            'worker_ids' => ['required', 'array', 'min:1'],
            'worker_ids.*' => ['uuid', 'exists:workers,id'],
            'dispatch_info' => ['nullable', 'string', 'max:2000'],
        ]);

        $order = StaffingOrder::findOrFail($request->input('staffing_order_id'));
        $workerIds = $request->input('worker_ids');
        $dispatchInfo = $request->input('dispatch_info');

        // Check available slots
        $remainingSlots = $order->quantity_needed - $order->quantity_filled;
        if (count($workerIds) > $remainingSlots) {
            return response()->json([
                'message' => "Don hang chi con {$remainingSlots} vi tri trong. Khong the phan cong " . count($workerIds) . ' worker.',
            ], 422);
        }

        $assignments = DB::transaction(function () use ($order, $workerIds, $dispatchInfo, $request) {
            $created = [];
            $errors = [];

            foreach ($workerIds as $workerId) {
                $worker = Worker::find($workerId);

                // Validate worker is available
                if (!$worker || $worker->status !== WorkerStatus::Available) {
                    $errors[] = [
                        'worker_id' => $workerId,
                        'message' => $worker
                            ? "Worker {$worker->full_name} khong san sang (trang thai: {$worker->status->label()})."
                            : 'Worker khong ton tai.',
                    ];
                    continue;
                }

                // Check duplicate assignment
                $exists = Assignment::where('order_id', $order->id)
                    ->where('worker_id', $workerId)
                    ->active()
                    ->exists();

                if ($exists) {
                    $errors[] = [
                        'worker_id' => $workerId,
                        'message' => "Worker {$worker->full_name} da duoc phan cong cho don hang nay.",
                    ];
                    continue;
                }

                $assignment = Assignment::create([
                    'order_id' => $order->id,
                    'worker_id' => $workerId,
                    'assigned_by' => $request->user()->id,
                    'status' => AssignmentStatus::Created,
                    'dispatch_info' => $dispatchInfo,
                ]);

                $order->increment('quantity_filled');
                $created[] = $assignment;
            }

            return ['created' => $created, 'errors' => $errors];
        });

        $result = [
            'data' => AssignmentResource::collection(
                collect($assignments['created'])->map(fn ($a) => $a->load(['worker', 'assignedBy']))
            ),
            'message' => 'Phan cong hang loat thanh cong. Da phan cong ' . count($assignments['created']) . ' worker.',
        ];

        if (!empty($assignments['errors'])) {
            $result['errors'] = $assignments['errors'];
        }

        return response()->json($result, 201);
    }

    /**
     * Remove (cancel) an assignment and free up the slot.
     */
    public function remove(string $assignment): JsonResponse
    {
        $assignment = Assignment::findOrFail($assignment);

        // Can only remove active assignments
        if ($assignment->status->isTerminal()) {
            return response()->json([
                'message' => 'Khong the huy phan cong da ket thuc.',
            ], 422);
        }

        DB::transaction(function () use ($assignment) {
            $assignment->update([
                'status' => AssignmentStatus::Cancelled,
            ]);

            // Decrement order filled count
            $assignment->order->decrement('quantity_filled');

            // Reset worker status to available if no other active assignments remain
            $worker = $assignment->worker;
            if ($worker) {
                $hasOtherActiveAssignments = Assignment::where('worker_id', $worker->id)
                    ->where('id', '!=', $assignment->id)
                    ->active()
                    ->exists();

                if (!$hasOtherActiveAssignments && $worker->status === WorkerStatus::Assigned) {
                    $worker->update(['status' => WorkerStatus::Available]);
                }
            }
        });

        return response()->json([
            'message' => 'Huy phan cong thanh cong',
        ]);
    }
}
