import { apiClient } from "./api";
import type {
  AttendanceRecord,
  CheckInDto,
  CheckOutDto,
  BulkCheckInDto,
  PaginatedResponse,
  QueryParams,
  SingleResponse,
} from "@/types";

// ---------------------------------------------------------------------------
// Filter type
// ---------------------------------------------------------------------------

interface AttendanceNewFilter extends QueryParams {
  order_id?: string;
  worker_id?: string;
  date?: string;
  status?: string;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const attendanceNewApi = {
  /** List attendance records with filters */
  list: (params?: AttendanceNewFilter) =>
    apiClient
      .get<PaginatedResponse<AttendanceRecord>>("/attendances-new", { params })
      .then((r) => r.data),

  /** Check-in a worker */
  checkIn: (data: CheckInDto) =>
    apiClient
      .post<SingleResponse<AttendanceRecord>>("/attendances-new/check-in", data)
      .then((r) => r.data.data),

  /** Check-out a worker */
  checkOut: (data: CheckOutDto) =>
    apiClient
      .post<SingleResponse<AttendanceRecord>>("/attendances-new/check-out", data)
      .then((r) => r.data.data),

  /** Bulk check-in multiple workers */
  bulkCheckIn: (data: BulkCheckInDto) =>
    apiClient
      .post<{ data: AttendanceRecord[]; message: string }>("/attendances-new/bulk-check-in", data)
      .then((r) => r.data),

  /** Daily attendance report for a specific order */
  dailyReport: (orderId: string, params?: { date?: string }) =>
    apiClient
      .get<{ data: AttendanceRecord[] }>(`/attendances-new/daily-report/${orderId}`, { params })
      .then((r) => r.data.data),

  /** Weekly attendance summary */
  weeklyReport: (params?: { order_id?: string; week_start?: string }) =>
    apiClient
      .get<{ data: unknown }>("/attendances-new/weekly-report", { params })
      .then((r) => r.data.data),

  /** Monthly report for a specific worker */
  monthlyReport: (workerId: string, params?: { month?: string; year?: string }) =>
    apiClient
      .get<{ data: unknown }>(`/attendances-new/monthly-report/${workerId}`, { params })
      .then((r) => r.data.data),
};

export type { AttendanceNewFilter };
