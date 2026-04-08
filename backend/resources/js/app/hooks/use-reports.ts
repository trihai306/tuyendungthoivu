import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "@/services/reports";
import type { DashboardStats, RecruitmentReport, ReportFilter } from "@/types";

const REPORTS_KEY = ["reports"] as const;

export function useDashboard() {
  return useQuery<DashboardStats>({
    queryKey: [...REPORTS_KEY, "dashboard"],
    queryFn: () => reportsApi.getDashboard(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRecruitmentReport(params?: ReportFilter) {
  return useQuery<RecruitmentReport[]>({
    queryKey: [...REPORTS_KEY, "recruitment", params],
    queryFn: () => reportsApi.getRecruitmentReport(params),
    staleTime: 5 * 60 * 1000,
  });
}
