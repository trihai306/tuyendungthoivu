import type { User } from "./user"

export type TaskType =
  | "review_application"
  | "interview_candidate"
  | "verify_employer"
  | "verify_accommodation"
  | "approve_job"
  | "custom"

export type TaskPriority = "low" | "medium" | "high" | "urgent"

export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled" | "overdue"

export interface TaskComment {
  id: string
  task_id: string
  user: User
  content: string
  created_at: string
}

export interface Task {
  id: string
  title: string
  description: string
  type: TaskType
  priority: TaskPriority
  status: TaskStatus
  assigned_by: User
  assigned_to: User
  related_type?: string
  related_id?: string
  deadline: string
  started_at?: string
  completed_at?: string
  notes?: string
  comments: TaskComment[]
  created_at: string
}

export interface TaskFilter {
  status?: TaskStatus
  priority?: TaskPriority
  type?: TaskType
  assigned_to?: string
  search?: string
}
