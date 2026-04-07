import { apiClient } from "./api";
import type {
  EmployerProfile,
  PaginatedResponse,
  UpdateEmployerProfileRequest,
  UpdateWorkerProfileRequest,
  WorkerProfile,
} from "@/types";

export const usersApi = {
  getWorkers: (params?: Record<string, unknown>) =>
    apiClient
      .get<PaginatedResponse<WorkerProfile>>("/workers", { params })
      .then((r) => r.data),

  getWorker: (id: string) =>
    apiClient
      .get<{ data: WorkerProfile }>(`/workers/${id}`)
      .then((r) => r.data.data),

  getEmployers: (params?: Record<string, unknown>) =>
    apiClient
      .get<PaginatedResponse<EmployerProfile>>("/employers", { params })
      .then((r) => r.data),

  getEmployer: (id: string) =>
    apiClient
      .get<{ data: EmployerProfile }>(`/employers/${id}`)
      .then((r) => r.data.data),

  updateWorkerProfile: (id: string, data: UpdateWorkerProfileRequest) =>
    apiClient
      .put<{ data: WorkerProfile }>(`/workers/${id}`, data)
      .then((r) => r.data.data),

  updateEmployerProfile: (id: string, data: UpdateEmployerProfileRequest) =>
    apiClient
      .put<{ data: EmployerProfile }>(`/employers/${id}`, data)
      .then((r) => r.data.data),
};
