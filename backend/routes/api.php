<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ActivityLogController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DepartmentController;
use App\Http\Controllers\Api\V1\JobPostController;
use App\Http\Controllers\Api\V1\ApplicationController;
use App\Http\Controllers\Api\V1\WorkerProfileController;
use App\Http\Controllers\Api\V1\EmployerController;
use App\Http\Controllers\Api\V1\DormitoryController;
use App\Http\Controllers\Api\V1\RoleController;
use App\Http\Controllers\Api\V1\RoomController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\TaskAssignmentController;
use App\Http\Controllers\Api\V1\StaffController;
use App\Http\Controllers\Api\V1\TeamController;
use App\Http\Controllers\Api\V1\ClientController;
use App\Http\Controllers\Api\V1\StaffingOrderController;
use App\Http\Controllers\Api\V1\WorkerController;
use App\Http\Controllers\Api\V1\AssignmentController;
use App\Http\Controllers\Api\V1\AttendanceNewController;
use App\Http\Controllers\Api\V1\PayrollNewController;
use App\Http\Controllers\Api\V1\InvoiceNewController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\DashboardNewController;
use App\Http\Controllers\Api\V1\KpiController;
use App\Http\Controllers\Api\V1\StaffPayrollController;
use App\Http\Controllers\Api\V1\RevenueReportController;
use App\Http\Controllers\Api\V1\UploadController;

Route::prefix('v1')->group(function () {
    // Auth
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login', [AuthController::class, 'login']);

    // Public
    Route::get('job-posts', [JobPostController::class, 'index']);
    Route::get('job-posts/{id}', [JobPostController::class, 'show']);
    Route::get('dormitories', [DormitoryController::class, 'index']);
    Route::get('dormitories/{id}', [DormitoryController::class, 'show']);

    // Public rooms listing
    Route::get('rooms', [RoomController::class, 'index']);
    Route::get('rooms/{id}', [RoomController::class, 'show']);

    // Protected
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me', [AuthController::class, 'me']);

        // File upload
        Route::post('upload', [UploadController::class, 'store']);
        Route::delete('upload', [UploadController::class, 'destroy']);

        Route::apiResource('worker-profiles', WorkerProfileController::class);
        Route::apiResource('employers', EmployerController::class);

        Route::post('job-posts', [JobPostController::class, 'store']);
        Route::put('job-posts/{id}', [JobPostController::class, 'update']);
        Route::delete('job-posts/{id}', [JobPostController::class, 'destroy']);

        Route::get('applications', [ApplicationController::class, 'index']);
        Route::post('applications', [ApplicationController::class, 'store']);
        Route::get('applications/{id}', [ApplicationController::class, 'show']);
        Route::patch('applications/{id}/status', [ApplicationController::class, 'updateStatus']);

        Route::post('dormitories', [DormitoryController::class, 'store']);
        Route::put('dormitories/{id}', [DormitoryController::class, 'update']);
        Route::delete('dormitories/{id}', [DormitoryController::class, 'destroy']);

        Route::post('rooms', [RoomController::class, 'store']);
        Route::put('rooms/{id}', [RoomController::class, 'update']);
        Route::delete('rooms/{id}', [RoomController::class, 'destroy']);

        Route::get('dashboard/stats', [DashboardController::class, 'stats']);

        Route::get('notifications', [NotificationController::class, 'index']);
        Route::patch('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::patch('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);

        // ── Staff Management ─────────────────────────────────────────
        Route::middleware('permission:users.view')->group(function () {
            Route::get('staff', [StaffController::class, 'index']);
            Route::get('staff/{id}', [StaffController::class, 'show']);
        });

        Route::middleware('permission:users.manage')->group(function () {
            Route::patch('staff/{id}/toggle-active', [StaffController::class, 'toggleActive']);
        });

        // ── RBAC: Roles & Permissions ────────────────────────────────
        Route::middleware('permission:roles.view')->group(function () {
            Route::get('roles', [RoleController::class, 'index']);
            Route::get('roles/{role}', [RoleController::class, 'show']);
            Route::get('permissions', [RoleController::class, 'permissions']);
        });

        Route::middleware('permission:roles.manage')->group(function () {
            Route::post('roles', [RoleController::class, 'store']);
            Route::put('roles/{role}', [RoleController::class, 'update']);
            Route::delete('roles/{role}', [RoleController::class, 'destroy']);
            Route::put('roles/{role}/permissions/sync', [RoleController::class, 'syncPermissions']);
            Route::post('roles/{role}/permissions/attach', [RoleController::class, 'attachPermissions']);
            Route::post('roles/{role}/permissions/detach', [RoleController::class, 'detachPermissions']);
        });

        // ── Departments ──────────────────────────────────────────────
        Route::middleware('permission:departments.view')->group(function () {
            Route::get('departments', [DepartmentController::class, 'index']);
            Route::get('departments/{department}', [DepartmentController::class, 'show']);
        });

        Route::middleware('permission:departments.manage')->group(function () {
            Route::post('departments', [DepartmentController::class, 'store']);
            Route::put('departments/{department}', [DepartmentController::class, 'update']);
            Route::delete('departments/{department}', [DepartmentController::class, 'destroy']);
        });

        // ── Teams ────────────────────────────────────────────────────
        Route::middleware('permission:teams.view')->group(function () {
            Route::get('teams', [TeamController::class, 'index']);
            Route::get('teams/{team}', [TeamController::class, 'show']);
        });

        Route::middleware('permission:teams.manage')->group(function () {
            Route::post('teams', [TeamController::class, 'store']);
            Route::put('teams/{team}', [TeamController::class, 'update']);
            Route::delete('teams/{team}', [TeamController::class, 'destroy']);
            Route::post('teams/{team}/members', [TeamController::class, 'addMember']);
            Route::delete('teams/{team}/members/{userId}', [TeamController::class, 'removeMember']);
        });

        // ── Task Assignments ─────────────────────────────────────────
        Route::middleware('permission:tasks.view')->group(function () {
            Route::get('tasks', [TaskAssignmentController::class, 'index']);
            Route::get('tasks/my-tasks', [TaskAssignmentController::class, 'myTasks']);
            Route::get('tasks/team/{teamId}', [TaskAssignmentController::class, 'teamTasks']);
            Route::get('tasks/{task}', [TaskAssignmentController::class, 'show']);
        });

        Route::middleware('permission:tasks.assign')->group(function () {
            Route::post('tasks', [TaskAssignmentController::class, 'store']);
        });

        Route::middleware('permission:tasks.update')->group(function () {
            Route::patch('tasks/{task}/status', [TaskAssignmentController::class, 'updateStatus']);
            Route::post('tasks/{task}/comments', [TaskAssignmentController::class, 'addComment']);
        });

        // ── Activity Logs ────────────────────────────────────────────
        Route::middleware('permission:activity_logs.view')->group(function () {
            Route::get('activity-logs', [ActivityLogController::class, 'index']);
        });

        // ===== NEW STAFFING SYSTEM ROUTES =====

        // ── Clients ─────────────────────────────────────────────────
        Route::middleware('permission:clients.view')->group(function () {
            Route::get('clients', [ClientController::class, 'index']);
            Route::get('clients/{client}', [ClientController::class, 'show']);
        });
        Route::middleware('permission:clients.create')->post('clients', [ClientController::class, 'store']);
        Route::middleware('permission:clients.update')->put('clients/{client}', [ClientController::class, 'update']);
        Route::middleware('permission:clients.delete')->delete('clients/{client}', [ClientController::class, 'destroy']);

        // ── Staffing Orders ─────────────────────────────────────────
        Route::middleware('permission:orders.view')->group(function () {
            Route::get('staffing-orders', [StaffingOrderController::class, 'index']);
            Route::get('staffing-orders/{staffing_order}', [StaffingOrderController::class, 'show']);
        });
        Route::middleware('permission:orders.create')->post('staffing-orders', [StaffingOrderController::class, 'store']);
        Route::middleware('permission:orders.update')->group(function () {
            Route::put('staffing-orders/{staffing_order}', [StaffingOrderController::class, 'update']);
            Route::patch('staffing-orders/{order}/status', [StaffingOrderController::class, 'updateStatus']);
        });
        Route::middleware('permission:orders.delete')->delete('staffing-orders/{staffing_order}', [StaffingOrderController::class, 'destroy']);
        Route::middleware('permission:orders.approve')->post('staffing-orders/{order}/approve', [StaffingOrderController::class, 'approve']);
        Route::middleware('permission:orders.assign')->post('staffing-orders/{order}/assign', [StaffingOrderController::class, 'assign']);

        // ── Workers (new staffing system) ───────────────────────────
        Route::middleware('permission:workers.view')->group(function () {
            Route::get('workers-new', [WorkerController::class, 'index']);
            Route::get('workers-new/{workers_new}', [WorkerController::class, 'show']);
        });
        Route::middleware('permission:workers.create')->post('workers-new', [WorkerController::class, 'store']);
        Route::middleware('permission:workers.update')->put('workers-new/{workers_new}', [WorkerController::class, 'update']);
        Route::middleware('permission:workers.delete')->delete('workers-new/{workers_new}', [WorkerController::class, 'destroy']);
        Route::middleware('permission:workers.change_status')->patch('workers-new/{worker}/status', [WorkerController::class, 'updateStatus']);
        Route::middleware('permission:workers.assign_staff')->post('workers-new/{worker}/assign-staff', [WorkerController::class, 'assignStaff']);
        Route::middleware('permission:workers.view')->get('workers-new/{worker}/evaluation', [WorkerController::class, 'evaluation']);

        // ── Assignments ─────────────────────────────────────────────
        Route::middleware('permission:assignments.view')->group(function () {
            Route::get('assignments', [AssignmentController::class, 'index']);
            Route::get('assignments/{assignment}', [AssignmentController::class, 'show']);
        });
        Route::middleware('permission:assignments.create')->group(function () {
            Route::post('assignments', [AssignmentController::class, 'store']);
            Route::post('assignments/bulk', [AssignmentController::class, 'bulkAssign']);
        });
        Route::middleware('permission:assignments.update')->patch('assignments/{assignment}/status', [AssignmentController::class, 'updateStatus']);
        Route::middleware('permission:assignments.delete')->delete('assignments/{assignment}/remove', [AssignmentController::class, 'remove']);

        // ===== FINANCE & OPERATIONS MODULE ROUTES =====

        // ── Attendance ──────────────────────────────────────────────
        Route::middleware('permission:attendance.view')->group(function () {
            Route::prefix('attendances-new')->group(function () {
                Route::get('/', [AttendanceNewController::class, 'index']);
                Route::get('/daily-report/{orderId}', [AttendanceNewController::class, 'dailyReport']);
                Route::get('/weekly-report', [AttendanceNewController::class, 'weeklyReport']);
                Route::get('/monthly-report/{workerId}', [AttendanceNewController::class, 'monthlyReport']);
            });
        });
        Route::middleware('permission:attendance.checkin')->group(function () {
            Route::post('attendances-new/check-in', [AttendanceNewController::class, 'checkIn']);
            Route::post('attendances-new/check-out', [AttendanceNewController::class, 'checkOut']);
            Route::post('attendances-new/bulk-check-in', [AttendanceNewController::class, 'bulkCheckIn']);
        });
        Route::middleware('permission:attendance.approve')->group(function () {
            Route::post('attendances-new/{id}/approve', [AttendanceNewController::class, 'approve']);
            Route::post('attendances-new/bulk-approve', [AttendanceNewController::class, 'bulkApprove']);
        });

        // ── Payroll (Workers) ───────────────────────────────────────
        Route::middleware('permission:payroll.view')->group(function () {
            Route::get('payrolls-new', [PayrollNewController::class, 'index']);
            Route::get('payrolls-new/export', [PayrollNewController::class, 'export']);
            Route::get('payrolls-new/{payroll}', [PayrollNewController::class, 'show']);
        });
        Route::middleware('permission:payroll.calculate')->group(function () {
            Route::post('payrolls-new/calculate', [PayrollNewController::class, 'calculate']);
            Route::post('payrolls-new/bulk-calculate', [PayrollNewController::class, 'bulkCalculate']);
            Route::post('payrolls-new/{payroll}/review', [PayrollNewController::class, 'review']);
        });
        Route::middleware('permission:payroll.approve')->post('payrolls-new/{payroll}/approve', [PayrollNewController::class, 'approve']);
        Route::middleware('permission:payroll.pay')->group(function () {
            Route::post('payrolls-new/{payroll}/pay', [PayrollNewController::class, 'markPaid']);
            Route::post('payrolls-new/bulk-pay', [PayrollNewController::class, 'bulkPay']);
        });

        // ── Invoices ────────────────────────────────────────────────
        Route::middleware('permission:invoices.view')->group(function () {
            Route::get('invoices-new', [InvoiceNewController::class, 'index']);
            Route::get('invoices-new/{invoices_new}', [InvoiceNewController::class, 'show']);
        });
        Route::middleware('permission:invoices.create')->group(function () {
            Route::post('invoices-new', [InvoiceNewController::class, 'store']);
            Route::post('invoices-new/{invoice}/duplicate', [InvoiceNewController::class, 'duplicate']);
        });
        Route::middleware('permission:invoices.update')->put('invoices-new/{invoices_new}', [InvoiceNewController::class, 'update']);
        Route::middleware('permission:invoices.send')->post('invoices-new/{invoice}/send', [InvoiceNewController::class, 'send']);
        Route::middleware('permission:invoices.payment')->group(function () {
            Route::post('invoices-new/{invoice}/payment', [InvoiceNewController::class, 'recordPayment']);
            Route::apiResource('payments', PaymentController::class)->only(['index', 'store']);
        });

        // ── Revenue & Reports ───────────────────────────────────────
        Route::middleware('permission:revenue.view')->prefix('revenue')->group(function () {
            Route::get('/overview', [RevenueReportController::class, 'overview']);
            Route::get('/by-client', [RevenueReportController::class, 'byClient']);
            Route::get('/trend', [RevenueReportController::class, 'trend']);
            Route::get('/staff-payroll-summary', [RevenueReportController::class, 'staffPayrollSummary']);
        });

        // ── Dashboard (new stats) ───────────────────────────────────
        Route::get('dashboard-new/stats', [DashboardNewController::class, 'stats']);

        // ── KPI ─────────────────────────────────────────────────────
        Route::middleware('permission:kpi.view')->prefix('kpi')->group(function () {
            Route::get('/periods', [KpiController::class, 'periods']);
            Route::get('/periods/{id}', [KpiController::class, 'showPeriod']);
            Route::get('/records', [KpiController::class, 'records']);
            Route::get('/users/{userId}/summary', [KpiController::class, 'userKpiSummary']);
        });
        Route::middleware('permission:kpi.evaluate')->post('kpi/records/{id}/evaluate', [KpiController::class, 'evaluate']);
        Route::middleware('permission:kpi.config')->prefix('kpi')->group(function () {
            Route::get('/configs', [KpiController::class, 'configs']);
            Route::post('/configs', [KpiController::class, 'storeConfig']);
            Route::put('/configs/{id}', [KpiController::class, 'updateConfig']);
            Route::delete('/configs/{id}', [KpiController::class, 'destroyConfig']);
            Route::post('/periods', [KpiController::class, 'storePeriod']);
            Route::post('/periods/{id}/close', [KpiController::class, 'closePeriod']);
            Route::post('/periods/{id}/auto-calculate', [KpiController::class, 'autoCalculate']);
        });

        // ── Staff Payroll ───────────────────────────────────────────
        Route::middleware('permission:staff_payroll.view')->prefix('staff-payroll')->group(function () {
            Route::get('/salary-configs', [StaffPayrollController::class, 'salaryConfigs']);
            Route::get('/', [StaffPayrollController::class, 'index']);
            Route::get('/{id}', [StaffPayrollController::class, 'show']);
        });
        Route::middleware('permission:staff_payroll.manage')->prefix('staff-payroll')->group(function () {
            Route::post('/salary-configs', [StaffPayrollController::class, 'storeSalaryConfig']);
            Route::put('/salary-configs/{id}', [StaffPayrollController::class, 'updateSalaryConfig']);
            Route::put('/{id}', [StaffPayrollController::class, 'update']);
            Route::post('/calculate', [StaffPayrollController::class, 'calculate']);
            Route::post('/bulk-calculate', [StaffPayrollController::class, 'bulkCalculate']);
            Route::post('/{id}/review', [StaffPayrollController::class, 'review']);
            Route::post('/{id}/approve', [StaffPayrollController::class, 'approve']);
            Route::post('/{id}/pay', [StaffPayrollController::class, 'markPaid']);
            Route::post('/bulk-approve', [StaffPayrollController::class, 'bulkApprove']);
            Route::post('/bulk-pay', [StaffPayrollController::class, 'bulkPay']);
        });
    });
});
