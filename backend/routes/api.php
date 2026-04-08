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
        Route::apiResource('clients', ClientController::class);

        // ── Staffing Orders ─────────────────────────────────────────
        Route::apiResource('staffing-orders', StaffingOrderController::class);
        Route::post('staffing-orders/{order}/approve', [StaffingOrderController::class, 'approve']);
        Route::post('staffing-orders/{order}/assign', [StaffingOrderController::class, 'assign']);
        Route::patch('staffing-orders/{order}/status', [StaffingOrderController::class, 'updateStatus']);

        // ── Workers (new staffing system) ───────────────────────────
        Route::apiResource('workers-new', WorkerController::class);
        Route::patch('workers-new/{worker}/status', [WorkerController::class, 'updateStatus']);
        Route::post('workers-new/{worker}/assign-staff', [WorkerController::class, 'assignStaff']);

        // ── Assignments ─────────────────────────────────────────────
        Route::apiResource('assignments', AssignmentController::class)->except(['edit']);
        Route::patch('assignments/{assignment}/status', [AssignmentController::class, 'updateStatus']);
        Route::post('assignments/bulk', [AssignmentController::class, 'bulkAssign']);
        Route::delete('assignments/{assignment}/remove', [AssignmentController::class, 'remove']);

        // ===== FINANCE & OPERATIONS MODULE ROUTES =====

        // ── Attendance (new) ────────────────────────────────────────
        Route::prefix('attendances-new')->group(function () {
            Route::get('/', [AttendanceNewController::class, 'index']);
            Route::post('/check-in', [AttendanceNewController::class, 'checkIn']);
            Route::post('/check-out', [AttendanceNewController::class, 'checkOut']);
            Route::post('/bulk-check-in', [AttendanceNewController::class, 'bulkCheckIn']);
            Route::get('/daily-report/{orderId}', [AttendanceNewController::class, 'dailyReport']);
            Route::get('/weekly-report', [AttendanceNewController::class, 'weeklyReport']);
            Route::get('/monthly-report/{workerId}', [AttendanceNewController::class, 'monthlyReport']);
        });

        // ── Payroll (new) ───────────────────────────────────────────
        Route::prefix('payrolls-new')->group(function () {
            Route::get('/', [PayrollNewController::class, 'index']);
            Route::get('/export', [PayrollNewController::class, 'export']);
            Route::get('/{payroll}', [PayrollNewController::class, 'show']);
            Route::post('/calculate', [PayrollNewController::class, 'calculate']);
            Route::post('/bulk-calculate', [PayrollNewController::class, 'bulkCalculate']);
            Route::post('/{payroll}/approve', [PayrollNewController::class, 'approve']);
            Route::post('/{payroll}/pay', [PayrollNewController::class, 'markPaid']);
            Route::post('/bulk-pay', [PayrollNewController::class, 'bulkPay']);
        });

        // ── Invoices (new) ──────────────────────────────────────────
        Route::apiResource('invoices-new', InvoiceNewController::class);
        Route::post('invoices-new/{invoice}/send', [InvoiceNewController::class, 'send']);
        Route::post('invoices-new/{invoice}/payment', [InvoiceNewController::class, 'recordPayment']);
        Route::post('invoices-new/{invoice}/duplicate', [InvoiceNewController::class, 'duplicate']);

        // ── Payments ────────────────────────────────────────────────
        Route::apiResource('payments', PaymentController::class)->only(['index', 'store']);

        // ── Dashboard (new stats) ───────────────────────────────────
        Route::get('dashboard-new/stats', [DashboardNewController::class, 'stats']);
    });
});
