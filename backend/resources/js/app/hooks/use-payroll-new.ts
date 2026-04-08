import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  payrollNewApi,
  type PayrollNewFilter,
} from "@/services/payroll-new.service";
import type {
  ApiError,
  PayrollRecord,
  CalculatePayrollDto,
  BulkCalculatePayrollDto,
  BulkPayDto,
  MessageResponse,
  PaginatedResponse,
} from "@/types";

// ---------------------------------------------------------------------------
// Query hooks
// ---------------------------------------------------------------------------

const QUERY_KEY = "payrolls-new";

/** List payroll records with filters */
export function usePayrollsNew(params?: PayrollNewFilter) {
  return useQuery<PaginatedResponse<PayrollRecord>>({
    queryKey: [QUERY_KEY, params],
    queryFn: () => payrollNewApi.list(params),
  });
}

/** Single payroll record by ID */
export function usePayrollNew(id: string | undefined) {
  return useQuery<PayrollRecord>({
    queryKey: [QUERY_KEY, id],
    queryFn: () => payrollNewApi.show(id!),
    enabled: !!id,
  });
}

// ---------------------------------------------------------------------------
// Mutation hooks
// ---------------------------------------------------------------------------

/** Calculate payroll for a single worker */
export function useCalculatePayroll() {
  const qc = useQueryClient();
  return useMutation<PayrollRecord, ApiError, CalculatePayrollDto>({
    mutationFn: (data) => payrollNewApi.calculate(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success("Tinh luong thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the tinh luong. Vui long thu lai.");
    },
  });
}

/** Bulk calculate payroll for all workers in an order */
export function useBulkCalculatePayroll() {
  const qc = useQueryClient();
  return useMutation<
    { data: PayrollRecord[]; message: string },
    ApiError,
    BulkCalculatePayrollDto
  >({
    mutationFn: (data) => payrollNewApi.bulkCalculate(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success(res.message ?? "Tinh luong hang loat thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the tinh luong hang loat.");
    },
  });
}

/** Approve a payroll record */
export function useApprovePayroll() {
  const qc = useQueryClient();
  return useMutation<PayrollRecord, ApiError, string>({
    mutationFn: (id) => payrollNewApi.approve(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success("Duyet bang luong thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the duyet bang luong.");
    },
  });
}

/** Mark a payroll record as paid */
export function useMarkPayrollPaid() {
  const qc = useQueryClient();
  return useMutation<
    PayrollRecord,
    ApiError,
    { id: string; payment_method?: string; payment_reference?: string }
  >({
    mutationFn: ({ id, ...data }) => payrollNewApi.markPaid(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success("Da thanh toan luong thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the thanh toan.");
    },
  });
}

/** Bulk pay multiple payroll records */
export function useBulkPayPayroll() {
  const qc = useQueryClient();
  return useMutation<MessageResponse, ApiError, BulkPayDto>({
    mutationFn: (data) => payrollNewApi.bulkPay(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success("Thanh toan hang loat thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the thanh toan hang loat.");
    },
  });
}

/** Export payroll data */
export function useExportPayroll() {
  return useMutation<Blob, ApiError, PayrollNewFilter | undefined>({
    mutationFn: (params) => payrollNewApi.export(params),
    onSuccess: (blob) => {
      // Trigger browser download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `payroll-export-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Xuat file thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the xuat file.");
    },
  });
}
