export type UserRole = "admin" | "employer" | "worker";
export type UserStatus = "active" | "inactive" | "banned";
export type Gender = "male" | "female" | "other";
export type AvailabilityStatus = "available" | "busy" | "unavailable";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  avatar: string | null;
  status: UserStatus;
  created_at: string;
}

export interface WorkerProfile {
  user_id: string;
  date_of_birth: string | null;
  gender: Gender | null;
  id_number: string | null;
  address: string | null;
  city: string | null;
  district: string | null;
  skills: string[];
  experience_years: number | null;
  education: string | null;
  bio: string | null;
  availability_status: AvailabilityStatus;
  rating: number | null;
  user?: User;
}

export interface EmployerProfile {
  user_id: string;
  company_name: string;
  company_size: string | null;
  industry: string | null;
  tax_code: string | null;
  address: string | null;
  city: string | null;
  description: string | null;
  logo: string | null;
  website: string | null;
  verified_at: string | null;
  rating: number | null;
  user?: User;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: UserRole;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateWorkerProfileRequest {
  date_of_birth?: string | null;
  gender?: Gender | null;
  id_number?: string | null;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  skills?: string[];
  experience_years?: number | null;
  education?: string | null;
  bio?: string | null;
  availability_status?: AvailabilityStatus;
}

export interface UpdateEmployerProfileRequest {
  company_name?: string;
  company_size?: string | null;
  industry?: string | null;
  tax_code?: string | null;
  address?: string | null;
  city?: string | null;
  description?: string | null;
  logo?: string | null;
  website?: string | null;
}
