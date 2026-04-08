// RBAC (Role-Based Access Control) types

export interface Permission {
  id: string;
  name: string;
  display_name: string;
  module: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  display_name: string;
  description: string;
  level: number;
  permissions: Permission[];
  user_count: number;
}

export type ActivityAction =
  | "login"
  | "create"
  | "update"
  | "delete"
  | "approve"
  | "assign";

export interface ActivityLog {
  id: string;
  user: {
    name: string;
    avatar: string | null;
    role: string;
  };
  action: ActivityAction;
  description: string;
  metadata?: Record<string, unknown>;
  ip_address: string;
  created_at: string;
}
