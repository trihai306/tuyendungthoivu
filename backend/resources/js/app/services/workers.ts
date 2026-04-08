import { apiClient } from "./api";
import { createCrudService } from "./base.service";
import type {
  PaginatedResponse,
  QueryParams,
  UpdateWorkerProfileRequest,
  WorkerProfile,
} from "@/types";

interface WorkerFilter extends QueryParams {
  city?: string;
  skills?: string;
  availability_status?: string;
  experience_years_min?: number;
  experience_years_max?: number;
}

const crud = createCrudService<WorkerProfile, never, UpdateWorkerProfileRequest, WorkerFilter>(
  "/worker-profiles",
);

export const workersApi = {
  ...crud,

  // ----- Legacy aliases -----
  getWorkers: crud.list,
  getWorker: crud.show,
  updateWorkerProfile: crud.update,

  /** Full-text search workers by skills, location, etc. */
  search: (params?: WorkerFilter) =>
    apiClient
      .get<PaginatedResponse<WorkerProfile>>("/workers/search", { params })
      .then((r) => r.data),

  /** Export worker list (returns blob URL or download URL) */
  exportList: (params?: WorkerFilter) =>
    apiClient
      .get<Blob>("/workers/export", { params, responseType: "blob" })
      .then((r) => r.data),
};

export type { WorkerFilter };
