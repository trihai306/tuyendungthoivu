import { useAuthStore } from "@/stores/auth-store"
import { hasPermission } from "@/types/user"

/**
 * Hook returning a permission checker bound to the current user.
 * Usage: const can = usePermissions(); can("orders.create")
 */
export function usePermissions() {
  const user = useAuthStore((s) => s.user)
  return (permission: string) => hasPermission(user, permission)
}
