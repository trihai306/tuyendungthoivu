<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmployerRequest;
use App\Http\Resources\EmployerResource;
use App\Models\Employer;
use Illuminate\Http\Request;

class EmployerController extends Controller
{
    public function index(Request $request)
    {
        $query = Employer::with('user');

        if ($request->filled('search')) {
            $query->where('company_name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('industry')) {
            $query->where('industry', $request->industry);
        }

        if ($request->filled('verified')) {
            $query->where('verified', $request->boolean('verified'));
        }

        $employers = $query->latest()->paginate($request->get('per_page', 15));

        return EmployerResource::collection($employers);
    }

    public function store(StoreEmployerRequest $request)
    {
        $existing = Employer::where('user_id', $request->user()->id)->first();
        if ($existing) {
            return response()->json(['message' => 'You already have an employer profile.'], 422);
        }

        $employer = Employer::create(array_merge(
            $request->validated(),
            ['user_id' => $request->user()->id]
        ));

        return new EmployerResource($employer->load('user'));
    }

    public function show(string $id)
    {
        $employer = Employer::with(['user', 'jobPosts'])->findOrFail($id);

        return new EmployerResource($employer);
    }

    public function update(StoreEmployerRequest $request, string $id)
    {
        $employer = Employer::findOrFail($id);

        $employer->update($request->validated());

        return new EmployerResource($employer->load('user'));
    }

    public function destroy(string $id)
    {
        $employer = Employer::findOrFail($id);
        $employer->delete();

        return response()->json(['message' => 'Employer deleted successfully']);
    }
}
