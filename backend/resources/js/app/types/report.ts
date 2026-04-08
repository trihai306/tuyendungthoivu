// Report / dashboard types

export interface DashboardStats {
  total_jobs: number;
  active_jobs: number;
  total_applications: number;
  pending_applications: number;
  total_workers: number;
  total_employers: number;
  recent_jobs: number;
  recent_applications: number;
}

export interface RecruitmentReport {
  period: string;
  jobs_posted: number;
  applications_received: number;
  applications_accepted: number;
  applications_rejected: number;
  fill_rate: number;
}

export interface ReportFilter {
  from_date?: string;
  to_date?: string;
  employer_id?: string;
  city?: string;
  group_by?: "day" | "week" | "month";
}
