import { apiClient } from "./api";
import type {
  PayrollRecord,
  CalculatePayrollDto,
  BulkCalculatePayrollDto,
  BulkPayDto,
  PaginatedResponse,
  SingleResponse,
  MessageResponse,
  QueryParams,
} from "@/types";

// ---------------------------------------------------------------------------
// Filter type
// ---------------------------------------------------------------------------

interface PayrollNewFilter extends QueryParams {
  worker_id?: string;
  order_id?: string;
  status?: string;
  period_start?: string;
  period_end?: string;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const payrollNewApi = {
  /** List payroll records with filters */
  list: (params?: PayrollNewFilter) =>
    apiClient
      .get<PaginatedResponse<PayrollRecord>>("/payrolls-new", { params })
      .then((r) => r.data),

  /** Get single payroll record */
  show: (id: string) =>
    apiClient
      .get<SingleResponse<PayrollRecord>>(`/payrolls-new/${id}`)
      .then((r) => r.data.data),

  /** Calculate payroll for a worker */
  calculate: (data: CalculatePayrollDto) =>
    apiClient
      .post<SingleResponse<PayrollRecord>>("/payrolls-new/calculate", data)
      .then((r) => r.data.data),

  /** Bulk calculate payroll for all workers in an order */
  bulkCalculate: (data: BulkCalculatePayrollDto) =>
    apiClient
      .post<{ data: PayrollRecord[]; message: string }>("/payrolls-new/bulk-calculate", data)
      .then((r) => r.data),

  /** Approve a payroll record */
  approve: (id: string) =>
    apiClient
      .post<SingleResponse<PayrollRecord>>(`/payrolls-new/${id}/approve`)
      .then((r) => r.data.data),

  /** Mark a payroll record as paid */
  markPaid: (id: string, data?: { payment_method?: string; payment_reference?: string }) =>
    apiClient
      .post<SingleResponse<PayrollRecord>>(`/payrolls-new/${id}/pay`, data)
      .then((r) => r.data.data),

  /** Bulk pay multiple payroll records */
  bulkPay: (data: BulkPayDto) =>
    apiClient
      .post<MessageResponse>("/payrolls-new/bulk-pay", data)
      .then((r) => r.data),

  /** Export payroll data (returns blob/file) */
  export: (params?: PayrollNewFilter) =>
    apiClient
      .get("/payrolls-new/export", { params, responseType: "blob" })
      .then((r) => r.data),
};

export type { PayrollNewFilter };
