<?php

namespace App\Actions\Payroll;

use App\Models\User;
use App\Models\Worker;
use Illuminate\Support\Collection;

class BulkCalculatePayroll
{
    public function __construct(
        private readonly CalculatePayroll $calculatePayroll
    ) {}

    /**
     * Calculate payroll for all active workers in a given period.
     * Returns a collection of Payroll records.
     *
     * @param  array<string, mixed>  $config  Default configuration for all calculations.
     * @return \Illuminate\Support\Collection<int, \App\Models\Payroll>
     */
    public function execute(
        string $periodStart,
        string $periodEnd,
        User $calculatedBy,
        array $config = []
    ): Collection {
        $workers = Worker::whereHas('assignments', function ($query) use ($periodStart, $periodEnd) {
            $query->where('started_at', '<=', $periodEnd)
                  ->where(function ($q) use ($periodStart) {
                      $q->whereNull('completed_at')
                        ->orWhere('completed_at', '>=', $periodStart);
                  });
        })->get();

        $payrolls = collect();

        foreach ($workers as $worker) {
            $payroll = $this->calculatePayroll->execute(
                $worker,
                $periodStart,
                $periodEnd,
                $calculatedBy,
                $config
            );
            $payrolls->push($payroll);
        }

        return $payrolls;
    }
}
