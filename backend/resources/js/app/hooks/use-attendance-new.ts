import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  attendanceNewApi,
  type AttendanceNewFilter,
} from "@/services/attendance-new.service";
import type {
  ApiError,
  AttendanceRecord,
  CheckInDto,
  CheckOutDto,
  BulkCheckInDto,
  PaginatedResponse,
} from "@/types";

// ---------------------------------------------------------------------------
// Query hooks
// ---------------------------------------------------------------------------

const QUERY_KEY = "attendances-new";

/** List attendance records with filters */
export function useAttendancesNew(params?: AttendanceNewFilter) {
  return useQuery<PaginatedResponse<AttendanceRecord>>({
    queryKey: [QUERY_KEY, params],
    queryFn: () => attendanceNewApi.list(params),
  });
}

/** Daily attendance report for a specific order */
export function useAttendanceDailyReport(
  orderId: string | undefined,
  params?: { date?: string },
) {
  return useQuery<AttendanceRecord[]>({
    queryKey: [QUERY_KEY, "daily-report", orderId, params],
    queryFn: () => attendanceNewApi.dailyReport(orderId!, params),
    enabled: !!orderId,
  });
}

/** Weekly attendance summary */
export function useAttendanceWeeklyReport(params?: {
  order_id?: string;
  week_start?: string;
}) {
  return useQuery({
    queryKey: [QUERY_KEY, "weekly-report", params],
    queryFn: () => attendanceNewApi.weeklyReport(params),
  });
}

/** Monthly attendance report for a specific worker */
export function useAttendanceMonthlyReport(
  workerId: string | undefined,
  params?: { month?: string; year?: string },
) {
  return useQuery({
    queryKey: [QUERY_KEY, "monthly-report", workerId, params],
    queryFn: () => attendanceNewApi.monthlyReport(workerId!, params),
    enabled: !!workerId,
  });
}

// ---------------------------------------------------------------------------
// Mutation hooks
// ---------------------------------------------------------------------------

/** Check-in a worker */
export function useCheckIn() {
  const qc = useQueryClient();
  return useMutation<AttendanceRecord, ApiError, CheckInDto>({
    mutationFn: (data) => attendanceNewApi.checkIn(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success("Check-in thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the check-in. Vui long thu lai.");
    },
  });
}

/** Check-out a worker */
export function useCheckOut() {
  const qc = useQueryClient();
  return useMutation<AttendanceRecord, ApiError, CheckOutDto>({
    mutationFn: (data) => attendanceNewApi.checkOut(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success("Check-out thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the check-out. Vui long thu lai.");
    },
  });
}

/** Bulk check-in multiple workers */
export function useBulkCheckIn() {
  const qc = useQueryClient();
  return useMutation<
    { data: AttendanceRecord[]; message: string },
    ApiError,
    BulkCheckInDto
  >({
    mutationFn: (data) => attendanceNewApi.bulkCheckIn(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success(res.message ?? "Check-in hang loat thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the check-in hang loat.");
    },
  });
}
