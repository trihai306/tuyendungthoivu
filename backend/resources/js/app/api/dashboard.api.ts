import apiClient from './client';
import type { DashboardStats } from '../types';

export const dashboardApi = {
  getStats: () =>
    apiClient.get<{ data: DashboardStats }>('/dashboard/stats'),
};
