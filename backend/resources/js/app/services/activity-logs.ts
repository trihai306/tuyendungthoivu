import { apiClient } from "./api";
import type {
  ActivityLog,
  PaginatedResponse,
  QueryParams,
} from "@/types";

export interface ActivityLogFilter extends QueryParams {
  user_id?: string;
  action?: string;
}

export const activityLogsApi = {
  list: (params?: ActivityLogFilter) =>
    apiClient
      .get<PaginatedResponse<ActivityLog>>("/activity-logs", { params })
      .then((r) => r.data),
};
