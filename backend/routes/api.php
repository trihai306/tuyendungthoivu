<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\JobPostController;
use App\Http\Controllers\Api\V1\ApplicationController;
use App\Http\Controllers\Api\V1\WorkerProfileController;
use App\Http\Controllers\Api\V1\EmployerController;
use App\Http\Controllers\Api\V1\DormitoryController;
use App\Http\Controllers\Api\V1\RoomController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\NotificationController;

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
    });
});
