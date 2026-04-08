<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * Accepts one or more role names separated by '|' (OR logic),
     * or a minimum level with 'level:N' syntax.
     *
     * Examples:
     *   ->middleware('role:admin|super_admin')
     *   ->middleware('role:level:50')  // User must have a role with level >= 50
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Chưa xác thực. Vui lòng đăng nhập.',
            ], 401);
        }

        // Parse all arguments for pipe-separated values
        $allRoles = [];
        foreach ($roles as $role) {
            $allRoles = array_merge($allRoles, explode('|', $role));
        }

        // Check for level-based authorization
        foreach ($allRoles as $role) {
            if (str_starts_with($role, 'level:')) {
                $requiredLevel = (int) substr($role, 6);
                if ($user->highest_role_level >= $requiredLevel) {
                    return $next($request);
                }
            }
        }

        // Check for name-based role authorization
        $roleNames = array_filter($allRoles, fn ($r) => !str_starts_with($r, 'level:'));
        if (!empty($roleNames) && $user->hasAnyRole($roleNames)) {
            return $next($request);
        }

        return response()->json([
            'message' => 'Bạn không có vai trò phù hợp để thực hiện hành động này.',
        ], 403);
    }
}
