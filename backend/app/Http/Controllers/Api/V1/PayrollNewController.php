<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\PaymentMethod;
use App\Enums\PayrollStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\BulkCalculatePayrollRequest;
use App\Http\Requests\CalculatePayrollRequest;
use App\Http\Resources\PayrollNewResource;
use App\Models\AttendanceRecord;
use App\Models\PayrollRecord;
use App\Models\Worker;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PayrollNewController extends Controller
{
    /**
     * List payroll records with filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = PayrollRecord::with(['worker', 'order.client', 'approvedByUser']);

        if ($request->filled('worker_id')) {
            $query->where('worker_id', $request->input('worker_id'));
        }

        if ($request->filled('order_id')) {
            $query->where('order_id', $request->input('order_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('period_month') && $request->filled('period_year')) {
            $query->forMonth(
                $request->integer('period_month'),
                $request->integer('period_year')
            );
        }

        if ($request->filled('search')) {
            $term = $request->input('search');
            $query->where(function ($q) use ($term) {
                $q->where('payroll_code', 'ilike', "%{$term}%")
                  ->orWhereHas('worker', function ($wq) use ($term) {
                      $wq->where('full_name', 'ilike', "%{$term}%");
                  });
            });
        }

        $perPage = min($request->integer('per_page', 20), 100);
        $records = $query->orderByDesc('period_start')
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return PayrollNewResource::collection($records)
            ->additional(['message' => 'Danh sach bang luong'])
            ->response();
    }

    /**
     * Show payroll detail.
     */
    public function show(string $payrollId): JsonResponse
    {
        $payroll = PayrollRecord::with(['worker', 'order.client', 'approvedByUser', 'createdByUser', 'payments'])
            ->findOrFail($payrollId);

        return response()->json([
            'data' => new PayrollNewResource($payroll),
            'message' => 'Chi tiet phieu luong.',
        ]);
    }

    /**
     * Calculate payroll for a single worker in a period.
     */
    public function calculate(CalculatePayrollRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $month = $validated['period_month'];
        $year = $validated['period_year'];
        $workerId = $validated['worker_id'];
        $orderId = $validated['order_id'] ?? null;

        // Support flexible period (period_start/period_end) or default to full month
        $periodStart = $request->filled('period_start')
            ? Carbon::parse($request->input('period_start'))
            : Carbon::create($year, $month, 1)->startOfMonth();
        $periodEnd = $request->filled('period_end')
            ? Carbon::parse($request->input('period_end'))
            : Carbon::create($year, $month, 1)->endOfMonth();

        // Check for existing payroll
        $existing = PayrollRecord::where('worker_id', $workerId)
            ->where('period_start', $periodStart->format('Y-m-d'))
            ->where('period_end', $periodEnd->format('Y-m-d'));

        if ($orderId) {
            $existing->where('order_id', $orderId);
        }

        if ($existing->exists()) {
            return response()->json([
                'message' => 'Da ton tai phieu luong cho ky nay. Vui long xoa phieu cu truoc.',
            ], 422);
        }

        // Gather attendance data
        $attendanceQuery = AttendanceRecord::where('worker_id', $workerId)
            ->whereBetween('work_date', [$periodStart, $periodEnd])
            ->whereNotNull('total_hours');

        if ($orderId) {
            $attendanceQuery->where('order_id', $orderId);
        }

        $attendances = $attendanceQuery->get();

        if ($attendances->isEmpty()) {
            return response()->json([
                'message' => 'Khong co du lieu cham cong cho ky nay.',
            ], 422);
        }

        // Calculate amounts
        $worker = Worker::findOrFail($workerId);
        $totalDays = $attendances->count();
        $totalHours = (float) $attendances->sum('total_hours');
        $overtimeHours = (float) $attendances->sum('overtime_hours');

        // Get rate from order if available
        $order = $orderId
            ? \App\Models\StaffingOrder::find($orderId)
            : $attendances->first()?->order;

        $unitPrice = $order?->worker_rate ?? 0;
        $rateType = $order?->rate_type?->value ?? 'daily';
        $overtimeRate = $order?->overtime_rate ?? ($unitPrice * 1.5);

        // Calculate base amount
        $baseAmount = match ($rateType) {
            'hourly' => $totalHours * $unitPrice,
            'shift', 'daily' => $totalDays * $unitPrice,
            default => $totalDays * $unitPrice,
        };

        $overtimeAmount = $overtimeHours * ($overtimeRate > 0 ? $overtimeRate : $unitPrice * 1.5);

        // Support editable allowance and deduction
        $allowanceAmount = (float) $request->input('allowance', 0);
        $deductionAmount = (float) $request->input('deduction', 0);
        $netAmount = $baseAmount + $overtimeAmount + $allowanceAmount - $deductionAmount;

        $payrollCode = PayrollRecord::generatePayrollCode();

        $payroll = PayrollRecord::create([
            'payroll_code' => $payrollCode,
            'worker_id' => $workerId,
            'order_id' => $orderId ?? $order?->id,
            'period_start' => $periodStart->format('Y-m-d'),
            'period_end' => $periodEnd->format('Y-m-d'),
            'total_days' => $totalDays,
            'total_hours' => $totalHours,
            'overtime_hours' => $overtimeHours,
            'unit_price' => $unitPrice,
            'rate_type' => $rateType,
            'base_amount' => $baseAmount,
            'overtime_amount' => $overtimeAmount,
            'allowance_amount' => $allowanceAmount,
            'deduction_amount' => $deductionAmount,
            'net_amount' => $netAmount,
            'status' => PayrollStatus::Draft,
            'notes' => $request->input('notes'),
            'created_by' => $request->user()?->id,
        ]);

        $payroll->load(['worker', 'order.client']);

        return response()->json([
            'data' => new PayrollNewResource($payroll),
            'message' => 'Tinh luong thanh cong.',
        ], 201);
    }

    /**
     * Bulk calculate payroll for all workers in a given period.
     */
    public function bulkCalculate(BulkCalculatePayrollRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $month = $validated['period_month'];
        $year = $validated['period_year'];
        $orderId = $validated['order_id'] ?? null;

        $periodStart = Carbon::create($year, $month, 1)->startOfMonth();
        $periodEnd = $periodStart->copy()->endOfMonth();

        // Find all workers with attendance in this period
        $attendanceQuery = AttendanceRecord::whereBetween('work_date', [$periodStart, $periodEnd])
            ->whereNotNull('total_hours');

        if ($orderId) {
            $attendanceQuery->where('order_id', $orderId);
        }

        $workerIds = $attendanceQuery->distinct()->pluck('worker_id');

        $created = 0;
        $skipped = 0;
        $errors = [];

        DB::transaction(function () use ($workerIds, $periodStart, $periodEnd, $orderId, $month, $year, $request, &$created, &$skipped, &$errors) {
            foreach ($workerIds as $workerId) {
                // Skip if already has payroll
                $existingQuery = PayrollRecord::where('worker_id', $workerId)
                    ->where('period_start', $periodStart->format('Y-m-d'))
                    ->where('period_end', $periodEnd->format('Y-m-d'));

                if ($orderId) {
                    $existingQuery->where('order_id', $orderId);
                }

                if ($existingQuery->exists()) {
                    $skipped++;
                    continue;
                }

                // Get attendance data
                $attQuery = AttendanceRecord::where('worker_id', $workerId)
                    ->whereBetween('work_date', [$periodStart, $periodEnd])
                    ->whereNotNull('total_hours');

                if ($orderId) {
                    $attQuery->where('order_id', $orderId);
                }

                $attendances = $attQuery->get();

                if ($attendances->isEmpty()) {
                    $skipped++;
                    continue;
                }

                $totalDays = $attendances->count();
                $totalHours = (float) $attendances->sum('total_hours');
                $overtimeHours = (float) $attendances->sum('overtime_hours');

                $order = $orderId
                    ? \App\Models\StaffingOrder::find($orderId)
                    : $attendances->first()?->order;

                $unitPrice = $order?->worker_rate ?? 0;
                $rateType = $order?->rate_type?->value ?? 'daily';
                $overtimeRate = $order?->overtime_rate ?? ($unitPrice * 1.5);

                $baseAmount = match ($rateType) {
                    'hourly' => $totalHours * $unitPrice,
                    'shift', 'daily' => $totalDays * $unitPrice,
                    default => $totalDays * $unitPrice,
                };

                $overtimeAmount = $overtimeHours * ($overtimeRate > 0 ? $overtimeRate : $unitPrice * 1.5);
                $netAmount = $baseAmount + $overtimeAmount;

                try {
                    PayrollRecord::create([
                        'payroll_code' => PayrollRecord::generatePayrollCode(),
                        'worker_id' => $workerId,
                        'order_id' => $orderId ?? $order?->id,
                        'period_start' => $periodStart->format('Y-m-d'),
                        'period_end' => $periodEnd->format('Y-m-d'),
                        'total_days' => $totalDays,
                        'total_hours' => $totalHours,
                        'overtime_hours' => $overtimeHours,
                        'unit_price' => $unitPrice,
                        'rate_type' => $rateType,
                        'base_amount' => $baseAmount,
                        'overtime_amount' => $overtimeAmount,
                        'allowance_amount' => 0,
                        'deduction_amount' => 0,
                        'net_amount' => $netAmount,
                        'status' => PayrollStatus::Draft,
                        'created_by' => $request->user()?->id,
                    ]);
                    $created++;
                } catch (\Throwable $e) {
                    $errors[] = [
                        'worker_id' => $workerId,
                        'error' => $e->getMessage(),
                    ];
                }
            }
        });

        return response()->json([
            'data' => [
                'created' => $created,
                'skipped' => $skipped,
                'errors' => $errors,
            ],
            'message' => sprintf('Da tinh luong cho %d workers. Bo qua %d.', $created, $skipped),
        ], 201);
    }

    /**
     * Review a payroll record (Draft -> Reviewed).
     */
    public function review(Request $request, string $payrollId): JsonResponse
    {
        $payroll = PayrollRecord::findOrFail($payrollId);

        if ($payroll->status !== PayrollStatus::Draft) {
            return response()->json([
                'message' => 'Chi co the kiem tra phieu luong o trang thai nhap.',
            ], 422);
        }

        $payroll->update([
            'status' => PayrollStatus::Reviewed,
            'reviewed_by' => $request->user()?->id,
            'reviewed_at' => now(),
        ]);

        $payroll->load(['worker', 'order.client', 'reviewedByUser']);

        return response()->json([
            'data' => new PayrollNewResource($payroll),
            'message' => 'Kiem tra phieu luong thanh cong.',
        ]);
    }

    /**
     * Approve a payroll record.
     */
    public function approve(Request $request, string $payrollId): JsonResponse
    {
        $payroll = PayrollRecord::findOrFail($payrollId);

        if (!in_array($payroll->status, [PayrollStatus::Draft, PayrollStatus::Reviewed])) {
            return response()->json([
                'message' => 'Chi co the duyet phieu luong o trang thai nhap hoac da kiem tra.',
            ], 422);
        }

        $payroll->update([
            'status' => PayrollStatus::Approved,
            'approved_by' => $request->user()?->id,
            'approved_at' => now(),
        ]);

        $payroll->load(['worker', 'order.client', 'approvedByUser']);

        return response()->json([
            'data' => new PayrollNewResource($payroll),
            'message' => 'Duyet phieu luong thanh cong.',
        ]);
    }

    /**
     * Mark a payroll as paid.
     */
    public function markPaid(Request $request, string $payrollId): JsonResponse
    {
        $request->validate([
            'payment_method' => ['nullable', 'string', 'in:cash,bank_transfer,check'],
            'payment_reference' => ['nullable', 'string', 'max:100'],
        ]);

        $payroll = PayrollRecord::findOrFail($payrollId);

        if ($payroll->status !== PayrollStatus::Approved) {
            return response()->json([
                'message' => 'Chi co the thanh toan phieu luong da duyet.',
            ], 422);
        }

        $payroll->update([
            'status' => PayrollStatus::Paid,
            'paid_at' => now(),
            'payment_method' => $request->input('payment_method', 'bank_transfer'),
            'payment_reference' => $request->input('payment_reference'),
        ]);

        $payroll->load(['worker', 'order.client']);

        return response()->json([
            'data' => new PayrollNewResource($payroll),
            'message' => 'Thanh toan luong thanh cong.',
        ]);
    }

    /**
     * Bulk pay multiple payroll records.
     */
    public function bulkPay(Request $request): JsonResponse
    {
        $request->validate([
            'payroll_ids' => ['required', 'array', 'min:1'],
            'payroll_ids.*' => ['required', 'uuid', 'exists:payrolls_v2,id'],
            'payment_method' => ['nullable', 'string', 'in:cash,bank_transfer,check'],
        ]);

        $payrolls = PayrollRecord::whereIn('id', $request->input('payroll_ids'))
            ->where('status', PayrollStatus::Approved)
            ->get();

        if ($payrolls->isEmpty()) {
            return response()->json([
                'message' => 'Khong co phieu luong nao du dieu kien thanh toan.',
            ], 422);
        }

        $paidCount = 0;

        DB::transaction(function () use ($payrolls, $request, &$paidCount) {
            foreach ($payrolls as $payroll) {
                $payroll->update([
                    'status' => PayrollStatus::Paid,
                    'paid_at' => now(),
                    'payment_method' => $request->input('payment_method', 'bank_transfer'),
                ]);
                $paidCount++;
            }
        });

        return response()->json([
            'data' => ['paid_count' => $paidCount],
            'message' => sprintf('Da thanh toan %d phieu luong.', $paidCount),
        ]);
    }

    /**
     * Export payroll data as JSON (frontend handles export format).
     */
    public function export(Request $request): JsonResponse
    {
        $query = PayrollRecord::with(['worker', 'order.client']);

        if ($request->filled('period_month') && $request->filled('period_year')) {
            $query->forMonth(
                $request->integer('period_month'),
                $request->integer('period_year')
            );
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('order_id')) {
            $query->where('order_id', $request->input('order_id'));
        }

        $records = $query->orderBy('payroll_code')->get();

        $summary = [
            'total_records' => $records->count(),
            'total_base' => $records->sum('base_amount'),
            'total_overtime' => $records->sum('overtime_amount'),
            'total_allowance' => $records->sum('allowance_amount'),
            'total_deduction' => $records->sum('deduction_amount'),
            'total_net' => $records->sum('net_amount'),
        ];

        return response()->json([
            'data' => [
                'summary' => $summary,
                'records' => PayrollNewResource::collection($records),
            ],
            'message' => 'Du lieu xuat bang luong.',
        ]);
    }
}
