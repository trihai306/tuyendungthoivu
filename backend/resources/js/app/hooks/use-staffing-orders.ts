import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCrudHooks } from "./use-crud";
import {
  staffingOrdersApi,
  type StaffingOrderFilter,
} from "@/services/staffing-orders.service";
import type {
  ApiError,
  StaffingOrder,
  CreateStaffingOrderDto,
  UpdateStaffingOrderDto,
} from "@/types";

// ---------------------------------------------------------------------------
// Base CRUD hooks via factory
// ---------------------------------------------------------------------------

const orderHooks = createCrudHooks<
  StaffingOrder,
  CreateStaffingOrderDto,
  UpdateStaffingOrderDto,
  StaffingOrderFilter
>("staffing-orders", staffingOrdersApi, {
  messages: {
    createSuccess: "Tao don hang thanh cong!",
    createError: "Khong the tao don hang. Vui long thu lai.",
    updateSuccess: "Cap nhat don hang thanh cong!",
    updateError: "Khong the cap nhat. Vui long thu lai.",
    deleteSuccess: "Da xoa don hang.",
    deleteError: "Khong the xoa don hang. Vui long thu lai.",
  },
  relatedKeys: [["clients"]],
});

export const useStaffingOrders = orderHooks.useList;
export const useStaffingOrder = orderHooks.useDetail;
export const useCreateStaffingOrder = orderHooks.useCreate;
export const useUpdateStaffingOrder = orderHooks.useUpdate;
export const useDeleteStaffingOrder = orderHooks.useDelete;

// ---------------------------------------------------------------------------
// Custom hooks
// ---------------------------------------------------------------------------

/** Approve a pending staffing order */
export function useApproveOrder() {
  const qc = useQueryClient();
  return useMutation<StaffingOrder, ApiError, string>({
    mutationFn: (id) => staffingOrdersApi.approve(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staffing-orders"] });
      toast.success("Duyet don hang thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the duyet don hang.");
    },
  });
}

/** Assign a recruiter to a staffing order */
export function useAssignRecruiter() {
  const qc = useQueryClient();
  return useMutation<
    StaffingOrder,
    ApiError,
    { id: string; user_id: string }
  >({
    mutationFn: ({ id, user_id }) =>
      staffingOrdersApi.assign(id, { user_id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staffing-orders"] });
      toast.success("Phan cong recruiter thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the phan cong recruiter.");
    },
  });
}

/** Update the status of a staffing order */
export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation<
    StaffingOrder,
    ApiError,
    { id: string; status: string; reason?: string }
  >({
    mutationFn: ({ id, ...data }) =>
      staffingOrdersApi.updateStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staffing-orders"] });
      toast.success("Cap nhat trang thai thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the cap nhat trang thai.");
    },
  });
}

export { orderHooks };
