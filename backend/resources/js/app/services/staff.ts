import { apiClient } from "./api";
import { createCrudService } from "./base.service";
import type {
  CreateStaffRequest,
  SingleResponse,
  Staff,
  StaffFilter,
  UpdateStaffRequest,
} from "@/types";

const crud = createCrudService<Staff, CreateStaffRequest, UpdateStaffRequest, StaffFilter>(
  "/staff",
);

export const staffApi = {
  ...crud,

  /** Toggle active/inactive status */
  toggleActive: (id: string) =>
    apiClient
      .patch<SingleResponse<Staff>>(`/staff/${id}/toggle-active`)
      .then((r) => r.data.data),
};
