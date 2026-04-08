import { apiClient } from "./api";
import type { Notification, NotificationFilter, PaginatedResponse } from "@/types";

export const notificationsApi = {
  getNotifications: (params?: NotificationFilter) =>
    apiClient
      .get<PaginatedResponse<Notification>>("/notifications", { params })
      .then((r) => r.data),

  getUnreadCount: () =>
    apiClient
      .get<{ data: { count: number } }>("/notifications/unread-count")
      .then((r) => r.data.data.count),

  markAsRead: (id: string) =>
    apiClient
      .patch<{ data: Notification }>(`/notifications/${id}/read`)
      .then((r) => r.data.data),

  markAllAsRead: () =>
    apiClient
      .post<{ message: string }>("/notifications/read-all")
      .then((r) => r.data),
};
