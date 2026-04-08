import { apiClient } from "./api";
import type {
  DashboardStats,
  RecruitmentReport,
  ReportFilter,
} from "@/types";

export const reportsApi = {
  /** Get dashboard overview statistics */
  getDashboard: () =>
    apiClient
      .get<{ data: DashboardStats }>("/reports/dashboard")
      .then((r) => r.data.data),

  /** Get recruitment metrics over time */
  getRecruitmentReport: (params?: ReportFilter) =>
    apiClient
      .get<{ data: RecruitmentReport[] }>("/reports/recruitment", { params })
      .then((r) => r.data.data),

  /** Export recruitment report as file */
  exportRecruitmentReport: (params?: ReportFilter) =>
    apiClient
      .get<Blob>("/reports/recruitment/export", { params, responseType: "blob" })
      .then((r) => r.data),
};
