<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a paginated list of clients.
     * Supports filtering by status, industry, city, and search.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Client::query()
            ->withCount(['staffingOrders', 'contracts']);

        // Search by company_name, contact_name, contact_phone
        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by industry
        if ($request->filled('industry')) {
            $query->where('industry', $request->input('industry'));
        }

        // Filter by city
        if ($request->filled('city')) {
            $query->where('city', $request->input('city'));
        }

        // Filter by company_size
        if ($request->filled('company_size')) {
            $query->where('company_size', $request->input('company_size'));
        }

        // Sorting
        $sortField = $request->input('sort', '-created_at');
        $sortDirection = 'asc';
        if (str_starts_with($sortField, '-')) {
            $sortDirection = 'desc';
            $sortField = ltrim($sortField, '-');
        }

        $allowedSorts = ['company_name', 'created_at', 'status', 'city', 'industry'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->latest();
        }

        $perPage = min($request->integer('per_page', 20), 100);
        $clients = $query->paginate($perPage);

        return ClientResource::collection($clients)
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Display the specified client with related data.
     */
    public function show(string $client): JsonResponse
    {
        $client = Client::with(['createdBy', 'contracts', 'staffingOrders'])
            ->withCount(['staffingOrders', 'contracts'])
            ->findOrFail($client);

        return response()->json([
            'data' => new ClientResource($client),
            'message' => 'Chi tiet khach hang',
        ]);
    }

    /**
     * Store a newly created client.
     */
    public function store(StoreClientRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['created_by'] = $request->user()->id;

        $client = Client::create($data);

        return response()->json([
            'data' => new ClientResource($client),
            'message' => 'Tao khach hang thanh cong',
        ], 201);
    }

    /**
     * Update the specified client.
     */
    public function update(UpdateClientRequest $request, string $client): JsonResponse
    {
        $client = Client::findOrFail($client);

        $client->update($request->validated());

        return response()->json([
            'data' => new ClientResource($client->fresh()),
            'message' => 'Cap nhat khach hang thanh cong',
        ]);
    }

    /**
     * Soft delete the specified client.
     */
    public function destroy(string $client): JsonResponse
    {
        $client = Client::findOrFail($client);

        // Prevent deletion if client has active orders
        $activeOrdersCount = $client->staffingOrders()
            ->whereNotIn('status', ['completed', 'cancelled'])
            ->count();

        if ($activeOrdersCount > 0) {
            return response()->json([
                'message' => 'Khong the xoa khach hang dang co don hang hoat dong.',
            ], 422);
        }

        $client->delete();

        return response()->json([
            'message' => 'Xoa khach hang thanh cong',
        ]);
    }
}
