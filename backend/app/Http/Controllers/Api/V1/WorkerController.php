<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\WorkerStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWorkerRequest;
use App\Http\Requests\UpdateWorkerRequest;
use App\Http\Resources\WorkerResource2;
use App\Models\Worker;
use App\Services\WorkerEvaluationService;
use App\Traits\ScopesDataByRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkerController extends Controller
{
    use ScopesDataByRole;

    public function __construct(
        private readonly WorkerEvaluationService $evaluationService,
    ) {}
    /**
     * Display a paginated list of workers.
     * Supports filtering by status, skills, area, rating, assigned_staff, and search.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Worker::query()
            ->with(['skills'])
            ->withCount('assignments');

        // Role-based data scoping: Recruiters only see their own workers
        $user = $request->user();
        if (!$this->isManagerOrAbove($user)) {
            $query->where('registered_by', $user->id);
        }

        // Search by name, phone, cccd, worker_code
        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by skill (skill_id or skill name)
        if ($request->filled('skill_id')) {
            $query->whereHas('skills', function ($q) use ($request) {
                $q->where('skills.id', $request->input('skill_id'));
            });
        }

        if ($request->filled('skill')) {
            $query->whereHas('skills', function ($q) use ($request) {
                $q->where('name', 'ilike', '%' . $request->input('skill') . '%');
            });
        }

        // Filter by area
        if ($request->filled('city')) {
            $query->where('city', $request->input('city'));
        }

        if ($request->filled('district')) {
            $query->where(function ($q) use ($request) {
                $q->where('district', $request->input('district'))
                  ->orWhereJsonContains('preferred_districts', $request->input('district'));
            });
        }

        // Filter by minimum rating
        if ($request->filled('rating_min')) {
            $query->where('average_rating', '>=', $request->input('rating_min'));
        }

        // Filter by assigned staff (registered_by)
        if ($request->filled('assigned_staff_id')) {
            $query->where('registered_by', $request->input('assigned_staff_id'));
        }

        // Filter by gender
        if ($request->filled('gender')) {
            $query->where('gender', $request->input('gender'));
        }

        // Filter by availability
        if ($request->filled('availability')) {
            $query->where('availability', $request->input('availability'));
        }

        // Sorting
        $sortField = $request->input('sort', '-created_at');
        $sortDirection = 'asc';
        if (str_starts_with($sortField, '-')) {
            $sortDirection = 'desc';
            $sortField = ltrim($sortField, '-');
        }

        $allowedSorts = ['full_name', 'created_at', 'average_rating', 'total_orders', 'last_worked_date', 'status'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->latest();
        }

        $perPage = min($request->integer('per_page', 20), 100);
        $workers = $query->paginate($perPage);

        return WorkerResource2::collection($workers)
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Display the specified worker with full details.
     */
    public function show(string $worker): JsonResponse
    {
        $worker = Worker::with(['skills', 'registeredBy', 'assignments.order.client'])
            ->withCount('assignments')
            ->findOrFail($worker);

        return response()->json([
            'data' => new WorkerResource2($worker),
            'message' => 'Chi tiết worker',
        ]);
    }

    /**
     * Store a newly created worker.
     */
    public function store(StoreWorkerRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['registered_by'] = $request->user()->id;

        // Extract skill_ids before creating the worker
        $skillIds = $data['skill_ids'] ?? [];
        unset($data['skill_ids']);

        // worker_code is auto-generated via model boot
        $worker = Worker::create($data);

        // Attach skills if provided
        if (!empty($skillIds)) {
            $worker->skills()->attach($skillIds);
        }

        return response()->json([
            'data' => new WorkerResource2($worker->load('skills')),
            'message' => 'Thêm worker thành công',
        ], 201);
    }

    /**
     * Update the specified worker.
     */
    public function update(UpdateWorkerRequest $request, string $worker): JsonResponse
    {
        $worker = Worker::findOrFail($worker);

        $data = $request->validated();

        // Extract skill_ids for sync if provided
        $skillIds = $data['skill_ids'] ?? null;
        unset($data['skill_ids']);

        $worker->update($data);

        // Sync skills if provided
        if ($skillIds !== null) {
            $worker->skills()->sync($skillIds);
        }

        return response()->json([
            'data' => new WorkerResource2($worker->fresh()->load('skills')),
            'message' => 'Cập nhật worker thành công',
        ]);
    }

    /**
     * Soft delete the specified worker.
     */
    public function destroy(string $worker): JsonResponse
    {
        $worker = Worker::findOrFail($worker);

        // Prevent deletion if worker has active assignments
        $activeAssignmentsCount = $worker->assignments()->active()->count();

        if ($activeAssignmentsCount > 0) {
            return response()->json([
                'message' => 'Không thể xóa worker đang có phân công hoạt động.',
            ], 422);
        }

        $worker->delete();

        return response()->json([
            'message' => 'Xóa worker thành công',
        ]);
    }

    /**
     * Update the status of a worker.
     * Handles transitions: available, assigned, inactive, blacklisted.
     */
    public function updateStatus(Request $request, string $worker): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'string', 'in:' . implode(',', WorkerStatus::values())],
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $worker = Worker::findOrFail($worker);
        $newStatus = WorkerStatus::from($request->input('status'));

        $updateData = ['status' => $newStatus];

        // Require reason for blacklisting
        if ($newStatus === WorkerStatus::Blacklisted) {
            if (!$request->filled('reason')) {
                return response()->json([
                    'message' => 'Lý do là bắt buộc khi đưa worker vào danh sách đen.',
                    'errors' => ['reason' => ['Lý do là bắt buộc khi đưa worker vào danh sách đen.']],
                ], 422);
            }
            $updateData['blacklist_reason'] = $request->input('reason');
        }

        // Clear blacklist reason when removing from blacklist
        if ($worker->status === WorkerStatus::Blacklisted && $newStatus !== WorkerStatus::Blacklisted) {
            $updateData['blacklist_reason'] = null;
        }

        $worker->update($updateData);

        return response()->json([
            'data' => new WorkerResource2($worker->fresh()),
            'message' => 'Cập nhật trạng thái worker thành công',
        ]);
    }

    /**
     * Assign a staff member (recruiter) to manage this worker.
     */
    public function assignStaff(Request $request, string $worker): JsonResponse
    {
        $request->validate([
            'staff_id' => ['required', 'uuid', 'exists:users,id'],
        ]);

        $worker = Worker::findOrFail($worker);

        $worker->update([
            'registered_by' => $request->input('staff_id'),
        ]);

        return response()->json([
            'data' => new WorkerResource2($worker->fresh()->load('registeredBy')),
            'message' => 'Gán người phụ trách thành công',
        ]);
    }

    /**
     * Get auto-calculated evaluation, work history, and recent attendance for a worker.
     * All scores are computed from attendance data - no manual input needed.
     */
    public function evaluation(string $worker): JsonResponse
    {
        $worker = Worker::findOrFail($worker);

        // Sync stats (update denormalized fields)
        $this->evaluationService->syncWorkerStats($worker);

        return response()->json([
            'data' => [
                'worker_id' => $worker->id,
                'worker_name' => $worker->full_name,
                'rating' => $this->evaluationService->calculateOverallRating($worker),
                'work_history' => $this->evaluationService->getWorkHistory($worker),
                'recent_attendance' => $this->evaluationService->getRecentAttendance($worker),
            ],
            'message' => 'Đánh giá tự động worker',
        ]);
    }
}
