import type { User, WorkerProfile } from "./user";
import type { JobPost } from "./job";

export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "interview"
  | "accepted"
  | "rejected"
  | "withdrawn";

export interface Application {
  id: string;
  worker_id: string;
  job_post_id: string;
  cover_letter: string | null;
  resume_url: string | null;
  status: ApplicationStatus;
  applied_at: string;
  reviewed_at: string | null;
  notes: string | null;
  worker?: User & { worker_profile?: WorkerProfile };
  job_post?: JobPost;
}

export interface CreateApplicationRequest {
  job_post_id: string;
  cover_letter?: string | null;
  resume_url?: string | null;
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
  notes?: string | null;
}

export interface ApplicationFilter {
  status?: ApplicationStatus;
  job_post_id?: string;
  worker_id?: string;
  page?: number;
  per_page?: number;
}
