import { createCrudService } from "./base.service";
import type {
  CreateDepartmentRequest,
  Department,
  DepartmentFilter,
  UpdateDepartmentRequest,
} from "@/types";

const crud = createCrudService<
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  DepartmentFilter
>("/departments");

export const departmentsApi = {
  ...crud,
};
