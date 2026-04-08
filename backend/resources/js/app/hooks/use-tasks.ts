import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCrudHooks } from "./use-crud";
import { tasksApi } from "@/services/tasks";
import type {
  ApiError,
  CreateTaskRequest,
  MessageResponse,
  Task,
  TaskComment,
  TaskFilter,
  TaskStatus,
  UpdateTaskRequest,
} from "@/types";

// ---------------------------------------------------------------------------
// Base CRUD hooks via factory
// ---------------------------------------------------------------------------

const taskHooks = createCrudHooks<Task, CreateTaskRequest, UpdateTaskRequest, TaskFilter>(
  "tasks",
  tasksApi,
  {
    messages: {
      createSuccess: "Tao cong viec thanh cong!",
      createError: "Khong the tao cong viec. Vui long thu lai.",
      updateSuccess: "Cap nhat cong viec thanh cong!",
      updateError: "Khong the cap nhat cong viec. Vui long thu lai.",
      deleteSuccess: "Da xoa cong viec.",
      deleteError: "Khong the xoa cong viec. Vui long thu lai.",
    },
  },
);

export const useTasks = taskHooks.useList;
export const useTask = taskHooks.useDetail;
export const useCreateTask = taskHooks.useCreate;
export const useUpdateTask = taskHooks.useUpdate;
export const useDeleteTask = taskHooks.useDelete;

// ---------------------------------------------------------------------------
// Extended hooks
// ---------------------------------------------------------------------------

export function useAssignTask() {
  const queryClient = useQueryClient();

  return useMutation<Task, ApiError, { id: string; assignedToId: string }>({
    mutationFn: ({ id, assignedToId }) => tasksApi.assign(id, assignedToId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskHooks.queryKey });
      toast.success("Da giao cong viec thanh cong.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the giao cong viec.");
    },
  });
}

export function useChangeTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation<Task, ApiError, { id: string; status: TaskStatus }>({
    mutationFn: ({ id, status }) => tasksApi.changeStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskHooks.queryKey });
      toast.success("Da cap nhat trang thai cong viec.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the cap nhat trang thai.");
    },
  });
}

export function useBulkChangeTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation<MessageResponse, ApiError, { ids: string[]; status: TaskStatus }>({
    mutationFn: ({ ids, status }) => tasksApi.bulkChangeStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskHooks.queryKey });
      toast.success("Da cap nhat trang thai hang loat.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the cap nhat trang thai.");
    },
  });
}

export function useAddTaskComment() {
  const queryClient = useQueryClient();

  return useMutation<TaskComment, ApiError, { taskId: string; content: string }>({
    mutationFn: ({ taskId, content }) => tasksApi.addComment(taskId, content),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: taskHooks.queryKey });
      queryClient.invalidateQueries({ queryKey: [...taskHooks.queryKey, variables.taskId] });
      toast.success("Da them binh luan.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the them binh luan.");
    },
  });
}

export { taskHooks };
