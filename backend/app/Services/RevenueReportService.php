<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\PayrollRecord;
use App\Models\StaffPayroll;
use App\Models\StaffingOrder;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class RevenueReportService
{
    /**
     * Get revenue overview for a given period.
     */
    public function getOverview(int $month, int $year): array
    {
        $startDate = sprintf('%04d-%02d-01', $year, $month);
        $endDate = date('Y-m-t', strtotime($startDate));

        // Revenue from invoices
        $invoiceRevenue = Invoice::whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
            ->whereIn('status', ['sent', 'partially_paid', 'paid'])
            ->sum('total_amount');

        $invoicePaid = Invoice::whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
            ->sum('paid_amount');

        // Worker payroll costs
        $workerPayrollCost = PayrollRecord::where('period_start', '>=', $startDate)
            ->where('period_end', '<=', $endDate)
            ->sum('net_amount');

        // Staff payroll costs
        $staffPayrollCost = StaffPayroll::forPeriod($month, $year)->sum('net_amount');

        // Active orders this month
        $activeOrders = StaffingOrder::where('start_date', '<=', $endDate)
            ->where(function ($q) use ($startDate) {
                $q->whereNull('end_date')
                  ->orWhere('end_date', '>=', $startDate);
            })
            ->whereIn('status', ['approved', 'recruiting', 'in_progress', 'filled', 'completed'])
            ->count();

        // Receivables (unpaid invoices)
        $totalReceivables = Invoice::whereIn('status', ['sent', 'partially_paid', 'overdue'])
            ->selectRaw('SUM(total_amount - paid_amount) as total')
            ->value('total') ?? 0;

        // Overdue invoices
        $overdueAmount = Invoice::where('status', 'overdue')
            ->selectRaw('SUM(total_amount - paid_amount) as total')
            ->value('total') ?? 0;

        $grossProfit = (float) $invoiceRevenue - (float) $workerPayrollCost;
        $netProfit = $grossProfit - (float) $staffPayrollCost;

        return [
            'period' => ['month' => $month, 'year' => $year],
            'revenue' => [
                'total_invoiced' => (float) $invoiceRevenue,
                'total_collected' => (float) $invoicePaid,
                'total_receivables' => (float) $totalReceivables,
                'overdue_amount' => (float) $overdueAmount,
            ],
            'costs' => [
                'worker_payroll' => (float) $workerPayrollCost,
                'staff_payroll' => (float) $staffPayrollCost,
                'total_costs' => (float) $workerPayrollCost + (float) $staffPayrollCost,
            ],
            'profit' => [
                'gross_profit' => $grossProfit,
                'net_profit' => $netProfit,
                'margin_percent' => $invoiceRevenue > 0
                    ? round(($grossProfit / (float) $invoiceRevenue) * 100, 1)
                    : 0,
            ],
            'operations' => [
                'active_orders' => $activeOrders,
            ],
        ];
    }

    /**
     * Revenue by client for a period.
     */
    public function revenueByClient(int $month, int $year): array
    {
        $startDate = sprintf('%04d-%02d-01', $year, $month);
        $endDate = date('Y-m-t', strtotime($startDate));

        return Invoice::select('client_id')
            ->selectRaw('SUM(total_amount) as total_revenue')
            ->selectRaw('SUM(paid_amount) as total_paid')
            ->selectRaw('COUNT(*) as invoice_count')
            ->with('client:id,company_name')
            ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
            ->groupBy('client_id')
            ->orderByDesc('total_revenue')
            ->get()
            ->map(fn ($row) => [
                'client_id' => $row->client_id,
                'client_name' => $row->client?->company_name ?? 'N/A',
                'total_revenue' => (float) $row->total_revenue,
                'total_paid' => (float) $row->total_paid,
                'outstanding' => (float) $row->total_revenue - (float) $row->total_paid,
                'invoice_count' => $row->invoice_count,
            ])
            ->toArray();
    }

    /**
     * Monthly revenue trend for last N months.
     */
    public function monthlyTrend(int $months = 6): array
    {
        $result = [];

        for ($i = $months - 1; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $m = $date->month;
            $y = $date->year;
            $startDate = sprintf('%04d-%02d-01', $y, $m);
            $endDate = date('Y-m-t', strtotime($startDate));

            $revenue = Invoice::whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
                ->whereIn('status', ['sent', 'partially_paid', 'paid'])
                ->sum('total_amount');

            $workerCost = PayrollRecord::where('period_start', '>=', $startDate)
                ->where('period_end', '<=', $endDate)
                ->sum('net_amount');

            $result[] = [
                'month' => $m,
                'year' => $y,
                'label' => sprintf('T%02d/%d', $m, $y),
                'revenue' => (float) $revenue,
                'cost' => (float) $workerCost,
                'profit' => (float) $revenue - (float) $workerCost,
            ];
        }

        return $result;
    }

    /**
     * Payroll summary for staff (for accountant view).
     */
    public function staffPayrollSummary(int $month, int $year): array
    {
        $payrolls = StaffPayroll::with('user')
            ->forPeriod($month, $year)
            ->get();

        return [
            'period' => ['month' => $month, 'year' => $year],
            'total_staff' => $payrolls->count(),
            'total_gross' => (float) $payrolls->sum('gross_amount'),
            'total_insurance' => (float) $payrolls->sum('insurance_amount'),
            'total_tax' => (float) $payrolls->sum('tax_amount'),
            'total_net' => (float) $payrolls->sum('net_amount'),
            'by_status' => [
                'draft' => $payrolls->where('status', 'draft')->count(),
                'reviewed' => $payrolls->where('status', 'reviewed')->count(),
                'approved' => $payrolls->where('status', 'approved')->count(),
                'paid' => $payrolls->where('status', 'paid')->count(),
            ],
        ];
    }
}
