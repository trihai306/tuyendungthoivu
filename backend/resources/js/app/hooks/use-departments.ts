import { createCrudHooks } from "./use-crud";
import { departmentsApi } from "@/services/departments";
import type {
  CreateDepartmentRequest,
  Department,
  DepartmentFilter,
  UpdateDepartmentRequest,
} from "@/types";

// ---------------------------------------------------------------------------
// Base CRUD hooks via factory
// ---------------------------------------------------------------------------

const departmentHooks = createCrudHooks<
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  DepartmentFilter
>("departments", departmentsApi, {
  messages: {
    createSuccess: "Tao phong ban thanh cong!",
    createError: "Khong the tao phong ban. Vui long thu lai.",
    updateSuccess: "Cap nhat phong ban thanh cong!",
    updateError: "Khong the cap nhat phong ban. Vui long thu lai.",
    deleteSuccess: "Da xoa phong ban.",
    deleteError: "Khong the xoa phong ban. Vui long thu lai.",
  },
});

export const useDepartments = departmentHooks.useList;
export const useDepartment = departmentHooks.useDetail;
export const useCreateDepartment = departmentHooks.useCreate;
export const useUpdateDepartment = departmentHooks.useUpdate;
export const useDeleteDepartment = departmentHooks.useDelete;

export { departmentHooks };
