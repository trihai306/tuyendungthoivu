import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { jobsApi } from "@/services/jobs";
import type {
  ApiError,
  CreateJobPostRequest,
  JobFilter,
  UpdateJobPostRequest,
} from "@/types";

const JOBS_KEY = ["job-posts"] as const;

export function useJobs(filters?: JobFilter) {
  return useQuery({
    queryKey: [...JOBS_KEY, filters],
    queryFn: () => jobsApi.getJobs(filters),
  });
}

export function useJob(id: string | undefined) {
  return useQuery({
    queryKey: [...JOBS_KEY, id],
    queryFn: () => jobsApi.getJob(id!),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobPostRequest) => jobsApi.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_KEY });
      toast.success("Đăng tin tuyển dụng thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Không thể đăng tin. Vui lòng thử lại.");
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobPostRequest }) =>
      jobsApi.updateJob(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: JOBS_KEY });
      queryClient.invalidateQueries({ queryKey: [...JOBS_KEY, variables.id] });
      toast.success("Cập nhật tin tuyển dụng thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Không thể cập nhật tin. Vui lòng thử lại.");
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobsApi.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_KEY });
      toast.success("Đã xóa tin tuyển dụng.");
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Không thể xóa tin. Vui lòng thử lại.");
    },
  });
}
