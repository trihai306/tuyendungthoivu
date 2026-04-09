import { apiClient } from "./api";
import type {
  StaffSalaryConfig,
  CreateSalaryConfigDto,
  StaffPayrollRecord,
  CalculateStaffPayrollDto,
  BulkCalculateStaffPayrollDto,
  SingleResponse,
  QueryParams,
} from "@/types";

interface StaffPayrollFilter extends QueryParams {
  period_month?: number;
  period_year?: number;
  status?: string;
}

export const staffPayrollApi = {
  // ── Salary Configs ────────────────────────────────────────────────

  listSalaryConfigs: (params?: { user_id?: string }) =>
    apiClient
      .get<{ data: StaffSalaryConfig[]; message: string }>("/staff-payroll/salary-configs", { params })
      .then((r) => r.data),

  createSalaryConfig: (data: CreateSalaryConfigDto) =>
    apiClient
      .post<SingleResponse<StaffSalaryConfig>>("/staff-payroll/salary-configs", data)
      .then((r) => r.data.data),

  updateSalaryConfig: (id: string, data: Partial<CreateSalaryConfigDto>) =>
    apiClient
      .put<SingleResponse<StaffSalaryConfig>>(`/staff-payroll/salary-configs/${id}`, data)
      .then((r) => r.data.data),

  // ── Payroll ───────────────────────────────────────────────────────

  list: (params?: StaffPayrollFilter) =>
    apiClient
      .get<{ data: { data: StaffPayrollRecord[]; current_page: number; last_page: number; total: number } }>("/staff-payroll", { params })
      .then((r) => r.data.data),

  show: (id: string) =>
    apiClient
      .get<SingleResponse<StaffPayrollRecord>>(`/staff-payroll/${id}`)
      .then((r) => r.data.data),

  update: (id: string, data: Partial<StaffPayrollRecord>) =>
    apiClient
      .put<SingleResponse<StaffPayrollRecord>>(`/staff-payroll/${id}`, data)
      .then((r) => r.data.data),

  calculate: (data: CalculateStaffPayrollDto) =>
    apiClient
      .post<SingleResponse<StaffPayrollRecord>>("/staff-payroll/calculate", data)
      .then((r) => r.data.data),

  bulkCalculate: (data: BulkCalculateStaffPayrollDto) =>
    apiClient
      .post<{ data: { created: number; skipped: number; errors: unknown[] }; message: string }>("/staff-payroll/bulk-calculate", data)
      .then((r) => r.data),

  review: (id: string) =>
    apiClient
      .post<SingleResponse<StaffPayrollRecord>>(`/staff-payroll/${id}/review`)
      .then((r) => r.data.data),

  approve: (id: string) =>
    apiClient
      .post<SingleResponse<StaffPayrollRecord>>(`/staff-payroll/${id}/approve`)
      .then((r) => r.data.data),

  markPaid: (id: string, data?: { payment_method?: string; payment_reference?: string }) =>
    apiClient
      .post<SingleResponse<StaffPayrollRecord>>(`/staff-payroll/${id}/pay`, data)
      .then((r) => r.data.data),

  bulkApprove: (payrollIds: string[]) =>
    apiClient
      .post<{ data: { approved_count: number }; message: string }>("/staff-payroll/bulk-approve", { payroll_ids: payrollIds })
      .then((r) => r.data),

  bulkPay: (payrollIds: string[], paymentMethod?: string) =>
    apiClient
      .post<{ data: { paid_count: number }; message: string }>("/staff-payroll/bulk-pay", {
        payroll_ids: payrollIds,
        payment_method: paymentMethod ?? "bank_transfer",
      })
      .then((r) => r.data),
};

export type { StaffPayrollFilter };
