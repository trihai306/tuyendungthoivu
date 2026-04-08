import { apiClient } from "./api";
import type {
  MessageResponse,
  Notification,
  NotificationFilter,
  PaginatedResponse,
  SingleResponse,
} from "@/types";

/**
 * Notifications don't follow standard CRUD (no create/update/delete from frontend),
 * so we define a custom service instead of using the factory.
 */
export const notificationsApi = {
  /** List notifications with optional filters */
  list: (params?: NotificationFilter) =>
    apiClient
      .get<PaginatedResponse<Notification>>("/notifications", { params })
      .then((r) => r.data),

  /** Get unread notification count */
  getUnreadCount: () =>
    apiClient
      .get<{ data: { count: number } }>("/notifications/unread-count")
      .then((r) => r.data.data.count),

  /** Mark a single notification as read */
  markAsRead: (id: string) =>
    apiClient
      .patch<SingleResponse<Notification>>(`/notifications/${id}/read`)
      .then((r) => r.data.data),

  /** Mark all notifications as read */
  markAllAsRead: () =>
    apiClient
      .post<MessageResponse>("/notifications/read-all")
      .then((r) => r.data),

  // Legacy aliases
  get getNotifications() {
    return this.list;
  },
};
