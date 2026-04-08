import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCrudHooks } from "./use-crud";
import { staffApi } from "@/services/staff";
import type {
  ApiError,
  CreateStaffRequest,
  Staff,
  StaffFilter,
  UpdateStaffRequest,
} from "@/types";

// ---------------------------------------------------------------------------
// Base CRUD hooks via factory
// ---------------------------------------------------------------------------

const staffHooks = createCrudHooks<Staff, CreateStaffRequest, UpdateStaffRequest, StaffFilter>(
  "staff",
  staffApi,
  {
    messages: {
      createSuccess: "Tao nhan vien thanh cong!",
      createError: "Khong the tao nhan vien. Vui long thu lai.",
      updateSuccess: "Cap nhat nhan vien thanh cong!",
      updateError: "Khong the cap nhat. Vui long thu lai.",
      deleteSuccess: "Da xoa nhan vien.",
      deleteError: "Khong the xoa nhan vien. Vui long thu lai.",
    },
  },
);

export const useStaffList = staffHooks.useList;
export const useStaffDetail = staffHooks.useDetail;
export const useCreateStaff = staffHooks.useCreate;
export const useUpdateStaff = staffHooks.useUpdate;
export const useDeleteStaff = staffHooks.useDelete;

// ---------------------------------------------------------------------------
// Extended hooks
// ---------------------------------------------------------------------------

export function useToggleStaffActive() {
  const queryClient = useQueryClient();

  return useMutation<Staff, ApiError, string>({
    mutationFn: (id) => staffApi.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffHooks.queryKey });
      toast.success("Da cap nhat trang thai hoat dong.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the cap nhat trang thai.");
    },
  });
}

export { staffHooks };
