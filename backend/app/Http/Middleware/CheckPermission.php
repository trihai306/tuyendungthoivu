<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * Accepts one or more permission names separated by '|' (OR logic).
     * Example usage in route: ->middleware('permission:jobs.create|jobs.update')
     */
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Chưa xác thực. Vui lòng đăng nhập.',
            ], 401);
        }

        // Parse pipe-separated permissions (each argument can contain pipes)
        $allPermissions = [];
        foreach ($permissions as $perm) {
            $allPermissions = array_merge($allPermissions, explode('|', $perm));
        }

        if ($user->hasAnyPermission($allPermissions)) {
            return $next($request);
        }

        return response()->json([
            'message' => 'Bạn không có quyền thực hiện hành động này.',
        ], 403);
    }
}
