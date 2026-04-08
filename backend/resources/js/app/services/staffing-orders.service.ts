import { createCrudService } from "./base.service";
import { apiClient } from "./api";
import type {
  StaffingOrder,
  CreateStaffingOrderDto,
  UpdateStaffingOrderDto,
  QueryParams,
  SingleResponse,
} from "@/types";

// ---------------------------------------------------------------------------
// Filter type
// ---------------------------------------------------------------------------

interface StaffingOrderFilter extends QueryParams {
  status?: string;
  client_id?: string;
  urgency?: string;
  assigned_recruiter_id?: string;
  start_date_from?: string;
  start_date_to?: string;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

const crud = createCrudService<
  StaffingOrder,
  CreateStaffingOrderDto,
  UpdateStaffingOrderDto,
  StaffingOrderFilter
>("/staffing-orders");

export const staffingOrdersApi = {
  ...crud,

  /** Approve a pending order */
  approve: (id: string) =>
    apiClient
      .post<SingleResponse<StaffingOrder>>(`/staffing-orders/${id}/approve`)
      .then((r) => r.data.data),

  /** Assign a recruiter to the order */
  assign: (id: string, data: { user_id: string }) =>
    apiClient
      .post<SingleResponse<StaffingOrder>>(`/staffing-orders/${id}/assign`, data)
      .then((r) => r.data.data),

  /** Update order status */
  updateStatus: (id: string, data: { status: string; reason?: string }) =>
    apiClient
      .patch<SingleResponse<StaffingOrder>>(`/staffing-orders/${id}/status`, data)
      .then((r) => r.data.data),
};

export type { StaffingOrderFilter };
