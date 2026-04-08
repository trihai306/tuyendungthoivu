<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\AttendanceStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\BulkCheckInRequest;
use App\Http\Requests\CheckInRequest;
use App\Http\Requests\CheckOutRequest;
use App\Http\Resources\AttendanceNewResource;
use App\Models\Assignment;
use App\Models\AttendanceRecord;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttendanceNewController extends Controller
{
    /**
     * List attendance records with filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = AttendanceRecord::with(['worker', 'order.client', 'assignment', 'approvedBy']);

        // Filters
        if ($request->filled('order_id')) {
            $query->where('order_id', $request->input('order_id'));
        }

        if ($request->filled('worker_id')) {
            $query->where('worker_id', $request->input('worker_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('date')) {
            $query->where('work_date', $request->input('date'));
        }

        if ($request->filled('date_from')) {
            $query->where('work_date', '>=', $request->input('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->where('work_date', '<=', $request->input('date_to'));
        }

        if ($request->filled('is_approved')) {
            $query->where('is_approved', filter_var($request->input('is_approved'), FILTER_VALIDATE_BOOLEAN));
        }

        $perPage = min($request->integer('per_page', 20), 100);
        $records = $query->orderByDesc('work_date')
            ->orderBy('check_in_time')
            ->paginate($perPage);

        return AttendanceNewResource::collection($records)
            ->additional(['message' => 'Danh sach cham cong'])
            ->response();
    }

    /**
     * Worker check-in: record check-in time and GPS.
     */
    public function checkIn(CheckInRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $assignment = Assignment::with('worker', 'order')->findOrFail($validated['assignment_id']);

        // Check for existing record on the same date
        $existing = AttendanceRecord::where('assignment_id', $assignment->id)
            ->where('work_date', $validated['date'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Da co ban ghi cham cong cho ngay nay.',
                'data' => new AttendanceNewResource($existing->load(['worker', 'order.client'])),
            ], 422);
        }

        $checkInTime = Carbon::parse($validated['date'] . ' ' . $validated['check_in']);

        // Determine if late (based on order start_time)
        $status = AttendanceStatus::Present;
        if ($assignment->order && $assignment->order->start_time) {
            $expectedStart = Carbon::parse($validated['date'] . ' ' . $assignment->order->start_time);
            if ($checkInTime->gt($expectedStart->addMinutes(5))) {
                $status = AttendanceStatus::Late;
            }
        }

        $record = AttendanceRecord::create([
            'assignment_id' => $assignment->id,
            'worker_id' => $assignment->worker_id,
            'order_id' => $assignment->order_id,
            'work_date' => $validated['date'],
            'check_in_time' => $checkInTime,
            'check_in_by' => $request->user()?->id,
            'check_in_note' => $validated['note'] ?? null,
            'status' => $status,
        ]);

        $record->load(['worker', 'order.client', 'assignment']);

        return response()->json([
            'data' => new AttendanceNewResource($record),
            'message' => 'Check-in thanh cong.',
        ], 201);
    }

    /**
     * Worker check-out: record check-out time and calculate hours.
     */
    public function checkOut(CheckOutRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $record = AttendanceRecord::with(['worker', 'order.client', 'assignment'])
            ->findOrFail($validated['attendance_id']);

        if ($record->check_out_time) {
            return response()->json([
                'message' => 'Da check-out truoc do.',
                'data' => new AttendanceNewResource($record),
            ], 422);
        }

        $checkOutTime = Carbon::parse($record->work_date->format('Y-m-d') . ' ' . $validated['check_out']);

        // Calculate total hours
        $totalHours = null;
        if ($record->check_in_time) {
            $minutesWorked = $record->check_in_time->diffInMinutes($checkOutTime);
            $netMinutes = $minutesWorked - ($record->break_minutes ?? 0);
            $totalHours = round(max(0, $netMinutes) / 60, 1);
        }

        // Calculate overtime (hours beyond 8h standard)
        $overtimeHours = 0;
        if ($totalHours && $totalHours > 8) {
            $overtimeHours = round($totalHours - 8, 1);
        }

        $record->update([
            'check_out_time' => $checkOutTime,
            'check_out_by' => $request->user()?->id,
            'check_out_note' => $validated['note'] ?? null,
            'total_hours' => $totalHours,
            'overtime_hours' => $overtimeHours,
        ]);

        return response()->json([
            'data' => new AttendanceNewResource($record->fresh(['worker', 'order.client'])),
            'message' => 'Check-out thanh cong.',
        ]);
    }

    /**
     * Bulk check-in for all workers of an order on a given date.
     */
    public function bulkCheckIn(BulkCheckInRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $created = [];
        $errors = [];

        DB::transaction(function () use ($validated, &$created, &$errors, $request) {
            $checkInTime = Carbon::parse($validated['date'] . ' ' . $validated['check_in']);

            foreach ($validated['records'] as $record) {
                $assignment = Assignment::find($record['assignment_id']);

                if (!$assignment) {
                    $errors[] = [
                        'assignment_id' => $record['assignment_id'],
                        'error' => 'Phan cong khong ton tai.',
                    ];
                    continue;
                }

                // Skip if already checked in
                $existing = AttendanceRecord::where('assignment_id', $assignment->id)
                    ->where('work_date', $validated['date'])
                    ->first();

                if ($existing) {
                    $errors[] = [
                        'assignment_id' => $record['assignment_id'],
                        'error' => 'Da co ban ghi cham cong.',
                    ];
                    continue;
                }

                $status = isset($record['status'])
                    ? AttendanceStatus::from($record['status'])
                    : AttendanceStatus::Present;

                $attendance = AttendanceRecord::create([
                    'assignment_id' => $assignment->id,
                    'worker_id' => $assignment->worker_id,
                    'order_id' => $validated['order_id'],
                    'work_date' => $validated['date'],
                    'check_in_time' => $status === AttendanceStatus::Absent ? null : $checkInTime,
                    'check_in_by' => $request->user()?->id,
                    'check_in_note' => $record['note'] ?? null,
                    'status' => $status,
                ]);

                $created[] = $attendance;
            }
        });

        $loadedRecords = AttendanceRecord::with(['worker', 'order.client'])
            ->whereIn('id', collect($created)->pluck('id'))
            ->get();

        return response()->json([
            'data' => AttendanceNewResource::collection($loadedRecords),
            'errors' => $errors,
            'message' => sprintf('Da tao %d ban ghi cham cong.', count($created)),
        ], 201);
    }

    /**
     * Daily attendance report for a specific order.
     */
    public function dailyReport(Request $request, string $orderId): JsonResponse
    {
        $date = $request->input('date', now()->format('Y-m-d'));

        $records = AttendanceRecord::with(['worker', 'assignment'])
            ->where('order_id', $orderId)
            ->where('work_date', $date)
            ->orderBy('check_in_time')
            ->get();

        $summary = [
            'date' => $date,
            'order_id' => $orderId,
            'total_workers' => $records->count(),
            'present' => $records->where('status', AttendanceStatus::Present)->count(),
            'late' => $records->where('status', AttendanceStatus::Late)->count(),
            'absent' => $records->where('status', AttendanceStatus::Absent)->count(),
            'half_day' => $records->where('status', AttendanceStatus::HalfDay)->count(),
            'excused' => $records->where('status', AttendanceStatus::Excused)->count(),
            'total_hours' => $records->sum('total_hours'),
            'total_overtime' => $records->sum('overtime_hours'),
        ];

        return response()->json([
            'data' => [
                'summary' => $summary,
                'records' => AttendanceNewResource::collection($records),
            ],
            'message' => 'Bao cao cham cong ngay.',
        ]);
    }

    /**
     * Weekly attendance summary.
     */
    public function weeklyReport(Request $request): JsonResponse
    {
        $startDate = $request->input('start_date', now()->startOfWeek()->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->endOfWeek()->format('Y-m-d'));

        $query = AttendanceRecord::query()
            ->whereBetween('work_date', [$startDate, $endDate]);

        if ($request->filled('order_id')) {
            $query->where('order_id', $request->input('order_id'));
        }

        if ($request->filled('worker_id')) {
            $query->where('worker_id', $request->input('worker_id'));
        }

        // Group by date for the summary
        $dailySummary = $query->clone()
            ->select(
                'work_date',
                DB::raw("COUNT(*) as total_records"),
                DB::raw("COUNT(CASE WHEN status = 'present' THEN 1 END) as present_count"),
                DB::raw("COUNT(CASE WHEN status = 'late' THEN 1 END) as late_count"),
                DB::raw("COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_count"),
                DB::raw("COALESCE(SUM(total_hours), 0) as total_hours"),
                DB::raw("COALESCE(SUM(overtime_hours), 0) as total_overtime"),
            )
            ->groupBy('work_date')
            ->orderBy('work_date')
            ->get();

        // Overall totals
        $totals = [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'total_records' => $dailySummary->sum('total_records'),
            'total_hours' => $dailySummary->sum('total_hours'),
            'total_overtime' => $dailySummary->sum('total_overtime'),
        ];

        return response()->json([
            'data' => [
                'totals' => $totals,
                'daily_summary' => $dailySummary,
            ],
            'message' => 'Bao cao cham cong tuan.',
        ]);
    }

    /**
     * Monthly attendance report for a specific worker.
     */
    public function monthlyReport(Request $request, string $workerId): JsonResponse
    {
        $month = $request->integer('month', now()->month);
        $year = $request->integer('year', now()->year);

        $records = AttendanceRecord::with(['order.client', 'assignment'])
            ->where('worker_id', $workerId)
            ->whereMonth('work_date', $month)
            ->whereYear('work_date', $year)
            ->orderBy('work_date')
            ->get();

        $summary = [
            'worker_id' => $workerId,
            'month' => $month,
            'year' => $year,
            'total_days' => $records->count(),
            'present' => $records->where('status', AttendanceStatus::Present)->count(),
            'late' => $records->where('status', AttendanceStatus::Late)->count(),
            'absent' => $records->where('status', AttendanceStatus::Absent)->count(),
            'half_day' => $records->where('status', AttendanceStatus::HalfDay)->count(),
            'excused' => $records->where('status', AttendanceStatus::Excused)->count(),
            'total_hours' => $records->sum('total_hours'),
            'total_overtime' => $records->sum('overtime_hours'),
        ];

        return response()->json([
            'data' => [
                'summary' => $summary,
                'records' => AttendanceNewResource::collection($records),
            ],
            'message' => 'Bao cao cham cong thang.',
        ]);
    }
}
