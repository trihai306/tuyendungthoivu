<?php

namespace App\Providers;

use App\Models\Assignment;
use App\Models\Attendance;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\Payroll;
use App\Models\StaffingOrder;
use App\Models\Worker;
use App\Policies\AssignmentPolicy;
use App\Policies\AttendancePolicy;
use App\Policies\ClientPolicy;
use App\Policies\InvoicePolicy;
use App\Policies\PayrollPolicy;
use App\Policies\StaffingOrderPolicy;
use App\Policies\WorkerPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Client::class => ClientPolicy::class,
        StaffingOrder::class => StaffingOrderPolicy::class,
        Worker::class => WorkerPolicy::class,
        Assignment::class => AssignmentPolicy::class,
        Attendance::class => AttendancePolicy::class,
        Payroll::class => PayrollPolicy::class,
        Invoice::class => InvoicePolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
