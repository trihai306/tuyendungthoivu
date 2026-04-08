import { apiClient } from "./api";
import { createCrudService } from "./base.service";
import type {
  CreateJobPostRequest,
  JobFilter,
  JobPost,
  MessageResponse,
  SingleResponse,
  UpdateJobPostRequest,
} from "@/types";

const crud = createCrudService<JobPost, CreateJobPostRequest, UpdateJobPostRequest, JobFilter>(
  "/job-posts",
);

export const jobsApi = {
  ...crud,

  // ----- Legacy aliases (keep backward-compat with existing pages) -----
  getJobs: crud.list,
  getJob: crud.show,
  createJob: crud.create,
  updateJob: crud.update,
  deleteJob: crud.remove,

  // ----- Extended methods -----

  /** Change job status (publish, close, expire, etc.) */
  changeStatus: (id: string, status: string) =>
    apiClient
      .patch<SingleResponse<JobPost>>(`/job-posts/${id}/status`, { status })
      .then((r) => r.data.data),

  /** Duplicate an existing job post as a draft */
  duplicate: (id: string) =>
    apiClient
      .post<SingleResponse<JobPost>>(`/job-posts/${id}/duplicate`)
      .then((r) => r.data.data),

  /** Bulk change status */
  bulkChangeStatus: (ids: string[], status: string) =>
    apiClient
      .post<MessageResponse>("/job-posts/bulk-status", { ids, status })
      .then((r) => r.data),
};
