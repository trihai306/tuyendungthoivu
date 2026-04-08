import { createCrudService } from "./base.service";
import { apiClient } from "./api";
import type {
  WorkerNew,
  CreateWorkerNewDto,
  UpdateWorkerNewDto,
  QueryParams,
  SingleResponse,
} from "@/types";

// ---------------------------------------------------------------------------
// Filter type
// ---------------------------------------------------------------------------

interface WorkerNewFilter extends QueryParams {
  status?: string;
  city?: string;
  gender?: string;
  skill?: string;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

const crud = createCrudService<
  WorkerNew,
  CreateWorkerNewDto,
  UpdateWorkerNewDto,
  WorkerNewFilter
>("/workers-new");

export const workersNewApi = {
  ...crud,

  /** Update worker status (available / assigned / inactive / blacklisted) */
  updateStatus: (id: string, data: { status: string; reason?: string }) =>
    apiClient
      .patch<SingleResponse<WorkerNew>>(`/workers-new/${id}/status`, data)
      .then((r) => r.data.data),

  /** Assign a staff member to manage this worker */
  assignStaff: (id: string, data: { staff_id: string }) =>
    apiClient
      .post<SingleResponse<WorkerNew>>(`/workers-new/${id}/assign-staff`, data)
      .then((r) => r.data.data),
};

export type { WorkerNewFilter };
