// ---------------------------------------------------------------------------
// KPI Types
// ---------------------------------------------------------------------------

export type KpiPeriodType = "monthly" | "quarterly" | "yearly";
export type KpiPeriodStatus = "open" | "closed" | "locked";
export type KpiCalculationMethod = "manual" | "auto";

export interface KpiConfig {
  id: string;
  name: string;
  code: string;
  description: string | null;
  unit: string;
  applicable_roles: string[];
  calculation_method: KpiCalculationMethod;
  auto_source: string | null;
  default_target: number;
  weight: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateKpiConfigDto {
  name: string;
  code: string;
  description?: string;
  unit: string;
  applicable_roles: string[];
  calculation_method: KpiCalculationMethod;
  auto_source?: string;
  default_target?: number;
  weight?: number;
  is_active?: boolean;
  sort_order?: number;
}

export interface KpiPeriod {
  id: string;
  name: string;
  type: KpiPeriodType;
  start_date: string;
  end_date: string;
  status: KpiPeriodStatus;
  created_by: string | null;
  created_by_user?: { id: string; name: string } | null;
  created_at: string;
  updated_at: string;
}

export interface CreateKpiPeriodDto {
  name: string;
  type: KpiPeriodType;
  start_date: string;
  end_date: string;
}

export interface KpiRecord {
  id: string;
  kpi_period_id: string;
  user_id: string;
  kpi_config_id: string;
  target_value: number;
  actual_value: number | null;
  score: number | null;
  weight: number;
  notes: string | null;
  evaluated_by: string | null;
  evaluated_at: string | null;
  user?: { id: string; name: string; employee_code?: string; position?: string };
  kpi_config?: KpiConfig;
  evaluated_by_user?: { id: string; name: string } | null;
  period?: KpiPeriod;
  created_at: string;
  updated_at: string;
}

export interface EvaluateKpiDto {
  actual_value: number;
  notes?: string;
}

export interface KpiPeriodSummaryItem {
  user_id: string;
  user_name: string;
  user_position: string | null;
  employee_code: string | null;
  department: string | null;
  total_kpis: number;
  evaluated_kpis: number;
  overall_score: number | null;
  grade: string;
}

export interface UserKpiPeriodData {
  period: KpiPeriod;
  records: KpiRecord[];
  overall_score: number | null;
  grade: string;
}

// ---------------------------------------------------------------------------
// Staff Payroll Types
// ---------------------------------------------------------------------------

export type StaffPayrollStatus = "draft" | "reviewed" | "approved" | "paid";

export interface StaffSalaryConfig {
  id: string;
  user_id: string;
  base_salary: number;
  allowance: number;
  kpi_bonus_rate: number;
  effective_from: string;
  effective_to: string | null;
  notes: string | null;
  user?: { id: string; name: string; employee_code?: string };
  created_by_user?: { id: string; name: string } | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSalaryConfigDto {
  user_id: string;
  base_salary: number;
  allowance?: number;
  kpi_bonus_rate?: number;
  effective_from: string;
  effective_to?: string;
  notes?: string;
}

export interface StaffPayrollRecord {
  id: string;
  payroll_code: string;
  user_id: string;
  period_month: number;
  period_year: number;
  base_salary: number;
  allowance: number;
  kpi_score: number | null;
  kpi_bonus: number;
  overtime_amount: number;
  deduction_amount: number;
  deduction_notes: string | null;
  gross_amount: number;
  insurance_amount: number;
  tax_amount: number;
  net_amount: number;
  working_days: number;
  absent_days: number;
  late_count: number;
  status: StaffPayrollStatus;
  calculated_by: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  approved_by: string | null;
  approved_at: string | null;
  paid_at: string | null;
  payment_method: string | null;
  payment_reference: string | null;
  notes: string | null;
  user?: { id: string; name: string; email?: string; employee_code?: string; position?: string };
  calculated_by_user?: { id: string; name: string } | null;
  reviewed_by_user?: { id: string; name: string } | null;
  approved_by_user?: { id: string; name: string } | null;
  created_at: string;
  updated_at: string;
}

export interface CalculateStaffPayrollDto {
  user_id: string;
  period_month: number;
  period_year: number;
}

export interface BulkCalculateStaffPayrollDto {
  period_month: number;
  period_year: number;
}

// ---------------------------------------------------------------------------
// Revenue Report Types
// ---------------------------------------------------------------------------

export interface RevenueOverview {
  period: { month: number; year: number };
  revenue: {
    total_invoiced: number;
    total_collected: number;
    total_receivables: number;
    overdue_amount: number;
  };
  costs: {
    worker_payroll: number;
    staff_payroll: number;
    total_costs: number;
  };
  profit: {
    gross_profit: number;
    net_profit: number;
    margin_percent: number;
  };
  operations: {
    active_orders: number;
  };
}

export interface RevenueByClient {
  client_id: string;
  client_name: string;
  total_revenue: number;
  total_paid: number;
  outstanding: number;
  invoice_count: number;
}

export interface RevenueTrendItem {
  month: number;
  year: number;
  label: string;
  revenue: number;
  cost: number;
  profit: number;
}

export interface StaffPayrollSummary {
  period: { month: number; year: number };
  total_staff: number;
  total_gross: number;
  total_insurance: number;
  total_tax: number;
  total_net: number;
  by_status: {
    draft: number;
    reviewed: number;
    approved: number;
    paid: number;
  };
}
