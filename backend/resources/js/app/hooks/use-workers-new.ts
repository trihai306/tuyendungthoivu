import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCrudHooks } from "./use-crud";
import {
  workersNewApi,
  type WorkerNewFilter,
} from "@/services/workers-new.service";
import type {
  ApiError,
  WorkerNew,
  CreateWorkerNewDto,
  UpdateWorkerNewDto,
} from "@/types";

// ---------------------------------------------------------------------------
// Base CRUD hooks via factory
// ---------------------------------------------------------------------------

const workerNewHooks = createCrudHooks<
  WorkerNew,
  CreateWorkerNewDto,
  UpdateWorkerNewDto,
  WorkerNewFilter
>("workers-new", workersNewApi, {
  messages: {
    createSuccess: "Tao ho so lao dong thanh cong!",
    createError: "Khong the tao ho so. Vui long thu lai.",
    updateSuccess: "Cap nhat ho so thanh cong!",
    updateError: "Khong the cap nhat. Vui long thu lai.",
    deleteSuccess: "Da xoa ho so lao dong.",
    deleteError: "Khong the xoa ho so. Vui long thu lai.",
  },
});

export const useWorkersNew = workerNewHooks.useList;
export const useWorkerNew = workerNewHooks.useDetail;
export const useCreateWorkerNew = workerNewHooks.useCreate;
export const useUpdateWorkerNew = workerNewHooks.useUpdate;
export const useDeleteWorkerNew = workerNewHooks.useDelete;
export const useBulkDeleteWorkersNew = workerNewHooks.useBulkDelete;

// ---------------------------------------------------------------------------
// Custom hooks
// ---------------------------------------------------------------------------

/** Update a worker's status (available / assigned / inactive / blacklisted) */
export function useUpdateWorkerStatus() {
  const qc = useQueryClient();
  return useMutation<
    WorkerNew,
    ApiError,
    { id: string; status: string; reason?: string }
  >({
    mutationFn: ({ id, ...data }) => workersNewApi.updateStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["workers-new"] });
      toast.success("Cap nhat trang thai thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the cap nhat trang thai.");
    },
  });
}

/** Assign a staff member to manage a worker */
export function useAssignStaff() {
  const qc = useQueryClient();
  return useMutation<
    WorkerNew,
    ApiError,
    { id: string; staff_id: string }
  >({
    mutationFn: ({ id, staff_id }) =>
      workersNewApi.assignStaff(id, { staff_id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["workers-new"] });
      toast.success("Phan cong nhan vien quan ly thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the phan cong.");
    },
  });
}

export { workerNewHooks };
