import { apiClient } from "./api";
import { createCrudService } from "./base.service";
import type {
  Permission,
  QueryParams,
  Role,
  SingleResponse,
} from "@/types";

export interface CreateRoleRequest {
  name: string;
  display_name: string;
  description?: string;
  level?: number;
  permission_ids?: string[];
}

export type UpdateRoleRequest = Partial<CreateRoleRequest>;

export interface RoleFilter extends QueryParams {
  search?: string;
}

const crud = createCrudService<Role, CreateRoleRequest, UpdateRoleRequest, RoleFilter>(
  "/roles",
);

export const rolesApi = {
  ...crud,

  /** Get all available permissions (flattened from grouped response) */
  permissions: () =>
    apiClient
      .get<{ data: { module: string; permissions: Permission[] }[] }>("/permissions")
      .then((r) => {
        // The API returns permissions grouped by module; flatten them
        const groups = r.data.data ?? [];
        return groups.flatMap((g) => g.permissions);
      }),

  /** Sync permissions for a role (replace all) */
  syncPermissions: (roleId: string, permissionIds: string[]) =>
    apiClient
      .put<SingleResponse<Role>>(`/roles/${roleId}/permissions/sync`, {
        permission_ids: permissionIds,
      })
      .then((r) => r.data.data),

  /** Attach permissions to a role */
  attachPermissions: (roleId: string, permissionIds: string[]) =>
    apiClient
      .post<SingleResponse<Role>>(`/roles/${roleId}/permissions/attach`, {
        permission_ids: permissionIds,
      })
      .then((r) => r.data.data),

  /** Detach permissions from a role */
  detachPermissions: (roleId: string, permissionIds: string[]) =>
    apiClient
      .post<SingleResponse<Role>>(`/roles/${roleId}/permissions/detach`, {
        permission_ids: permissionIds,
      })
      .then((r) => r.data.data),
};
