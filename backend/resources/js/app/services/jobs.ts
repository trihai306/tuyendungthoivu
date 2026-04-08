import { apiClient } from "./api";
import type {
  CreateJobPostRequest,
  JobFilter,
  JobPost,
  PaginatedResponse,
  UpdateJobPostRequest,
} from "@/types";

export const jobsApi = {
  getJobs: (params?: JobFilter) =>
    apiClient
      .get<PaginatedResponse<JobPost>>("/job-posts", { params })
      .then((r) => r.data),

  getJob: (id: string) =>
    apiClient.get<{ data: JobPost }>(`/job-posts/${id}`).then((r) => r.data.data),

  createJob: (data: CreateJobPostRequest) =>
    apiClient.post<{ data: JobPost }>("/job-posts", data).then((r) => r.data.data),

  updateJob: (id: string, data: UpdateJobPostRequest) =>
    apiClient
      .put<{ data: JobPost }>(`/job-posts/${id}`, data)
      .then((r) => r.data.data),

  deleteJob: (id: string) =>
    apiClient.delete<{ message: string }>(`/job-posts/${id}`).then((r) => r.data),
};
