<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\AssignmentStatus;
use App\Enums\OrderStatus;
use App\Enums\WorkerStatus;
use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AttendanceRecord;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\StaffingOrder;
use App\Models\Worker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardNewController extends Controller
{
    /**
     * Dashboard KPI stats overview.
     */
    public function stats(Request $request): JsonResponse
    {
        $today = now()->format('Y-m-d');
        $monthStart = now()->startOfMonth()->format('Y-m-d');
        $monthEnd = now()->endOfMonth()->format('Y-m-d');

        // Active orders (not completed or cancelled)
        $activeOrders = StaffingOrder::whereNotIn('status', [
            OrderStatus::Completed,
            OrderStatus::Cancelled,
        ])->count();

        // Workers currently working (assigned status)
        $workersWorking = Worker::where('status', WorkerStatus::Assigned)->count();

        // Dispatch today: assignments that need to start today
        $dispatchToday = Assignment::whereHas('order', function ($q) use ($today) {
            $q->where('start_date', $today);
        })->active()->count();

        // Monthly revenue (from invoices paid this month)
        $monthlyRevenue = Payment::where('payable_type', 'invoice')
            ->whereBetween('payment_date', [$monthStart, $monthEnd])
            ->sum('amount');

        // Recent orders (6 most recent)
        $recentOrders = StaffingOrder::with('client')
            ->orderByDesc('created_at')
            ->limit(6)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'code' => $order->order_code,
                    'client' => $order->client?->company_name,
                    'position' => $order->position_name,
                    'quantity_needed' => $order->quantity_needed,
                    'quantity_filled' => $order->quantity_filled,
                    'status' => $order->status?->value,
                    'status_label' => $order->status?->label(),
                    'start_date' => $order->start_date?->format('Y-m-d'),
                    'created_at' => $order->created_at?->format('Y-m-d H:i'),
                ];
            });

        // Recent activities (latest 5 attendance check-ins)
        $recentActivities = AttendanceRecord::with(['worker', 'order'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(function ($att) {
                return [
                    'id' => $att->id,
                    'type' => 'attendance',
                    'worker_name' => $att->worker?->full_name,
                    'order_code' => $att->order?->order_code,
                    'action' => $att->check_out_time ? 'check_out' : 'check_in',
                    'date' => $att->work_date?->format('Y-m-d'),
                    'time' => $att->check_out_time
                        ? $att->check_out_time->format('H:i')
                        : $att->check_in_time?->format('H:i'),
                    'created_at' => $att->created_at?->format('Y-m-d H:i'),
                ];
            });

        // Workers by status
        $workersByStatus = Worker::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->status->value => $item->count];
            });

        // Dispatch today items (assignments needing dispatch today)
        $dispatchTodayItems = Assignment::with(['worker', 'order.client'])
            ->whereHas('order', function ($q) use ($today) {
                $q->where('start_date', $today);
            })
            ->active()
            ->limit(20)
            ->get()
            ->map(function ($assignment) {
                return [
                    'id' => $assignment->id,
                    'worker_name' => $assignment->worker?->full_name,
                    'worker_phone' => $assignment->worker?->phone,
                    'order_code' => $assignment->order?->order_code,
                    'client' => $assignment->order?->client?->company_name,
                    'position' => $assignment->order?->position_name,
                    'work_address' => $assignment->order?->work_address,
                    'start_time' => $assignment->order?->start_time,
                    'status' => $assignment->status?->value,
                    'status_label' => $assignment->status?->label(),
                ];
            });

        return response()->json([
            'data' => [
                'active_orders' => $activeOrders,
                'workers_working' => $workersWorking,
                'dispatch_today' => $dispatchToday,
                'monthly_revenue' => $monthlyRevenue,
                'recent_orders' => $recentOrders,
                'recent_activities' => $recentActivities,
                'workers_by_status' => $workersByStatus,
                'dispatch_today_items' => $dispatchTodayItems,
            ],
            'message' => 'Dashboard stats.',
        ]);
    }
}
