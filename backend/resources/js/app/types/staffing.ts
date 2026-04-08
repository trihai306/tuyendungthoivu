// ---------------------------------------------------------------------------
// Enums / Union types (matching backend enums)
// ---------------------------------------------------------------------------

export type ClientStatus = "prospect" | "active" | "inactive";

export type OrderStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "recruiting"
  | "filled"
  | "in_progress"
  | "completed"
  | "cancelled";

export type WorkerNewStatus = "available" | "assigned" | "inactive" | "blacklisted";

export type AssignmentStatus =
  | "created"
  | "contacted"
  | "confirmed"
  | "working"
  | "completed"
  | "rejected"
  | "cancelled"
  | "no_contact"
  | "replaced";

export type AttendanceNewStatus = "present" | "late" | "absent" | "half_day" | "excused";

export type PayrollNewStatus = "draft" | "reviewed" | "approved" | "paid";

export type InvoiceNewStatus =
  | "draft"
  | "approved"
  | "sent"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "cancelled";

export type PaymentMethodType = "bank_transfer" | "cash" | "check";

export type RateType = "hourly" | "daily" | "shift";

export type OrderUrgency = "normal" | "urgent" | "critical";

export type ServiceType = "short_term" | "long_term" | "shift_based" | "project_based";

export type GenderRequirement = "male" | "female" | "any";

// ---------------------------------------------------------------------------
// Embedded / nested types (partial entities from API relations)
// ---------------------------------------------------------------------------

export interface UserSummary {
  id: string;
  name: string;
  email?: string;
  avatar?: string | null;
}

export interface WorkerSummary {
  id: string;
  name: string;
  phone: string | null;
  worker_code: string;
  bank_name?: string | null;
  bank_account?: string | null;
  bank_account_name?: string | null;
}

export interface OrderSummary {
  id: string;
  code: string;
  client?: string | null;
  position?: string | null;
}

export interface ClientSummary {
  id: string;
  company_name: string;
  contact_name?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export interface ClientContract {
  id: string;
  client_id: string;
  contract_number: string;
  type: string;
  start_date: string | null;
  end_date: string | null;
  markup_percentage: number | null;
  payment_terms: string | null;
  value: number | null;
  status: string | null;
  status_label: string | null;
  notes: string | null;
  approved_by: UserSummary | null;
  approved_at: string | null;
  created_at: string;
}

export interface Client {
  id: string;
  company_name: string;
  tax_code: string | null;
  industry: string | null;
  company_size: string | null;
  address: string | null;
  district: string | null;
  city: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  website: string | null;
  status: ClientStatus;
  status_label: string;
  status_color: string;
  logo_path: string | null;
  notes: string | null;
  active_orders_count?: number | null;
  contracts_count?: number | null;
  staffing_orders_count?: number | null;
  created_by?: UserSummary | null;
  contracts?: ClientContract[];
  staffing_orders?: StaffingOrder[];
  created_at: string;
  updated_at: string;
}

export interface CreateClientDto {
  company_name: string;
  tax_code?: string;
  industry?: string;
  company_size?: string;
  address?: string;
  district?: string;
  city?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  website?: string;
  status?: ClientStatus;
  notes?: string;
}

export type UpdateClientDto = Partial<CreateClientDto>;

// ---------------------------------------------------------------------------
// Staffing Order
// ---------------------------------------------------------------------------

export interface StaffingOrder {
  id: string;
  order_code: string;

  // Client info
  client_id: string;
  client?: Client | null;
  contract_id: string | null;

  // Job info
  position_name: string;
  job_description: string | null;
  work_address: string | null;
  work_district: string | null;
  work_city: string | null;

  // Quantity
  quantity_needed: number;
  quantity_filled: number;
  progress_percent: number;

  // Requirements
  gender_requirement: GenderRequirement | null;
  age_min: number | null;
  age_max: number | null;
  required_skills: string[] | null;
  other_requirements: string | null;

  // Schedule
  start_date: string | null;
  end_date: string | null;
  shift_type: string | null;
  start_time: string | null;
  end_time: string | null;
  break_minutes: number | null;

  // Financial
  worker_rate: number | null;
  rate_type: RateType | null;
  service_fee: number | null;
  service_fee_type: string | null;
  overtime_rate: number | null;

  // Management
  urgency: OrderUrgency | null;
  urgency_label: string | null;
  urgency_color: string | null;
  service_type: ServiceType | null;
  service_type_label: string | null;
  status: OrderStatus;
  status_label: string;
  status_color: string;

  // People
  assigned_recruiter_id: string | null;
  assigned_to?: UserSummary | null;
  created_by?: UserSummary | null;
  approved_by?: UserSummary | null;
  approved_at: string | null;

  // Additional info
  rejection_reason: string | null;
  cancellation_reason: string | null;
  notes: string | null;
  uniform_requirement: string | null;

  // Counts & relations
  assignments_count?: number | null;
  assignments?: Assignment[];

  created_at: string;
  updated_at: string;
}

export interface CreateStaffingOrderDto {
  client_id: string;
  contract_id?: string;
  position_name: string;
  job_description?: string;
  work_address?: string;
  work_district?: string;
  work_city?: string;
  quantity_needed: number;
  gender_requirement?: GenderRequirement;
  age_min?: number;
  age_max?: number;
  required_skills?: string[];
  other_requirements?: string;
  start_date: string;
  end_date?: string;
  shift_type?: string;
  start_time?: string;
  end_time?: string;
  break_minutes?: number;
  worker_rate?: number;
  rate_type?: RateType;
  service_fee?: number;
  service_fee_type?: string;
  overtime_rate?: number;
  urgency?: OrderUrgency;
  service_type?: ServiceType;
  notes?: string;
  uniform_requirement?: string;
}

export type UpdateStaffingOrderDto = Partial<CreateStaffingOrderDto>;

// ---------------------------------------------------------------------------
// Worker (New staffing system)
// ---------------------------------------------------------------------------

export interface WorkerSkill {
  id: string;
  worker_profile_id: string;
  skill_name: string;
  level: string | null;
  years: number | null;
}

export interface WorkerNew {
  id: string;
  worker_code: string;
  user_id: string | null;

  // Personal info
  full_name: string;
  date_of_birth: string | null;
  gender: GenderRequirement | null;
  gender_label: string | null;
  id_number: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  district: string | null;
  city: string | null;
  avatar_url: string | null;

  // Work info
  experience_notes: string | null;
  preferred_districts: string[] | null;
  availability: string | null;

  // Skills
  skills?: WorkerSkill[];

  // Bank info
  bank_name: string | null;
  bank_account: string | null;
  bank_account_name: string | null;

  // Stats
  total_orders: number;
  total_days_worked: number;
  average_rating: number | null;
  no_show_count: number;
  last_worked_date: string | null;

  // Status
  status: WorkerNewStatus;
  status_label: string;
  status_color: string;
  blacklist_reason: string | null;

  // Management
  registered_by?: UserSummary | null;
  notes: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;

  // Counts & relations
  assignments_count?: number | null;
  assignments?: Assignment[];

  created_at: string;
  updated_at: string;
}

export interface CreateWorkerNewDto {
  full_name: string;
  date_of_birth?: string;
  gender?: GenderRequirement;
  id_number?: string;
  phone?: string;
  email?: string;
  address?: string;
  district?: string;
  city?: string;
  experience_notes?: string;
  preferred_districts?: string[];
  availability?: string;
  bank_name?: string;
  bank_account?: string;
  bank_account_name?: string;
  notes?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export type UpdateWorkerNewDto = Partial<CreateWorkerNewDto>;

// ---------------------------------------------------------------------------
// Assignment
// ---------------------------------------------------------------------------

export interface Assignment {
  id: string;
  order_id: string;
  worker_id: string;

  // Status
  status: AssignmentStatus;
  status_label: string;
  status_color: string;
  is_active: boolean;

  // Notes & reasons
  confirmation_note: string | null;
  rejection_reason: string | null;
  dispatch_info: string | null;
  replacement_reason: string | null;

  // Reconfirmation
  is_reconfirmed: boolean;
  reconfirmed_at: string | null;

  // Replacement
  replaced_by_id: string | null;

  // Timestamps
  confirmed_at: string | null;
  started_at: string | null;
  completed_at: string | null;

  // Relations
  order?: StaffingOrder | null;
  worker?: WorkerNew | null;
  assigned_by?: UserSummary | null;

  created_at: string;
  updated_at: string;
}

export interface CreateAssignmentDto {
  order_id: string;
  worker_id: string;
  confirmation_note?: string;
  dispatch_info?: string;
}

export type UpdateAssignmentDto = Partial<CreateAssignmentDto>;

export interface BulkAssignDto {
  staffing_order_id: string;
  worker_ids: string[];
}

// ---------------------------------------------------------------------------
// Attendance (New system)
// ---------------------------------------------------------------------------

export interface AttendanceRecord {
  id: string;
  worker: WorkerSummary;
  staffing_order: OrderSummary;
  assignment_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  check_in_time: string | null;
  check_out_time: string | null;
  break_minutes: number | null;
  hours_worked: number | null;
  overtime_hours: number | null;
  status: AttendanceNewStatus;
  status_label: string;
  status_color: string;
  is_approved: boolean;
  approved_by: string | null;
  approved_at: string | null;
  check_in_note: string | null;
  check_out_note: string | null;
  adjustment_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface CheckInDto {
  assignment_id: string;
  work_date?: string;
  check_in_time?: string;
  check_in_note?: string;
}

export interface CheckOutDto {
  assignment_id: string;
  work_date?: string;
  check_out_time?: string;
  check_out_note?: string;
}

export interface BulkCheckInDto {
  assignment_ids: string[];
  work_date?: string;
  check_in_time?: string;
}

// ---------------------------------------------------------------------------
// Payroll (New system)
// ---------------------------------------------------------------------------

export interface PayrollRecord {
  id: string;
  payroll_code: string;
  worker: WorkerSummary;
  staffing_order?: OrderSummary | null;
  period_start: string;
  period_end: string;
  total_days: number;
  total_hours: number;
  overtime_hours: number;
  unit_price: number;
  rate_type: RateType | null;
  rate_type_label: string | null;
  base_amount: number;
  overtime_amount: number;
  allowance_amount: number;
  deduction_amount: number;
  net_amount: number;
  status: PayrollNewStatus;
  status_label: string;
  status_color: string;
  approved_by: string | null;
  approved_at: string | null;
  paid_at: string | null;
  payment_method: PaymentMethodType | null;
  payment_method_label: string | null;
  payment_reference: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CalculatePayrollDto {
  worker_id: string;
  order_id?: string;
  period_start: string;
  period_end: string;
}

export interface BulkCalculatePayrollDto {
  order_id: string;
  period_start: string;
  period_end: string;
}

export interface BulkPayDto {
  payroll_ids: string[];
  payment_method: PaymentMethodType;
  payment_reference?: string;
}

// ---------------------------------------------------------------------------
// Invoice (New system)
// ---------------------------------------------------------------------------

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  amount: number;
  order?: { id: string; code: string } | null;
}

export interface InvoiceNew {
  id: string;
  invoice_number: string;
  client: ClientSummary;
  period_start: string | null;
  period_end: string | null;
  items?: InvoiceItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  remaining: number;
  status: InvoiceNewStatus;
  status_label: string;
  status_color: string;
  due_date: string | null;
  approved_by: string | null;
  approved_at: string | null;
  sent_at: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInvoiceDto {
  client_id: string;
  period_start?: string;
  period_end?: string;
  items?: Array<{
    description: string;
    quantity: number;
    unit?: string;
    unit_price: number;
    order_id?: string;
  }>;
  tax_rate?: number;
  due_date?: string;
  notes?: string;
}

export type UpdateInvoiceDto = Partial<CreateInvoiceDto>;

export interface RecordPaymentDto {
  amount: number;
  payment_method: PaymentMethodType;
  payment_date?: string;
  reference_number?: string;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Payment
// ---------------------------------------------------------------------------

export interface PayableInfo {
  code: string | null;
  client?: string | null;
  worker?: string | null;
  total: number | null;
}

export interface Payment {
  id: string;
  payable_type: "invoice" | "payroll";
  payable_id: string;
  payable_info: PayableInfo | null;
  amount: number;
  payment_method: PaymentMethodType;
  payment_method_label: string;
  payment_date: string;
  reference_number: string | null;
  notes: string | null;
  recorded_by: string | null;
  created_at: string;
}

export interface CreatePaymentDto {
  payable_type: "invoice" | "payroll";
  payable_id: string;
  amount: number;
  payment_method: PaymentMethodType;
  payment_date?: string;
  reference_number?: string;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Dashboard (New system)
// ---------------------------------------------------------------------------

export interface DashboardRecentOrder {
  id: string;
  code: string;
  client: string | null;
  position: string;
  quantity_needed: number;
  quantity_filled: number;
  status: OrderStatus;
  status_label: string;
  start_date: string | null;
  created_at: string;
}

export interface DashboardRecentActivity {
  id: string;
  type: string;
  worker_name: string | null;
  order_code: string | null;
  action: "check_in" | "check_out";
  date: string;
  time: string | null;
  created_at: string;
}

export interface DashboardDispatchItem {
  id: string;
  worker_name: string | null;
  worker_phone: string | null;
  order_code: string | null;
  client: string | null;
  position: string | null;
  work_address: string | null;
  start_time: string | null;
  status: AssignmentStatus;
  status_label: string;
}

export interface DashboardStats {
  active_orders: number;
  workers_working: number;
  dispatch_today: number;
  monthly_revenue: number;
  recent_orders: DashboardRecentOrder[];
  recent_activities: DashboardRecentActivity[];
  workers_by_status: Record<WorkerNewStatus, number>;
  dispatch_today_items: DashboardDispatchItem[];
}
