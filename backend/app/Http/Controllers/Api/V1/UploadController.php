<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    /**
     * Upload a file and return the public URL.
     *
     * Accepted folders: avatars, id-cards, documents
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'max:5120', 'mimes:jpg,jpeg,png,webp,pdf'],
            'folder' => ['sometimes', 'string', 'in:avatars,id-cards,documents'],
        ]);

        $folder = $request->input('folder', 'uploads');
        $file = $request->file('file');

        $filename = Str::ulid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs($folder, $filename, 'public');

        return response()->json([
            'url' => Storage::disk('public')->url($path),
            'path' => $path,
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
        ]);
    }

    /**
     * Delete a previously uploaded file.
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->validate([
            'path' => ['required', 'string'],
        ]);

        $path = $request->input('path');

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        return response()->json(['message' => 'File deleted.']);
    }
}
