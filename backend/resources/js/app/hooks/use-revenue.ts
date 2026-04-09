import { useQuery } from "@tanstack/react-query";
import { revenueApi } from "@/services/revenue.service";

export function useRevenueOverview(month?: number, year?: number) {
  return useQuery({
    queryKey: ["revenue-overview", month, year],
    queryFn: () => revenueApi.overview({ month, year }),
  });
}

export function useRevenueByClient(month?: number, year?: number) {
  return useQuery({
    queryKey: ["revenue-by-client", month, year],
    queryFn: () => revenueApi.byClient({ month, year }),
  });
}

export function useRevenueTrend(months?: number) {
  return useQuery({
    queryKey: ["revenue-trend", months],
    queryFn: () => revenueApi.trend({ months }),
  });
}

export function useStaffPayrollSummary(month?: number, year?: number) {
  return useQuery({
    queryKey: ["staff-payroll-summary", month, year],
    queryFn: () => revenueApi.staffPayrollSummary({ month, year }),
  });
}
