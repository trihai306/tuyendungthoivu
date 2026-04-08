import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCrudHooks } from "./use-crud";
import {
  assignmentsApi,
  type AssignmentFilter,
} from "@/services/assignments.service";
import type {
  ApiError,
  Assignment,
  CreateAssignmentDto,
  UpdateAssignmentDto,
  BulkAssignDto,
  MessageResponse,
} from "@/types";

// ---------------------------------------------------------------------------
// Base CRUD hooks via factory
// ---------------------------------------------------------------------------

const assignmentHooks = createCrudHooks<
  Assignment,
  CreateAssignmentDto,
  UpdateAssignmentDto,
  AssignmentFilter
>("assignments", assignmentsApi, {
  messages: {
    createSuccess: "Phan cong lao dong thanh cong!",
    createError: "Khong the phan cong. Vui long thu lai.",
    updateSuccess: "Cap nhat phan cong thanh cong!",
    updateError: "Khong the cap nhat. Vui long thu lai.",
    deleteSuccess: "Da xoa phan cong.",
    deleteError: "Khong the xoa phan cong. Vui long thu lai.",
  },
  relatedKeys: [["staffing-orders"], ["workers-new"]],
});

export const useAssignments = assignmentHooks.useList;
export const useAssignment = assignmentHooks.useDetail;
export const useCreateAssignment = assignmentHooks.useCreate;
export const useUpdateAssignment = assignmentHooks.useUpdate;
export const useDeleteAssignment = assignmentHooks.useDelete;

// ---------------------------------------------------------------------------
// Custom hooks
// ---------------------------------------------------------------------------

/** Update an assignment's status */
export function useUpdateAssignmentStatus() {
  const qc = useQueryClient();
  return useMutation<
    Assignment,
    ApiError,
    { id: string; status: string; reason?: string }
  >({
    mutationFn: ({ id, ...data }) => assignmentsApi.updateStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assignments"] });
      qc.invalidateQueries({ queryKey: ["staffing-orders"] });
      toast.success("Cap nhat trang thai thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the cap nhat trang thai.");
    },
  });
}

/** Bulk assign multiple workers to an order */
export function useBulkAssign() {
  const qc = useQueryClient();
  return useMutation<
    { data: Assignment[]; message: string },
    ApiError,
    BulkAssignDto
  >({
    mutationFn: (data) => assignmentsApi.bulkAssign(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["assignments"] });
      qc.invalidateQueries({ queryKey: ["staffing-orders"] });
      qc.invalidateQueries({ queryKey: ["workers-new"] });
      toast.success(res.message ?? "Phan cong hang loat thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the phan cong hang loat.");
    },
  });
}

/** Remove a worker from an assignment */
export function useRemoveAssignment() {
  const qc = useQueryClient();
  return useMutation<MessageResponse, ApiError, string>({
    mutationFn: (id) => assignmentsApi.removeWorker(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assignments"] });
      qc.invalidateQueries({ queryKey: ["staffing-orders"] });
      toast.success("Da go lao dong khoi phan cong.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the go lao dong.");
    },
  });
}

export { assignmentHooks };
