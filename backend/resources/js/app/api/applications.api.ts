import apiClient from './client';
import type { Application } from '../types';

interface ApplicationFilters {
  status?: string;
  job_post_id?: number;
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

export const applicationsApi = {
  list: (params?: ApplicationFilters) =>
    apiClient.get<PaginatedResponse<Application>>('/applications', { params }),

  get: (id: number) =>
    apiClient.get<{ data: Application }>(`/applications/${id}`),

  create: (data: { job_post_id: number; note?: string }) =>
    apiClient.post<{ data: Application }>('/applications', data),

  updateStatus: (id: number, status: string, note?: string) =>
    apiClient.patch<{ data: Application }>(`/applications/${id}/status`, { status, note }),
};
