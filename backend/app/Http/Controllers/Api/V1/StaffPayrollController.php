<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\PaymentMethod;
use App\Enums\StaffPayrollStatus;
use App\Http\Controllers\Controller;
use App\Models\StaffPayroll;
use App\Models\StaffSalaryConfig;
use App\Services\StaffPayrollService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StaffPayrollController extends Controller
{
    public function __construct(
        private StaffPayrollService $payrollService,
    ) {}

    // ── Salary Configs ──────────────────────────────────────────────

    public function salaryConfigs(Request $request): JsonResponse
    {
        $query = StaffSalaryConfig::with(['user', 'createdByUser']);

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        return response()->json([
            'data' => $query->orderByDesc('effective_from')->get(),
            'message' => 'Danh sach cau hinh luong.',
        ]);
    }

    public function storeSalaryConfig(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|uuid|exists:users,id',
            'base_salary' => 'required|numeric|min:0',
            'allowance' => 'nullable|numeric|min:0',
            'kpi_bonus_rate' => 'nullable|numeric|min:0|max:100',
            'effective_from' => 'required|date',
            'effective_to' => 'nullable|date|after:effective_from',
            'notes' => 'nullable|string',
        ]);

        $validated['created_by'] = $request->user()?->id;

        $config = StaffSalaryConfig::create($validated);
        $config->load(['user', 'createdByUser']);

        return response()->json([
            'data' => $config,
            'message' => 'Tạo cấu hình lương thành công.',
        ], 201);
    }

    public function updateSalaryConfig(Request $request, string $id): JsonResponse
    {
        $config = StaffSalaryConfig::findOrFail($id);

        $validated = $request->validate([
            'base_salary' => 'sometimes|numeric|min:0',
            'allowance' => 'nullable|numeric|min:0',
            'kpi_bonus_rate' => 'nullable|numeric|min:0|max:100',
            'effective_from' => 'sometimes|date',
            'effective_to' => 'nullable|date|after:effective_from',
            'notes' => 'nullable|string',
        ]);

        $config->update($validated);
        $config->load(['user', 'createdByUser']);

        return response()->json([
            'data' => $config,
            'message' => 'Cập nhật cấu hình lương thành công.',
        ]);
    }

    // ── Staff Payroll ───────────────────────────────────────────────

    public function index(Request $request): JsonResponse
    {
        $query = StaffPayroll::with(['user', 'approvedByUser', 'reviewedByUser']);

        if ($request->filled('period_month') && $request->filled('period_year')) {
            $query->forPeriod(
                $request->integer('period_month'),
                $request->integer('period_year'),
            );
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('search')) {
            $term = $request->input('search');
            $query->where(function ($q) use ($term) {
                $q->where('payroll_code', 'like', "%{$term}%")
                  ->orWhereHas('user', function ($uq) use ($term) {
                      $uq->where('name', 'like', "%{$term}%")
                        ->orWhere('employee_code', 'like', "%{$term}%");
                  });
            });
        }

        $perPage = min($request->integer('per_page', 20), 100);

        return response()->json([
            'data' => $query->orderByDesc('period_year')
                ->orderByDesc('period_month')
                ->orderBy('payroll_code')
                ->paginate($perPage),
            'message' => 'Danh sách bảng lương nhân viên.',
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $payroll = StaffPayroll::with([
            'user',
            'calculatedByUser',
            'reviewedByUser',
            'approvedByUser',
        ])->findOrFail($id);

        return response()->json([
            'data' => $payroll,
            'message' => 'Chi tiết bảng lương.',
        ]);
    }

    public function calculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|uuid|exists:users,id',
            'period_month' => 'required|integer|between:1,12',
            'period_year' => 'required|integer|between:2020,2099',
        ]);

        try {
            $payroll = $this->payrollService->calculate(
                $validated['user_id'],
                $validated['period_month'],
                $validated['period_year'],
                $request->user()?->id,
            );

            $payroll->load('user');

            return response()->json([
                'data' => $payroll,
                'message' => 'Tính lương thành công.',
            ], 201);
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function bulkCalculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'period_month' => 'required|integer|between:1,12',
            'period_year' => 'required|integer|between:2020,2099',
        ]);

        $result = $this->payrollService->bulkCalculate(
            $validated['period_month'],
            $validated['period_year'],
            $request->user()?->id,
        );

        return response()->json([
            'data' => $result,
            'message' => sprintf(
                'Đã tính lương cho %d nhân viên. Bỏ qua %d.',
                $result['created'],
                $result['skipped'],
            ),
        ], 201);
    }

    public function review(Request $request, string $id): JsonResponse
    {
        $payroll = StaffPayroll::findOrFail($id);

        if ($payroll->status !== StaffPayrollStatus::Draft) {
            return response()->json([
                'message' => 'Chỉ có thể kiểm tra bảng lương ở trạng thái nháp.',
            ], 422);
        }

        $payroll->update([
            'status' => StaffPayrollStatus::Reviewed,
            'reviewed_by' => $request->user()?->id,
            'reviewed_at' => now(),
        ]);

        $payroll->load(['user', 'reviewedByUser']);

        return response()->json([
            'data' => $payroll,
            'message' => 'Kiểm tra bảng lương thành công.',
        ]);
    }

    public function approve(Request $request, string $id): JsonResponse
    {
        $payroll = StaffPayroll::findOrFail($id);

        if (!in_array($payroll->status, [StaffPayrollStatus::Draft, StaffPayrollStatus::Reviewed])) {
            return response()->json([
                'message' => 'Chỉ có thể duyệt bảng lương ở trạng thái nháp hoặc đã kiểm tra.',
            ], 422);
        }

        $payroll->update([
            'status' => StaffPayrollStatus::Approved,
            'approved_by' => $request->user()?->id,
            'approved_at' => now(),
        ]);

        $payroll->load(['user', 'approvedByUser']);

        return response()->json([
            'data' => $payroll,
            'message' => 'Duyệt bảng lương thành công.',
        ]);
    }

    public function markPaid(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'payment_method' => 'nullable|string|in:cash,bank_transfer',
            'payment_reference' => 'nullable|string|max:100',
        ]);

        $payroll = StaffPayroll::findOrFail($id);

        if ($payroll->status !== StaffPayrollStatus::Approved) {
            return response()->json([
                'message' => 'Chỉ có thể thanh toán bảng lương đã duyệt.',
            ], 422);
        }

        $payroll->update([
            'status' => StaffPayrollStatus::Paid,
            'paid_at' => now(),
            'payment_method' => $request->input('payment_method', 'bank_transfer'),
            'payment_reference' => $request->input('payment_reference'),
        ]);

        $payroll->load('user');

        return response()->json([
            'data' => $payroll,
            'message' => 'Thanh toán lương thành công.',
        ]);
    }

    public function bulkApprove(Request $request): JsonResponse
    {
        $request->validate([
            'payroll_ids' => 'required|array|min:1',
            'payroll_ids.*' => 'required|uuid|exists:staff_payrolls,id',
        ]);

        $count = StaffPayroll::whereIn('id', $request->input('payroll_ids'))
            ->whereIn('status', [StaffPayrollStatus::Draft, StaffPayrollStatus::Reviewed])
            ->update([
                'status' => StaffPayrollStatus::Approved,
                'approved_by' => $request->user()?->id,
                'approved_at' => now(),
            ]);

        return response()->json([
            'data' => ['approved_count' => $count],
            'message' => "Đã duyệt {$count} bảng lương.",
        ]);
    }

    public function bulkPay(Request $request): JsonResponse
    {
        $request->validate([
            'payroll_ids' => 'required|array|min:1',
            'payroll_ids.*' => 'required|uuid|exists:staff_payrolls,id',
            'payment_method' => 'nullable|string|in:cash,bank_transfer',
        ]);

        $count = StaffPayroll::whereIn('id', $request->input('payroll_ids'))
            ->where('status', StaffPayrollStatus::Approved)
            ->update([
                'status' => StaffPayrollStatus::Paid,
                'paid_at' => now(),
                'payment_method' => $request->input('payment_method', 'bank_transfer'),
            ]);

        return response()->json([
            'data' => ['paid_count' => $count],
            'message' => "Đã thanh toán {$count} bảng lương.",
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $payroll = StaffPayroll::findOrFail($id);

        if ($payroll->status !== StaffPayrollStatus::Draft) {
            return response()->json([
                'message' => 'Chỉ có thể chỉnh sửa bảng lương ở trạng thái nháp.',
            ], 422);
        }

        $validated = $request->validate([
            'allowance' => 'nullable|numeric|min:0',
            'kpi_bonus' => 'nullable|numeric|min:0',
            'overtime_amount' => 'nullable|numeric|min:0',
            'deduction_amount' => 'nullable|numeric|min:0',
            'deduction_notes' => 'nullable|string',
            'insurance_amount' => 'nullable|numeric|min:0',
            'tax_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $payroll->fill($validated);
        $payroll->gross_amount = $payroll->calculateGross();
        $payroll->net_amount = $payroll->calculateNet();
        $payroll->save();

        $payroll->load('user');

        return response()->json([
            'data' => $payroll,
            'message' => 'Cập nhật bảng lương thành công.',
        ]);
    }
}
