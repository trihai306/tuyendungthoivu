import { createCrudService } from "./base.service";
import { apiClient } from "./api";
import type {
  WorkerNew,
  CreateWorkerNewDto,
  UpdateWorkerNewDto,
  QueryParams,
  SingleResponse,
} from "@/types";

// Evaluation types
export interface WorkerEvaluationRating {
  overall: number;
  punctuality: number;
  attendance_rate: number;
  total_days: number;
  present_days: number;
  late_days: number;
  absent_days: number;
  no_show_count: number;
}

export interface WorkerWorkHistoryItem {
  id: string;
  order_id: string;
  order_code: string | null;
  client: string | null;
  position: string | null;
  status: string;
  status_label: string;
  started_at: string | null;
  completed_at: string | null;
  total_days: number;
  present_days: number;
  late_days: number;
  absent_days: number;
  excused_days: number;
  total_hours: number;
  overtime_hours: number;
  evaluation: { punctuality: number; attendance_rate: number; overall: number };
  violations: Array<{ date: string; type: string; label: string }>;
}

export interface WorkerAttendanceItem {
  id: string;
  date: string;
  order_code: string | null;
  check_in: string | null;
  check_out: string | null;
  hours: number | null;
  status: string;
  status_label: string;
}

export interface WorkerEvaluation {
  worker_id: string;
  worker_name: string;
  rating: WorkerEvaluationRating;
  work_history: WorkerWorkHistoryItem[];
  recent_attendance: WorkerAttendanceItem[];
}

// ---------------------------------------------------------------------------
// Filter type
// ---------------------------------------------------------------------------

interface WorkerNewFilter extends QueryParams {
  status?: string;
  city?: string;
  gender?: string;
  skill?: string;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

const crud = createCrudService<
  WorkerNew,
  CreateWorkerNewDto,
  UpdateWorkerNewDto,
  WorkerNewFilter
>("/workers-new");

export const workersNewApi = {
  ...crud,

  /** Update worker status (available / assigned / inactive / blacklisted) */
  updateStatus: (id: string, data: { status: string; reason?: string }) =>
    apiClient
      .patch<SingleResponse<WorkerNew>>(`/workers-new/${id}/status`, data)
      .then((r) => r.data.data),

  /** Assign a staff member to manage this worker */
  assignStaff: (id: string, data: { staff_id: string }) =>
    apiClient
      .post<SingleResponse<WorkerNew>>(`/workers-new/${id}/assign-staff`, data)
      .then((r) => r.data.data),

  /** Get auto-calculated evaluation, work history, and recent attendance */
  evaluation: (id: string) =>
    apiClient
      .get<{ data: WorkerEvaluation }>(`/workers-new/${id}/evaluation`)
      .then((r) => r.data.data),
};

export type { WorkerNewFilter };
