import apiClient from './client';
import type { JobPost } from '../types';

interface JobPostFilters {
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const jobPostsApi = {
  list: (params?: JobPostFilters) =>
    apiClient.get<PaginatedResponse<JobPost>>('/job-posts', { params }),

  get: (id: number) =>
    apiClient.get<{ data: JobPost }>(`/job-posts/${id}`),

  create: (data: Partial<JobPost>) =>
    apiClient.post<{ data: JobPost }>('/job-posts', data),

  update: (id: number, data: Partial<JobPost>) =>
    apiClient.put<{ data: JobPost }>(`/job-posts/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/job-posts/${id}`),
};
