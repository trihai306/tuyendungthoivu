import { createCrudService } from "./base.service";
import { apiClient } from "./api";
import type {
  InvoiceNew,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  RecordPaymentDto,
  QueryParams,
  SingleResponse,
} from "@/types";

// ---------------------------------------------------------------------------
// Filter type
// ---------------------------------------------------------------------------

interface InvoiceNewFilter extends QueryParams {
  client_id?: string;
  status?: string;
  due_date_from?: string;
  due_date_to?: string;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

const crud = createCrudService<
  InvoiceNew,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceNewFilter
>("/invoices-new");

export const invoicesNewApi = {
  ...crud,

  /** Send the invoice to the client */
  send: (id: string) =>
    apiClient
      .post<SingleResponse<InvoiceNew>>(`/invoices-new/${id}/send`)
      .then((r) => r.data.data),

  /** Record a payment against this invoice */
  recordPayment: (id: string, data: RecordPaymentDto) =>
    apiClient
      .post<SingleResponse<InvoiceNew>>(`/invoices-new/${id}/payment`, data)
      .then((r) => r.data.data),

  /** Duplicate an invoice */
  duplicate: (id: string) =>
    apiClient
      .post<SingleResponse<InvoiceNew>>(`/invoices-new/${id}/duplicate`)
      .then((r) => r.data.data),
};

export type { InvoiceNewFilter };
