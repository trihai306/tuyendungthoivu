import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCrudHooks } from "./use-crud";
import {
  rolesApi,
  type CreateRoleRequest,
  type RoleFilter,
  type UpdateRoleRequest,
} from "@/services/roles";
import type { ApiError, Permission, Role } from "@/types";

// ---------------------------------------------------------------------------
// Base CRUD hooks via factory
// ---------------------------------------------------------------------------

const roleHooks = createCrudHooks<Role, CreateRoleRequest, UpdateRoleRequest, RoleFilter>(
  "roles",
  rolesApi,
  {
    messages: {
      createSuccess: "Tao vai tro thanh cong!",
      createError: "Khong the tao vai tro. Vui long thu lai.",
      updateSuccess: "Cap nhat vai tro thanh cong!",
      updateError: "Khong the cap nhat vai tro. Vui long thu lai.",
      deleteSuccess: "Da xoa vai tro.",
      deleteError: "Khong the xoa vai tro. Vui long thu lai.",
    },
  },
);

export const useRoles = roleHooks.useList;
export const useRole = roleHooks.useDetail;
export const useCreateRole = roleHooks.useCreate;
export const useUpdateRole = roleHooks.useUpdate;
export const useDeleteRole = roleHooks.useDelete;

// ---------------------------------------------------------------------------
// Extended hooks
// ---------------------------------------------------------------------------

export function usePermissions() {
  return useQuery<Permission[], ApiError>({
    queryKey: ["permissions"],
    queryFn: () => rolesApi.permissions(),
  });
}

export function useSyncPermissions() {
  const queryClient = useQueryClient();
  return useMutation<Role, ApiError, { roleId: string; permissionIds: string[] }>({
    mutationFn: ({ roleId, permissionIds }) =>
      rolesApi.syncPermissions(roleId, permissionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleHooks.queryKey });
      toast.success("Cap nhat quyen thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the cap nhat quyen.");
    },
  });
}

export { roleHooks };
