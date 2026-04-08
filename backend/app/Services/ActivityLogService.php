<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ActivityLogService
{
    /**
     * Log an activity.
     */
    public function log(
        ?string $userId,
        string $action,
        ?string $description = null,
        ?Model $loggable = null,
        ?array $metadata = null,
        ?string $ipAddress = null
    ): ActivityLog {
        return ActivityLog::create([
            'user_id' => $userId,
            'action' => $action,
            'description' => $description,
            'loggable_type' => $loggable ? get_class($loggable) : null,
            'loggable_id' => $loggable?->getKey(),
            'metadata' => $metadata,
            'ip_address' => $ipAddress,
        ]);
    }

    /**
     * Log activity from a request context.
     */
    public function logFromRequest(
        Request $request,
        string $action,
        ?string $description = null,
        ?Model $loggable = null,
        ?array $metadata = null
    ): ActivityLog {
        return $this->log(
            userId: $request->user()?->id,
            action: $action,
            description: $description,
            loggable: $loggable,
            metadata: $metadata,
            ipAddress: $request->ip(),
        );
    }

    /**
     * List activity logs with optional filters.
     */
    public function list(array $filters): LengthAwarePaginator
    {
        $query = ActivityLog::with('user')->latest();

        if (!empty($filters['user_id'])) {
            $query->byUser($filters['user_id']);
        }

        if (!empty($filters['action'])) {
            $query->byAction($filters['action']);
        }

        if (!empty($filters['loggable_type'])) {
            $query->byLoggableType($filters['loggable_type']);
        }

        if (!empty($filters['from']) && !empty($filters['to'])) {
            $query->dateRange($filters['from'], $filters['to']);
        }

        if (!empty($filters['search'])) {
            $query->where('description', 'ilike', '%' . $filters['search'] . '%');
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }
}
