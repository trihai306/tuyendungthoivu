import { createCrudService } from "./base.service";
import type {
  EmployerProfile,
  QueryParams,
  UpdateEmployerProfileRequest,
} from "@/types";

interface EmployerFilter extends QueryParams {
  city?: string;
  industry?: string;
  verified?: boolean;
}

const crud = createCrudService<EmployerProfile, never, UpdateEmployerProfileRequest, EmployerFilter>(
  "/employers",
);

export const employersApi = {
  ...crud,

  // ----- Legacy aliases -----
  getEmployers: crud.list,
  getEmployer: crud.show,
  updateEmployerProfile: crud.update,
};

export type { EmployerFilter };
