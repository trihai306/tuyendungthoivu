<?php

namespace App\Policies;

use App\Models\Payroll;
use App\Models\User;

class PayrollPolicy
{
    /**
     * Determine whether the user can view any payroll records.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('payroll.view');
    }

    /**
     * Determine whether the user can calculate payroll.
     */
    public function calculate(User $user): bool
    {
        return $user->hasPermission('payroll.calculate');
    }

    /**
     * Determine whether the user can approve payroll.
     */
    public function approve(User $user, Payroll $payroll): bool
    {
        return $user->hasPermission('payroll.approve');
    }

    /**
     * Determine whether the user can mark payroll as paid.
     */
    public function pay(User $user, Payroll $payroll): bool
    {
        return $user->hasPermission('payroll.pay');
    }
}
