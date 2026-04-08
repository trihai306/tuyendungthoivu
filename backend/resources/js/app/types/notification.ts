export type NotificationType =
  | "application_received"
  | "application_status_changed"
  | "job_post_approved"
  | "job_post_rejected"
  | "new_job_match"
  | "interview_scheduled"
  | "system";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
}

export interface NotificationFilter {
  unread_only?: boolean;
  type?: NotificationType;
  page?: number;
  per_page?: number;
}
