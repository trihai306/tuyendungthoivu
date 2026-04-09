export type UserRole = "admin" | "employer" | "worker" | "coordinator";
export type UserStatus = "active" | "inactive" | "banned";
export type Gender = "male" | "female" | "other";
export type AvailabilityStatus = "available" | "busy" | "unavailable";

// RBAC role names (from roles table)
export type RbacRoleName = "super_admin" | "admin" | "manager" | "recruiter" | "coordinator" | "viewer";

export interface RbacRole {
  id: string;
  name: RbacRoleName;
  display_name: string;
  level: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  status: UserStatus;
  position: string | null;
  employee_code: string | null;
  department_id: string | null;
  team_id: string | null;
  is_active: boolean;
  // RBAC
  roles: RbacRole[];
  permissions: string[];
  highest_role_level: number;
  created_at: string;
}

// Helper: check if user has minimum role level
export function hasMinLevel(user: User | null, level: number): boolean {
  return (user?.highest_role_level ?? 0) >= level;
}

// Helper: check if user has a specific RBAC role
export function hasRole(user: User | null, role: RbacRoleName): boolean {
  return user?.roles?.some((r) => r.name === role) ?? false;
}

// Helper: check if user has any of the given roles
export function hasAnyRole(user: User | null, roles: RbacRoleName[]): boolean {
  return user?.roles?.some((r) => roles.includes(r.name)) ?? false;
}

// Helper: check if user has a specific permission
export function hasPermission(user: User | null, permission: string): boolean {
  return user?.permissions?.includes(permission) ?? false;
}

// Role level constants
export const ROLE_LEVELS = {
  SUPER_ADMIN: 100,
  ADMIN: 90,
  MANAGER: 70,
  RECRUITER: 50,
  COORDINATOR: 40,
  VIEWER: 10,
} as const;

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
