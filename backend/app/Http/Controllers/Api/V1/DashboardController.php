<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Dormitory;
use App\Models\Employer;
use App\Models\JobPost;
use App\Models\Room;
use App\Models\User;
use App\Models\WorkerProfile;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_users' => User::count(),
            'workers' => WorkerProfile::count(),
            'employers' => Employer::count(),
            'job_posts' => JobPost::count(),
            'active_job_posts' => JobPost::where('status', 'published')->count(),
            'applications' => Application::count(),
            'dormitories' => Dormitory::count(),
            'available_rooms' => Room::where('status', 'available')->count(),
            'applications_by_status' => Application::selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status'),
            'job_posts_by_type' => JobPost::selectRaw('job_type, count(*) as count')
                ->groupBy('job_type')
                ->pluck('count', 'job_type'),
        ]);
    }
}
