import { apiClient } from "./api";
import type {
  RevenueOverview,
  RevenueByClient,
  RevenueTrendItem,
  StaffPayrollSummary,
} from "@/types";

export const revenueApi = {
  overview: (params?: { month?: number; year?: number }) =>
    apiClient
      .get<{ data: RevenueOverview; message: string }>("/revenue/overview", { params })
      .then((r) => r.data.data),

  byClient: (params?: { month?: number; year?: number }) =>
    apiClient
      .get<{ data: RevenueByClient[]; message: string }>("/revenue/by-client", { params })
      .then((r) => r.data.data),

  trend: (params?: { months?: number }) =>
    apiClient
      .get<{ data: RevenueTrendItem[]; message: string }>("/revenue/trend", { params })
      .then((r) => r.data.data),

  staffPayrollSummary: (params?: { month?: number; year?: number }) =>
    apiClient
      .get<{ data: StaffPayrollSummary; message: string }>("/revenue/staff-payroll-summary", { params })
      .then((r) => r.data.data),
};
