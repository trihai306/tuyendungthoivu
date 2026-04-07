<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $query = Room::with(['dormitory', 'beds']);

        if ($request->filled('dormitory_id')) {
            $query->where('dormitory_id', $request->dormitory_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('room_type')) {
            $query->where('room_type', $request->room_type);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        $rooms = $query->paginate($request->get('per_page', 15));

        return RoomResource::collection($rooms);
    }

    public function show(string $id)
    {
        $room = Room::with(['dormitory', 'beds'])->findOrFail($id);

        return new RoomResource($room);
    }

    public function store(StoreRoomRequest $request)
    {
        $room = Room::create($request->validated());

        return new RoomResource($room->load(['dormitory', 'beds']));
    }

    public function update(StoreRoomRequest $request, string $id)
    {
        $room = Room::findOrFail($id);
        $room->update($request->validated());

        return new RoomResource($room->load(['dormitory', 'beds']));
    }

    public function destroy(string $id)
    {
        $room = Room::findOrFail($id);
        $room->delete();

        return response()->json(['message' => 'Room deleted successfully']);
    }
}
