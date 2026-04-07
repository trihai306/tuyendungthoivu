import apiClient from './client';
import type { Dormitory } from '../types';

interface DormitoryFilters {
  search?: string;
  has_wifi?: boolean;
  has_ac?: boolean;
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

export const dormitoriesApi = {
  list: (params?: DormitoryFilters) =>
    apiClient.get<PaginatedResponse<Dormitory>>('/dormitories', { params }),

  get: (id: number) =>
    apiClient.get<{ data: Dormitory }>(`/dormitories/${id}`),

  bookRoom: (dormitoryId: number, roomId: number) =>
    apiClient.post(`/dormitories/${dormitoryId}/rooms/${roomId}/book`),
};
