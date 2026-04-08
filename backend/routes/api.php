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
use App\Http\Controllers\Api\V1\TeamController;

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
    });
});
