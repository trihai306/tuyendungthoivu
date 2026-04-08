// Staff management types

export type StaffRole =
  | "super_admin"
  | "admin"
  | "manager"
  | "recruiter"
  | "coordinator"
  | "viewer"

export interface StaffStats {
  tasks_completed: number
  tasks_pending: number
  interviews_done: number
  applications_reviewed: number
}

export interface Department {
  id: string
  name: string
  description: string
  head?: Staff
  member_count: number
  status: "active" | "inactive"
}

export interface Team {
  id: string
  department_id: string
  department?: Department
  name: string
  description: string
  lead?: Staff
  members: Staff[]
  member_count: number
  status: "active" | "inactive"
}

export interface Staff {
  id: string
  name: string
  email: string
  phone: string
  phone_ext?: string
  employee_code: string
  role: StaffRole
  department?: Department
  team?: Team
  position: string
  avatar?: string
  is_active: boolean
  hire_date: string
  stats?: StaffStats
}
