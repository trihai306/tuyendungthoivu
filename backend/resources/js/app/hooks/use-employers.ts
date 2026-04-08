import { createCrudHooks } from "./use-crud";
import { employersApi, type EmployerFilter } from "@/services/employers";
import type { EmployerProfile, UpdateEmployerProfileRequest } from "@/types";

// ---------------------------------------------------------------------------
// Base CRUD hooks via factory
// ---------------------------------------------------------------------------

const employerHooks = createCrudHooks<
  EmployerProfile,
  never,
  UpdateEmployerProfileRequest,
  EmployerFilter
>("employers", employersApi, {
  messages: {
    updateSuccess: "Cap nhat thong tin doanh nghiep thanh cong!",
    updateError: "Khong the cap nhat thong tin. Vui long thu lai.",
  },
});

export const useEmployers = employerHooks.useList;
export const useEmployer = employerHooks.useDetail;
export const useUpdateEmployerProfile = employerHooks.useUpdate;

export { employerHooks };
