<?php

namespace App\Providers;

use App\Models\Assignment;
use App\Models\AttendanceRecord;
use App\Models\PersonalAccessToken;
use App\Models\StaffingOrder;
use App\Observers\AttendanceRecordObserver;
use App\Observers\StaffingOrderObserver;
use App\Observers\WorkerAssignmentObserver;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);

        // Register Observers
        StaffingOrder::observe(StaffingOrderObserver::class);
        Assignment::observe(WorkerAssignmentObserver::class);
        AttendanceRecord::observe(AttendanceRecordObserver::class);
    }
}
