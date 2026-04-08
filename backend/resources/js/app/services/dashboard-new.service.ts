import { apiClient } from "./api";
import type { DashboardStats } from "@/types";

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const dashboardNewApi = {
  /** Get dashboard KPI stats overview */
  stats: () =>
    apiClient
      .get<{ data: DashboardStats; message: string }>("/dashboard-new/stats")
      .then((r) => r.data.data),
};
