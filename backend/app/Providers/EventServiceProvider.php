<?php

namespace App\Providers;

use App\Events\AttendanceRecorded;
use App\Events\InvoiceGenerated;
use App\Events\PaymentReceived;
use App\Events\PayrollCalculated;
use App\Events\StaffingOrderApproved;
use App\Events\StaffingOrderCreated;
use App\Events\WorkerAssigned;
use App\Events\WorkerUnassigned;
use App\Listeners\LogActivity;
use App\Listeners\RecalculateWorkerRating;
use App\Listeners\SendOrderNotification;
use App\Listeners\UpdateOrderProgress;
use App\Listeners\UpdateWorkerStatus;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        // -- Staffing Order Events ------------------------------------------
        StaffingOrderCreated::class => [
            SendOrderNotification::class,
            LogActivity::class,
        ],
        StaffingOrderApproved::class => [
            SendOrderNotification::class,
            LogActivity::class,
        ],

        // -- Worker Assignment Events ---------------------------------------
        WorkerAssigned::class => [
            UpdateWorkerStatus::class,
            UpdateOrderProgress::class,
        ],
        WorkerUnassigned::class => [
            UpdateWorkerStatus::class,
            UpdateOrderProgress::class,
        ],

        // -- Attendance Events ----------------------------------------------
        AttendanceRecorded::class => [
            LogActivity::class,
        ],

        // -- Payroll Events -------------------------------------------------
        PayrollCalculated::class => [
            LogActivity::class,
        ],

        // -- Invoice Events -------------------------------------------------
        InvoiceGenerated::class => [
            LogActivity::class,
        ],

        // -- Payment Events -------------------------------------------------
        PaymentReceived::class => [
            LogActivity::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        parent::boot();
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
