import { apiClient } from "./api";
import { createCrudService } from "./base.service";
import type {
  Application,
  ApplicationFilter,
  CreateApplicationRequest,
  MessageResponse,
  PaginatedResponse,
  SingleResponse,
  UpdateApplicationStatusRequest,
} from "@/types";

const crud = createCrudService<
  Application,
  CreateApplicationRequest,
  Partial<Application>,
  ApplicationFilter
>("/applications");

export const applicationsApi = {
  ...crud,

  // ----- Legacy aliases -----
  getApplications: crud.list,
  createApplication: crud.create,

  /** Get current worker's own applications */
  getMyApplications: (params?: ApplicationFilter) =>
    apiClient
      .get<PaginatedResponse<Application>>("/my-applications", { params })
      .then((r) => r.data),

  /** Update application status (accept, reject, shortlist, etc.) */
  updateApplicationStatus: (id: string, data: UpdateApplicationStatusRequest) =>
    apiClient
      .patch<SingleResponse<Application>>(`/applications/${id}/status`, data)
      .then((r) => r.data.data),

  /** Bulk update application statuses */
  bulkUpdateStatus: (ids: string[], status: string, notes?: string) =>
    apiClient
      .post<MessageResponse>("/applications/bulk-status", { ids, status, notes })
      .then((r) => r.data),
};
