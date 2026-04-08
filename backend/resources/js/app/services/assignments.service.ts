import { createCrudService } from "./base.service";
import { apiClient } from "./api";
import type {
  Assignment,
  CreateAssignmentDto,
  UpdateAssignmentDto,
  BulkAssignDto,
  QueryParams,
  SingleResponse,
  MessageResponse,
} from "@/types";

// ---------------------------------------------------------------------------
// Filter type
// ---------------------------------------------------------------------------

interface AssignmentFilter extends QueryParams {
  order_id?: string;
  worker_id?: string;
  status?: string;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

const crud = createCrudService<
  Assignment,
  CreateAssignmentDto,
  UpdateAssignmentDto,
  AssignmentFilter
>("/assignments");

export const assignmentsApi = {
  ...crud,

  /** Update assignment status */
  updateStatus: (id: string, data: { status: string; reason?: string }) =>
    apiClient
      .patch<SingleResponse<Assignment>>(`/assignments/${id}/status`, data)
      .then((r) => r.data.data),

  /** Bulk assign multiple workers to an order */
  bulkAssign: (data: BulkAssignDto) =>
    apiClient
      .post<{ data: Assignment[]; message: string }>("/assignments/bulk", data)
      .then((r) => r.data),

  /** Remove a worker from an assignment (soft delete / deactivate) */
  removeWorker: (id: string) =>
    apiClient
      .delete<MessageResponse>(`/assignments/${id}/remove`)
      .then((r) => r.data),
};

export type { AssignmentFilter };
