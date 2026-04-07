<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWorkerProfileRequest;
use App\Http\Resources\WorkerProfileResource;
use App\Models\WorkerProfile;
use Illuminate\Http\Request;

class WorkerProfileController extends Controller
{
    public function index(Request $request)
    {
        $query = WorkerProfile::with(['user', 'skills']);

        if ($request->filled('search')) {
            $query->where('full_name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('needs_housing')) {
            $query->where('needs_housing', $request->boolean('needs_housing'));
        }

        if ($request->filled('ekyc_status')) {
            $query->where('ekyc_status', $request->ekyc_status);
        }

        $profiles = $query->latest()->paginate($request->get('per_page', 15));

        return WorkerProfileResource::collection($profiles);
    }

    public function store(StoreWorkerProfileRequest $request)
    {
        $existing = WorkerProfile::where('user_id', $request->user()->id)->first();
        if ($existing) {
            return response()->json(['message' => 'You already have a worker profile.'], 422);
        }

        $profile = WorkerProfile::create(array_merge(
            $request->validated(),
            ['user_id' => $request->user()->id]
        ));

        return new WorkerProfileResource($profile->load(['user', 'skills']));
    }

    public function show(string $id)
    {
        $profile = WorkerProfile::with(['user', 'skills', 'applications.jobPost'])->findOrFail($id);

        return new WorkerProfileResource($profile);
    }

    public function update(StoreWorkerProfileRequest $request, string $id)
    {
        $profile = WorkerProfile::findOrFail($id);

        $profile->update($request->validated());

        return new WorkerProfileResource($profile->load(['user', 'skills']));
    }

    public function destroy(string $id)
    {
        $profile = WorkerProfile::findOrFail($id);
        $profile->delete();

        return response()->json(['message' => 'Worker profile deleted successfully']);
    }
}
