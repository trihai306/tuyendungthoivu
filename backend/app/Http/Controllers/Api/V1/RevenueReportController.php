<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\RevenueReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RevenueReportController extends Controller
{
    public function __construct(
        private RevenueReportService $reportService,
    ) {}

    /**
     * Revenue overview for a given month/year.
     */
    public function overview(Request $request): JsonResponse
    {
        $month = $request->integer('month', now()->month);
        $year = $request->integer('year', now()->year);

        $data = $this->reportService->getOverview($month, $year);

        return response()->json([
            'data' => $data,
            'message' => 'Tong quan doanh thu.',
        ]);
    }

    /**
     * Revenue breakdown by client.
     */
    public function byClient(Request $request): JsonResponse
    {
        $month = $request->integer('month', now()->month);
        $year = $request->integer('year', now()->year);

        $data = $this->reportService->revenueByClient($month, $year);

        return response()->json([
            'data' => $data,
            'message' => 'Doanh thu theo khách hàng.',
        ]);
    }

    /**
     * Monthly revenue trend (last N months).
     */
    public function trend(Request $request): JsonResponse
    {
        $months = $request->integer('months', 6);

        $data = $this->reportService->monthlyTrend($months);

        return response()->json([
            'data' => $data,
            'message' => 'Xu huong doanh thu.',
        ]);
    }

    /**
     * Staff payroll summary for accountant.
     */
    public function staffPayrollSummary(Request $request): JsonResponse
    {
        $month = $request->integer('month', now()->month);
        $year = $request->integer('year', now()->year);

        $data = $this->reportService->staffPayrollSummary($month, $year);

        return response()->json([
            'data' => $data,
            'message' => 'Tong hop luong nhan vien.',
        ]);
    }
}
