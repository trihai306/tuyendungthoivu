<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApplicationRequest;
use App\Http\Requests\UpdateApplicationStatusRequest;
use App\Http\Resources\ApplicationResource;
use App\Models\Application;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $query = Application::with(['jobPost.employer', 'workerProfile']);

        if ($request->filled('job_post_id')) {
            $query->where('job_post_id', $request->job_post_id);
        }

        if ($request->filled('worker_profile_id')) {
            $query->where('worker_profile_id', $request->worker_profile_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $applications = $query->latest()->paginate($request->get('per_page', 15));

        return ApplicationResource::collection($applications);
    }

    public function store(StoreApplicationRequest $request)
    {
        $workerProfile = $request->user()->workerProfile;

        if (!$workerProfile) {
            return response()->json(['message' => 'Worker profile not found. Please create your profile first.'], 403);
        }

        $existing = Application::where('job_post_id', $request->job_post_id)
            ->where('worker_profile_id', $workerProfile->id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You have already applied to this job.'], 422);
        }

        $application = Application::create([
            'job_post_id' => $request->job_post_id,
            'worker_profile_id' => $workerProfile->id,
            'cover_letter' => $request->cover_letter,
            'status' => 'new',
            'applied_at' => now(),
        ]);

        return new ApplicationResource($application->load(['jobPost', 'workerProfile']));
    }

    public function show(string $id)
    {
        $application = Application::with(['jobPost.employer', 'workerProfile', 'interviews'])->findOrFail($id);

        return new ApplicationResource($application);
    }

    public function updateStatus(UpdateApplicationStatusRequest $request, string $id)
    {
        $application = Application::findOrFail($id);
        $application->update([
            'status' => $request->status,
            'notes' => $request->notes ?? $application->notes,
        ]);

        return new ApplicationResource($application->load(['jobPost', 'workerProfile']));
    }
}
