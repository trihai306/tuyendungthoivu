import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { applicationsApi } from "@/services/applications";
import type {
  ApiError,
  ApplicationFilter,
  CreateApplicationRequest,
  UpdateApplicationStatusRequest,
} from "@/types";

const APPLICATIONS_KEY = ["applications"] as const;
const MY_APPLICATIONS_KEY = ["my-applications"] as const;

export function useApplications(params?: ApplicationFilter) {
  return useQuery({
    queryKey: [...APPLICATIONS_KEY, params],
    queryFn: () => applicationsApi.getApplications(params),
  });
}

export function useMyApplications(params?: ApplicationFilter) {
  return useQuery({
    queryKey: [...MY_APPLICATIONS_KEY, params],
    queryFn: () => applicationsApi.getMyApplications(params),
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApplicationRequest) =>
      applicationsApi.createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: MY_APPLICATIONS_KEY });
      toast.success("Ứng tuyển thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Không thể ứng tuyển. Vui lòng thử lại.");
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateApplicationStatusRequest;
    }) => applicationsApi.updateApplicationStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: MY_APPLICATIONS_KEY });
      toast.success("Cập nhật trạng thái đơn ứng tuyển thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.message ?? "Không thể cập nhật trạng thái. Vui lòng thử lại.",
      );
    },
  });
}
