import type { User, EmployerProfile } from "./user";

export type JobStatus = "draft" | "pending" | "active" | "closed" | "expired";
export type SalaryType = "hourly" | "daily" | "monthly" | "fixed";
export type JobType = "full_time" | "part_time" | "contract" | "temporary";

export interface JobPost {
  id: string;
  employer_id: string;
  employer?: User & { employer_profile?: EmployerProfile };
  title: string;
  description: string;
  requirements: string | null;
  benefits: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_type: SalaryType | null;
  location: string | null;
  city: string | null;
  district: string | null;
  job_type: JobType;
  positions_count: number;
  start_date: string | null;
  end_date: string | null;
  status: JobStatus;
  views_count: number;
  created_at: string;
}

export interface JobCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  jobs_count?: number;
}

export interface JobFilter {
  search?: string;
  city?: string;
  district?: string;
  job_type?: JobType;
  salary_min?: number;
  salary_max?: number;
  salary_type?: SalaryType;
  status?: JobStatus;
  category_id?: string;
  employer_id?: string;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface CreateJobPostRequest {
  title: string;
  description: string;
  requirements?: string | null;
  benefits?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_type?: SalaryType | null;
  location?: string | null;
  city?: string | null;
  district?: string | null;
  job_type: JobType;
  positions_count: number;
  start_date?: string | null;
  end_date?: string | null;
}

export interface UpdateJobPostRequest extends Partial<CreateJobPostRequest> {
  status?: JobStatus;
}
