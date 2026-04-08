import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { usersApi } from "@/services/users";
import type {
  ApiError,
  UpdateEmployerProfileRequest,
  UpdateWorkerProfileRequest,
} from "@/types";

const WORKERS_KEY = ["workers"] as const;
const EMPLOYERS_KEY = ["employers"] as const;

export function useWorkers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...WORKERS_KEY, params],
    queryFn: () => usersApi.getWorkers(params),
  });
}

export function useWorker(id: string | undefined) {
  return useQuery({
    queryKey: [...WORKERS_KEY, id],
    queryFn: () => usersApi.getWorker(id!),
    enabled: !!id,
  });
}

export function useEmployers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...EMPLOYERS_KEY, params],
    queryFn: () => usersApi.getEmployers(params),
  });
}

export function useEmployer(id: string | undefined) {
  return useQuery({
    queryKey: [...EMPLOYERS_KEY, id],
    queryFn: () => usersApi.getEmployer(id!),
    enabled: !!id,
  });
}

export function useUpdateWorkerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkerProfileRequest }) =>
      usersApi.updateWorkerProfile(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: WORKERS_KEY });
      queryClient.invalidateQueries({
        queryKey: [...WORKERS_KEY, variables.id],
      });
      toast.success("Cập nhật hồ sơ thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Không thể cập nhật hồ sơ. Vui lòng thử lại.");
    },
  });
}

export function useUpdateEmployerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateEmployerProfileRequest;
    }) => usersApi.updateEmployerProfile(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: EMPLOYERS_KEY });
      queryClient.invalidateQueries({
        queryKey: [...EMPLOYERS_KEY, variables.id],
      });
      toast.success("Cập nhật thông tin doanh nghiệp thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.message ?? "Không thể cập nhật thông tin. Vui lòng thử lại.",
      );
    },
  });
}
