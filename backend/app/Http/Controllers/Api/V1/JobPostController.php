<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreJobPostRequest;
use App\Http\Resources\JobPostResource;
use App\Models\JobPost;
use Illuminate\Http\Request;

class JobPostController extends Controller
{
    public function index(Request $request)
    {
        $query = JobPost::with('employer');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('job_type')) {
            $query->where('job_type', $request->job_type);
        }

        if ($request->filled('region_id')) {
            $query->where('region_id', $request->region_id);
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $jobPosts = $query->latest()->paginate($request->get('per_page', 15));

        return JobPostResource::collection($jobPosts);
    }

    public function show($id)
    {
        $jobPost = JobPost::with('employer')->findOrFail($id);
        $jobPost->increment('view_count');

        return new JobPostResource($jobPost);
    }

    public function store(StoreJobPostRequest $request)
    {
        $employer = $request->user()->employer;

        if (!$employer) {
            return response()->json(['message' => 'Employer profile not found'], 403);
        }

        $jobPost = $employer->jobPosts()->create($request->validated());

        return new JobPostResource($jobPost->load('employer'));
    }

    public function update(Request $request, $id)
    {
        $jobPost = JobPost::findOrFail($id);

        $jobPost->update($request->only([
            'title', 'description', 'requirements', 'benefits', 'job_type',
            'positions_count', 'salary_type', 'salary_amount', 'shift_type',
            'work_start_date', 'work_end_date', 'work_address', 'latitude',
            'longitude', 'region_id', 'has_housing', 'min_age', 'max_age',
            'gender_req', 'deadline', 'status',
        ]));

        return new JobPostResource($jobPost->load('employer'));
    }

    public function destroy($id)
    {
        $jobPost = JobPost::findOrFail($id);
        $jobPost->delete();

        return response()->json(['message' => 'Job post deleted successfully']);
    }
}
