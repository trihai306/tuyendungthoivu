<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\StaffingOrder\ApproveStaffingOrder;
use App\Actions\StaffingOrder\CreateStaffingOrder;
use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStaffingOrderRequest;
use App\Http\Requests\UpdateStaffingOrderRequest;
use App\Http\Resources\StaffingOrderResource;
use App\Models\StaffingOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StaffingOrderController extends Controller
{
    public function __construct(
        private readonly CreateStaffingOrder $createStaffingOrder,
        private readonly ApproveStaffingOrder $approveStaffingOrder,
    ) {}

    /**
     * Display a paginated list of staffing orders.
     * Supports filtering by status, urgency, service_type, client_id, assigned_to, date range, search.
     */
    public function index(Request $request): JsonResponse
    {
        $query = StaffingOrder::query()
            ->with(['client', 'assignedRecruiter'])
            ->withCount('assignments');

        // Search by order_code, position_name, client company_name
        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by urgency
        if ($request->filled('urgency')) {
            $query->where('urgency', $request->input('urgency'));
        }

        // Filter by service_type
        if ($request->filled('service_type')) {
            $query->where('service_type', $request->input('service_type'));
        }

        // Filter by client_id
        if ($request->filled('client_id')) {
            $query->where('client_id', $request->input('client_id'));
        }

        // Filter by assigned recruiter
        if ($request->filled('assigned_to')) {
            $query->where('assigned_recruiter_id', $request->input('assigned_to'));
        }

        // Filter by date range
        if ($request->filled('start_date_from')) {
            $query->where('start_date', '>=', $request->input('start_date_from'));
        }
        if ($request->filled('start_date_to')) {
            $query->where('start_date', '<=', $request->input('start_date_to'));
        }

        // Filter by work_city
        if ($request->filled('work_city')) {
            $query->where('work_city', $request->input('work_city'));
        }

        // Sorting
        $sortField = $request->input('sort', '-created_at');
        $sortDirection = 'asc';
        if (str_starts_with($sortField, '-')) {
            $sortDirection = 'desc';
            $sortField = ltrim($sortField, '-');
        }

        $allowedSorts = ['created_at', 'start_date', 'urgency', 'status', 'quantity_needed', 'order_code'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->latest();
        }

        $perPage = min($request->integer('per_page', 20), 100);
        $orders = $query->paginate($perPage);

        return StaffingOrderResource::collection($orders)
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Display the specified staffing order with full details.
     */
    public function show(string $order): JsonResponse
    {
        $order = StaffingOrder::with([
            'client',
            'assignedRecruiter',
            'createdBy',
            'approvedBy',
            'assignments.worker',
        ])
            ->withCount('assignments')
            ->findOrFail($order);

        return response()->json([
            'data' => new StaffingOrderResource($order),
            'message' => 'Chi tiet don hang',
        ]);
    }

    /**
     * Store a newly created staffing order.
     * Delegates to CreateStaffingOrder action for activity logging and event dispatch.
     */
    public function store(StoreStaffingOrderRequest $request): JsonResponse
    {
        $order = $this->createStaffingOrder->execute(
            $request->validated(),
            $request->user()
        );

        return response()->json([
            'data' => new StaffingOrderResource($order->load('client')),
            'message' => 'Tao don hang thanh cong',
        ], 201);
    }

    /**
     * Update the specified staffing order.
     * Only allowed when order is in draft or pending status.
     */
    public function update(UpdateStaffingOrderRequest $request, string $order): JsonResponse
    {
        $order = StaffingOrder::findOrFail($order);

        // Only allow updates for draft or pending orders
        if (!in_array($order->status, [OrderStatus::Draft, OrderStatus::Pending])) {
            return response()->json([
                'message' => 'Chi co the cap nhat don hang o trang thai nhap hoac cho duyet.',
            ], 422);
        }

        $order->update($request->validated());

        return response()->json([
            'data' => new StaffingOrderResource($order->fresh()->load('client', 'assignedRecruiter')),
            'message' => 'Cap nhat don hang thanh cong',
        ]);
    }

    /**
     * Soft delete the specified staffing order.
     * Only allowed when order is in draft status.
     */
    public function destroy(string $order): JsonResponse
    {
        $order = StaffingOrder::findOrFail($order);

        if ($order->status !== OrderStatus::Draft) {
            return response()->json([
                'message' => 'Chi co the xoa don hang o trang thai nhap.',
            ], 422);
        }

        $order->delete();

        return response()->json([
            'message' => 'Xoa don hang thanh cong',
        ]);
    }

    /**
     * Approve a staffing order (pending -> approved).
     * Delegates to ApproveStaffingOrder action for validation, logging, and events.
     */
    public function approve(Request $request, string $order): JsonResponse
    {
        $order = StaffingOrder::findOrFail($order);

        $approvedOrder = $this->approveStaffingOrder->execute(
            $order,
            $request->user()
        );

        return response()->json([
            'data' => new StaffingOrderResource($approvedOrder->load('client', 'approvedBy')),
            'message' => 'Duyet don hang thanh cong',
        ]);
    }

    /**
     * Assign a recruiter to handle this order.
     */
    public function assign(Request $request, string $order): JsonResponse
    {
        $request->validate([
            'recruiter_id' => ['required', 'uuid', 'exists:users,id'],
        ]);

        $order = StaffingOrder::findOrFail($order);

        $order->update([
            'assigned_recruiter_id' => $request->input('recruiter_id'),
        ]);

        return response()->json([
            'data' => new StaffingOrderResource($order->fresh()->load('client', 'assignedRecruiter')),
            'message' => 'Phan cong recruiter thanh cong',
        ]);
    }

    /**
     * Update the status of a staffing order with workflow validation.
     */
    public function updateStatus(Request $request, string $order): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'string'],
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $order = StaffingOrder::findOrFail($order);
        $newStatus = OrderStatus::from($request->input('status'));

        // Validate state transition
        if (!$order->status->canTransitionTo($newStatus)) {
            return response()->json([
                'message' => "Khong the chuyen trang thai tu '{$order->status->label()}' sang '{$newStatus->label()}'.",
            ], 422);
        }

        $updateData = ['status' => $newStatus];

        // Handle special status transitions
        if ($newStatus === OrderStatus::Rejected) {
            $updateData['rejection_reason'] = $request->input('reason');
        }

        if ($newStatus === OrderStatus::Cancelled) {
            $updateData['cancellation_reason'] = $request->input('reason');
        }

        if ($newStatus === OrderStatus::Approved) {
            $updateData['approved_by'] = $request->user()->id;
            $updateData['approved_at'] = now();
        }

        $order->update($updateData);

        return response()->json([
            'data' => new StaffingOrderResource($order->fresh()->load('client', 'assignedRecruiter')),
            'message' => 'Cap nhat trang thai don hang thanh cong',
        ]);
    }
}
