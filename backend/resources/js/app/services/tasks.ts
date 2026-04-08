import { apiClient } from "./api";
import { createCrudService } from "./base.service";
import type {
  CreateTaskRequest,
  MessageResponse,
  SingleResponse,
  Task,
  TaskComment,
  TaskFilter,
  TaskStatus,
  UpdateTaskRequest,
} from "@/types";

const crud = createCrudService<Task, CreateTaskRequest, UpdateTaskRequest, TaskFilter>(
  "/tasks",
);

export const tasksApi = {
  ...crud,

  /** Assign task to a different staff member */
  assign: (id: string, assignedToId: string) =>
    apiClient
      .patch<SingleResponse<Task>>(`/tasks/${id}/assign`, { assigned_to_id: assignedToId })
      .then((r) => r.data.data),

  /** Change task status (start, complete, cancel) */
  changeStatus: (id: string, status: TaskStatus) =>
    apiClient
      .patch<SingleResponse<Task>>(`/tasks/${id}/status`, { status })
      .then((r) => r.data.data),

  /** Bulk change task statuses */
  bulkChangeStatus: (ids: string[], status: TaskStatus) =>
    apiClient
      .post<MessageResponse>("/tasks/bulk-status", { ids, status })
      .then((r) => r.data),

  /** Add a comment to a task */
  addComment: (taskId: string, content: string) =>
    apiClient
      .post<SingleResponse<TaskComment>>(`/tasks/${taskId}/comments`, { content })
      .then((r) => r.data.data),
};
