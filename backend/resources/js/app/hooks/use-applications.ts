import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCrudHooks } from "./use-crud";
import { applicationsApi } from "@/services/applications";
import type {
  ApiError,
  Application,
  ApplicationFilter,
  CreateApplicationRequest,
  MessageResponse,
  PaginatedResponse,
  UpdateApplicationStatusRequest,
} from "@/types";

// ---------------------------------------------------------------------------
// Base CRUD hooks via factory
// ---------------------------------------------------------------------------

const applicationHooks = createCrudHooks<
  Application,
  CreateApplicationRequest,
  Partial<Application>,
  ApplicationFilter
>("applications", applicationsApi, {
  messages: {
    createSuccess: "Ung tuyen thanh cong!",
    createError: "Khong the ung tuyen. Vui long thu lai.",
    deleteSuccess: "Da rut don ung tuyen.",
    deleteError: "Khong the rut don. Vui long thu lai.",
  },
});

export const useApplications = applicationHooks.useList;
export const useApplication = applicationHooks.useDetail;
export const useCreateApplication = applicationHooks.useCreate;

// ---------------------------------------------------------------------------
// Extended hooks
// ---------------------------------------------------------------------------

const MY_APPLICATIONS_KEY = ["my-applications"] as const;

export function useMyApplications(params?: ApplicationFilter) {
  return useQuery<PaginatedResponse<Application>>({
    queryKey: [...MY_APPLICATIONS_KEY, params],
    queryFn: () => applicationsApi.getMyApplications(params),
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    Application,
    ApiError,
    { id: string; data: UpdateApplicationStatusRequest }
  >({
    mutationFn: ({ id, data }) => applicationsApi.updateApplicationStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationHooks.queryKey });
      queryClient.invalidateQueries({ queryKey: MY_APPLICATIONS_KEY });
      toast.success("Cap nhat trang thai don ung tuyen thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the cap nhat trang thai. Vui long thu lai.");
    },
  });
}

export function useBulkUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    MessageResponse,
    ApiError,
    { ids: string[]; status: string; notes?: string }
  >({
    mutationFn: ({ ids, status, notes }) =>
      applicationsApi.bulkUpdateStatus(ids, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationHooks.queryKey });
      queryClient.invalidateQueries({ queryKey: MY_APPLICATIONS_KEY });
      toast.success("Da cap nhat trang thai hang loat.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the cap nhat trang thai.");
    },
  });
}

export { applicationHooks };
