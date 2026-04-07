import { apiClient } from "./api";
import type {
  Application,
  ApplicationFilter,
  CreateApplicationRequest,
  PaginatedResponse,
  UpdateApplicationStatusRequest,
} from "@/types";

export const applicationsApi = {
  getApplications: (params?: ApplicationFilter) =>
    apiClient
      .get<PaginatedResponse<Application>>("/applications", { params })
      .then((r) => r.data),

  getMyApplications: (params?: ApplicationFilter) =>
    apiClient
      .get<PaginatedResponse<Application>>("/my-applications", { params })
      .then((r) => r.data),

  createApplication: (data: CreateApplicationRequest) =>
    apiClient
      .post<{ data: Application }>("/applications", data)
      .then((r) => r.data.data),

  updateApplicationStatus: (id: string, data: UpdateApplicationStatusRequest) =>
    apiClient
      .patch<{ data: Application }>(`/applications/${id}/status`, data)
      .then((r) => r.data.data),
};
