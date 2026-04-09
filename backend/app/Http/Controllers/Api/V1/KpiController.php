<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\KpiPeriodStatus;
use App\Http\Controllers\Controller;
use App\Models\KpiConfig;
use App\Models\KpiPeriod;
use App\Models\KpiRecord;
use App\Services\KpiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KpiController extends Controller
{
    public function __construct(
        private KpiService $kpiService,
    ) {}

    // ── KPI Configs ─────────────────────────────────────────────────

    public function configs(Request $request): JsonResponse
    {
        $query = KpiConfig::query()->orderBy('sort_order');

        if ($request->boolean('active_only', false)) {
            $query->active();
        }

        if ($request->filled('role')) {
            $query->forRole($request->input('role'));
        }

        return response()->json([
            'data' => $query->get(),
            'message' => 'Danh sach chi so KPI.',
        ]);
    }

    public function storeConfig(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'code' => 'required|string|max:50|unique:kpi_configs,code',
            'description' => 'nullable|string',
            'unit' => 'required|string|in:count,percent,amount,hours,score',
            'applicable_roles' => 'required|array|min:1',
            'applicable_roles.*' => 'string|in:manager,recruiter,coordinator,sales,staff',
            'calculation_method' => 'required|string|in:manual,auto',
            'auto_source' => 'nullable|required_if:calculation_method,auto|string',
            'default_target' => 'nullable|numeric|min:0',
            'weight' => 'nullable|numeric|min:0|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $config = KpiConfig::create($validated);

        return response()->json([
            'data' => $config,
            'message' => 'Tạo chỉ số KPI thành công.',
        ], 201);
    }

    public function updateConfig(Request $request, string $id): JsonResponse
    {
        $config = KpiConfig::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'unit' => 'sometimes|string|in:count,percent,amount,hours,score',
            'applicable_roles' => 'sometimes|array|min:1',
            'applicable_roles.*' => 'string|in:manager,recruiter,coordinator,sales,staff',
            'calculation_method' => 'sometimes|string|in:manual,auto',
            'auto_source' => 'nullable|string',
            'default_target' => 'nullable|numeric|min:0',
            'weight' => 'nullable|numeric|min:0|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $config->update($validated);

        return response()->json([
            'data' => $config->fresh(),
            'message' => 'Cập nhật chỉ số KPI thành công.',
        ]);
    }

    public function destroyConfig(string $id): JsonResponse
    {
        $config = KpiConfig::findOrFail($id);

        if ($config->records()->exists()) {
            return response()->json([
                'message' => 'Không thể xóa chỉ số KPI đã có dữ liệu đánh giá.',
            ], 422);
        }

        $config->delete();

        return response()->json(['message' => 'Xóa chỉ số KPI thành công.']);
    }

    // ── KPI Periods ─────────────────────────────────────────────────

    public function periods(Request $request): JsonResponse
    {
        $query = KpiPeriod::with('createdByUser')
            ->orderByDesc('start_date');

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return response()->json([
            'data' => $query->paginate($request->integer('per_page', 20)),
            'message' => 'Danh sach ky danh gia.',
        ]);
    }

    public function storePeriod(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'required|string|in:monthly,quarterly,yearly',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $validated['status'] = 'open';
        $validated['created_by'] = $request->user()?->id;

        $period = KpiPeriod::create($validated);

        // Auto-initialize records
        $created = $this->kpiService->initializePeriod($period);

        return response()->json([
            'data' => $period->fresh()->load('createdByUser'),
            'records_created' => $created,
            'message' => "Tạo kỳ đánh giá thành công. Đã khởi tạo {$created} chỉ số KPI.",
        ], 201);
    }

    public function showPeriod(string $id): JsonResponse
    {
        $period = KpiPeriod::with('createdByUser')->findOrFail($id);

        $summary = $this->kpiService->getPeriodSummary($id);

        return response()->json([
            'data' => $period,
            'summary' => $summary,
            'message' => 'Chi tiet ky danh gia.',
        ]);
    }

    public function closePeriod(string $id): JsonResponse
    {
        $period = KpiPeriod::findOrFail($id);

        if ($period->status !== KpiPeriodStatus::Open) {
            return response()->json([
                'message' => 'Chi co the dong ky danh gia dang mo.',
            ], 422);
        }

        $period->update(['status' => KpiPeriodStatus::Closed]);

        return response()->json([
            'data' => $period->fresh(),
            'message' => 'Đóng kỳ đánh giá thành công.',
        ]);
    }

    public function autoCalculate(string $id): JsonResponse
    {
        $period = KpiPeriod::findOrFail($id);

        if ($period->status === KpiPeriodStatus::Locked) {
            return response()->json([
                'message' => 'Kỳ đánh giá đã khóa, không thể tính toán.',
            ], 422);
        }

        $updated = $this->kpiService->autoCalculate($period);

        return response()->json([
            'updated' => $updated,
            'message' => "Da tu dong tinh {$updated} chi so KPI.",
        ]);
    }

    // ── KPI Records ─────────────────────────────────────────────────

    public function records(Request $request): JsonResponse
    {
        $query = KpiRecord::with(['user', 'kpiConfig', 'evaluatedByUser', 'period']);

        if ($request->filled('period_id')) {
            $query->where('kpi_period_id', $request->input('period_id'));
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        $perPage = min($request->integer('per_page', 50), 100);

        return response()->json([
            'data' => $query->orderBy('user_id')->paginate($perPage),
            'message' => 'Danh sach ket qua KPI.',
        ]);
    }

    public function evaluate(Request $request, string $id): JsonResponse
    {
        $record = KpiRecord::findOrFail($id);

        $period = $record->period;
        if ($period->status === KpiPeriodStatus::Locked) {
            return response()->json([
                'message' => 'Kỳ đánh giá đã khóa, không thể cập nhật.',
            ], 422);
        }

        $validated = $request->validate([
            'actual_value' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $record->actual_value = $validated['actual_value'];
        $record->score = $record->calculateScore();
        $record->notes = $validated['notes'] ?? $record->notes;
        $record->evaluated_by = $request->user()?->id;
        $record->evaluated_at = now();
        $record->save();

        $record->load(['user', 'kpiConfig', 'evaluatedByUser']);

        return response()->json([
            'data' => $record,
            'message' => 'Cập nhật kết quả KPI thành công.',
        ]);
    }

    public function userKpiSummary(Request $request, string $userId): JsonResponse
    {
        $records = KpiRecord::with(['kpiConfig', 'period'])
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->get()
            ->groupBy('kpi_period_id');

        $periods = [];
        foreach ($records as $periodId => $periodRecords) {
            $period = $periodRecords->first()->period;
            $totalWeight = $periodRecords->sum('weight');
            $evaluated = $periodRecords->whereNotNull('score');
            $overallScore = $totalWeight > 0
                ? round($evaluated->sum(fn ($r) => (float) $r->score * (float) $r->weight) / $totalWeight, 2)
                : null;

            $periods[] = [
                'period' => $period,
                'records' => $periodRecords,
                'overall_score' => $overallScore,
                'grade' => $this->scoreToGrade($overallScore),
            ];
        }

        return response()->json([
            'data' => $periods,
            'message' => 'KPI cua nhan vien.',
        ]);
    }

    private function scoreToGrade(?float $score): string
    {
        if ($score === null) {
            return '-';
        }

        return match (true) {
            $score >= 95 => 'A+',
            $score >= 85 => 'A',
            $score >= 75 => 'B+',
            $score >= 65 => 'B',
            $score >= 50 => 'C',
            default => 'D',
        };
    }
}
