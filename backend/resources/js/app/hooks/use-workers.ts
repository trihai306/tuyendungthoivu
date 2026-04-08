import { useMutation } from "@tanstack/react-query";
import { createCrudHooks } from "./use-crud";
import { workersApi, type WorkerFilter } from "@/services/workers";
import type {
  PaginatedResponse,
  UpdateWorkerProfileRequest,
  WorkerProfile,
} from "@/types";

// ---------------------------------------------------------------------------
// Base CRUD hooks via factory
// ---------------------------------------------------------------------------

const workerHooks = createCrudHooks<
  WorkerProfile,
  never,
  UpdateWorkerProfileRequest,
  WorkerFilter
>("workers", workersApi, {
  messages: {
    updateSuccess: "Cap nhat ho so thanh cong!",
    updateError: "Khong the cap nhat ho so. Vui long thu lai.",
  },
});

export const useWorkers = workerHooks.useList;
export const useWorker = workerHooks.useDetail;
export const useUpdateWorkerProfile = workerHooks.useUpdate;

// ---------------------------------------------------------------------------
// Extended hooks
// ---------------------------------------------------------------------------

export function useSearchWorkers(params?: WorkerFilter) {
  return createCrudHooks<WorkerProfile, never, UpdateWorkerProfileRequest, WorkerFilter>(
    "workers-search",
    { ...workersApi, list: workersApi.search },
  ).useList(params);
}

export function useExportWorkers() {
  return useMutation<Blob, Error, WorkerFilter | undefined>({
    mutationFn: (params) => workersApi.exportList(params),
  });
}

export { workerHooks };
