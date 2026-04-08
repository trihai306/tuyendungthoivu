import { createCrudService } from "./base.service";
import type {
  Client,
  CreateClientDto,
  UpdateClientDto,
  QueryParams,
} from "@/types";

// ---------------------------------------------------------------------------
// Filter type
// ---------------------------------------------------------------------------

interface ClientFilter extends QueryParams {
  status?: string;
  city?: string;
  industry?: string;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

const crud = createCrudService<Client, CreateClientDto, UpdateClientDto, ClientFilter>(
  "/clients",
);

export const clientsApi = {
  ...crud,
};

export type { ClientFilter };
