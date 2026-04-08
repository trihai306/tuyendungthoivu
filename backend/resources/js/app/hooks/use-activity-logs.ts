import { useQuery } from "@tanstack/react-query";
import {
  activityLogsApi,
  type ActivityLogFilter,
} from "@/services/activity-logs";
import type { ActivityLog, PaginatedResponse } from "@/types";

export function useActivityLogs(filters?: ActivityLogFilter) {
  return useQuery<PaginatedResponse<ActivityLog>>({
    queryKey: ["activity-logs", filters],
    queryFn: () => activityLogsApi.list(filters),
  });
}
