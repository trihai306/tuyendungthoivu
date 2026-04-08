import { createCrudHooks } from "./use-crud";
import { clientsApi, type ClientFilter } from "@/services/clients.service";
import type { Client, CreateClientDto, UpdateClientDto } from "@/types";

// ---------------------------------------------------------------------------
// Base CRUD hooks via factory
// ---------------------------------------------------------------------------

const clientHooks = createCrudHooks<
  Client,
  CreateClientDto,
  UpdateClientDto,
  ClientFilter
>("clients", clientsApi, {
  messages: {
    createSuccess: "Tao khach hang thanh cong!",
    createError: "Khong the tao khach hang. Vui long thu lai.",
    updateSuccess: "Cap nhat khach hang thanh cong!",
    updateError: "Khong the cap nhat. Vui long thu lai.",
    deleteSuccess: "Da xoa khach hang.",
    deleteError: "Khong the xoa khach hang. Vui long thu lai.",
  },
});

export const useClients = clientHooks.useList;
export const useClient = clientHooks.useDetail;
export const useCreateClient = clientHooks.useCreate;
export const useUpdateClient = clientHooks.useUpdate;
export const useDeleteClient = clientHooks.useDelete;
export const useBulkDeleteClients = clientHooks.useBulkDelete;

export { clientHooks };
