<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDormitoryRequest;
use App\Http\Resources\DormitoryResource;
use App\Models\Dormitory;
use Illuminate\Http\Request;

class DormitoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Dormitory::with('rooms');

        if ($request->filled('region_id')) {
            $query->where('region_id', $request->region_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('has_wifi')) {
            $query->where('has_wifi', $request->boolean('has_wifi'));
        }

        if ($request->filled('has_ac')) {
            $query->where('has_ac', $request->boolean('has_ac'));
        }

        if ($request->filled('max_price')) {
            $query->where('deposit_amount', '<=', $request->max_price);
        }

        $dormitories = $query->latest()->paginate($request->get('per_page', 15));

        return DormitoryResource::collection($dormitories);
    }

    public function show(string $id)
    {
        $dormitory = Dormitory::with(['rooms.beds', 'region', 'landlord'])->findOrFail($id);

        return new DormitoryResource($dormitory);
    }

    public function store(StoreDormitoryRequest $request)
    {
        $dormitory = Dormitory::create(array_merge(
            $request->validated(),
            [
                'landlord_id' => $request->user()->id,
                'status' => 'pending',
            ]
        ));

        return new DormitoryResource($dormitory->load('rooms'));
    }

    public function update(StoreDormitoryRequest $request, string $id)
    {
        $dormitory = Dormitory::findOrFail($id);
        $dormitory->update($request->validated());

        return new DormitoryResource($dormitory->load('rooms'));
    }

    public function destroy(string $id)
    {
        $dormitory = Dormitory::findOrFail($id);
        $dormitory->delete();

        return response()->json(['message' => 'Dormitory deleted successfully']);
    }
}
