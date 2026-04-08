import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/services/notifications";
import type { Notification, NotificationFilter, PaginatedResponse } from "@/types";

const NOTIFICATIONS_KEY = ["notifications"] as const;
const UNREAD_COUNT_KEY = ["notifications", "unread-count"] as const;

export function useNotifications(params?: NotificationFilter) {
  return useQuery<PaginatedResponse<Notification>>({
    queryKey: [...NOTIFICATIONS_KEY, params],
    queryFn: () => notificationsApi.list(params),
  });
}

export function useUnreadCount() {
  return useQuery<number>({
    queryKey: [...UNREAD_COUNT_KEY],
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 30_000, // Poll every 30 seconds
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
    },
  });
}
