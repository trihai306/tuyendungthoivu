import { useQuery } from "@tanstack/react-query";
import { dashboardNewApi } from "@/services/dashboard-new.service";
import type { DashboardStats } from "@/types";

// ---------------------------------------------------------------------------
// Query hooks
// ---------------------------------------------------------------------------

const QUERY_KEY = "dashboard-new";

/** Dashboard KPI stats overview */
export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: [QUERY_KEY, "stats"],
    queryFn: () => dashboardNewApi.stats(),
    // Refetch every 60 seconds for near-realtime dashboard
    refetchInterval: 60_000,
    // Keep data fresh but don't show loading state on background refetches
    staleTime: 30_000,
  });
}
