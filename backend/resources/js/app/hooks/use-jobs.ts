import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCrudHooks } from "./use-crud";
import { jobsApi } from "@/services/jobs";
import type {
  ApiError,
  CreateJobPostRequest,
  JobFilter,
  JobPost,
  MessageResponse,
  UpdateJobPostRequest,
} from "@/types";

// ---------------------------------------------------------------------------
// Base CRUD hooks via factory
// ---------------------------------------------------------------------------

const jobHooks = createCrudHooks<JobPost, CreateJobPostRequest, UpdateJobPostRequest, JobFilter>(
  "job-posts",
  jobsApi,
  {
    messages: {
      createSuccess: "Dang tin tuyen dung thanh cong!",
      createError: "Khong the dang tin. Vui long thu lai.",
      updateSuccess: "Cap nhat tin tuyen dung thanh cong!",
      updateError: "Khong the cap nhat tin. Vui long thu lai.",
      deleteSuccess: "Da xoa tin tuyen dung.",
      deleteError: "Khong the xoa tin. Vui long thu lai.",
    },
  },
);

// Re-export with familiar names
export const useJobs = jobHooks.useList;
export const useJob = jobHooks.useDetail;
export const useCreateJob = jobHooks.useCreate;
export const useUpdateJob = jobHooks.useUpdate;
export const useDeleteJob = jobHooks.useDelete;
export const useBulkDeleteJobs = jobHooks.useBulkDelete;

// ---------------------------------------------------------------------------
// Extended hooks (module-specific)
// ---------------------------------------------------------------------------

export function useChangeJobStatus() {
  const queryClient = useQueryClient();

  return useMutation<JobPost, ApiError, { id: string; status: string }>({
    mutationFn: ({ id, status }) => jobsApi.changeStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobHooks.queryKey });
      toast.success("Da cap nhat trang thai tin tuyen dung.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the cap nhat trang thai.");
    },
  });
}

export function useDuplicateJob() {
  const queryClient = useQueryClient();

  return useMutation<JobPost, ApiError, string>({
    mutationFn: (id) => jobsApi.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobHooks.queryKey });
      toast.success("Da sao chep tin tuyen dung.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the sao chep tin.");
    },
  });
}

export function useBulkChangeJobStatus() {
  const queryClient = useQueryClient();

  return useMutation<MessageResponse, ApiError, { ids: string[]; status: string }>({
    mutationFn: ({ ids, status }) => jobsApi.bulkChangeStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobHooks.queryKey });
      toast.success("Da cap nhat trang thai hang loat.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the cap nhat trang thai.");
    },
  });
}

export { jobHooks };
