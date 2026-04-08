import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCrudHooks } from "./use-crud";
import {
  invoicesNewApi,
  type InvoiceNewFilter,
} from "@/services/invoices-new.service";
import type {
  ApiError,
  InvoiceNew,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  RecordPaymentDto,
} from "@/types";

// ---------------------------------------------------------------------------
// Base CRUD hooks via factory
// ---------------------------------------------------------------------------

const invoiceNewHooks = createCrudHooks<
  InvoiceNew,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceNewFilter
>("invoices-new", invoicesNewApi, {
  messages: {
    createSuccess: "Tao hoa don thanh cong!",
    createError: "Khong the tao hoa don. Vui long thu lai.",
    updateSuccess: "Cap nhat hoa don thanh cong!",
    updateError: "Khong the cap nhat. Vui long thu lai.",
    deleteSuccess: "Da xoa hoa don.",
    deleteError: "Khong the xoa hoa don. Vui long thu lai.",
  },
  relatedKeys: [["clients"], ["payments"]],
});

export const useInvoicesNew = invoiceNewHooks.useList;
export const useInvoiceNew = invoiceNewHooks.useDetail;
export const useCreateInvoice = invoiceNewHooks.useCreate;
export const useUpdateInvoice = invoiceNewHooks.useUpdate;
export const useDeleteInvoice = invoiceNewHooks.useDelete;

// ---------------------------------------------------------------------------
// Custom hooks
// ---------------------------------------------------------------------------

/** Send the invoice to the client */
export function useSendInvoice() {
  const qc = useQueryClient();
  return useMutation<InvoiceNew, ApiError, string>({
    mutationFn: (id) => invoicesNewApi.send(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices-new"] });
      toast.success("Da gui hoa don cho khach hang!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the gui hoa don.");
    },
  });
}

/** Record a payment against an invoice */
export function useRecordInvoicePayment() {
  const qc = useQueryClient();
  return useMutation<
    InvoiceNew,
    ApiError,
    { id: string; data: RecordPaymentDto }
  >({
    mutationFn: ({ id, data }) => invoicesNewApi.recordPayment(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices-new"] });
      qc.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Ghi nhan thanh toan thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the ghi nhan thanh toan.");
    },
  });
}

/** Duplicate an invoice */
export function useDuplicateInvoice() {
  const qc = useQueryClient();
  return useMutation<InvoiceNew, ApiError, string>({
    mutationFn: (id) => invoicesNewApi.duplicate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices-new"] });
      toast.success("Nhan ban hoa don thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the nhan ban hoa don.");
    },
  });
}

export { invoiceNewHooks };
