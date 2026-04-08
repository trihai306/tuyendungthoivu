import { apiClient } from "./api";
import type {
  Payment,
  CreatePaymentDto,
  PaginatedResponse,
  SingleResponse,
  QueryParams,
} from "@/types";

// ---------------------------------------------------------------------------
// Filter type
// ---------------------------------------------------------------------------

interface PaymentFilter extends QueryParams {
  payable_type?: "invoice" | "payroll";
  payment_method?: string;
  date_from?: string;
  date_to?: string;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const paymentsApi = {
  /** List payments with filters */
  list: (params?: PaymentFilter) =>
    apiClient
      .get<PaginatedResponse<Payment>>("/payments", { params })
      .then((r) => r.data),

  /** Record a new payment */
  create: (data: CreatePaymentDto) =>
    apiClient
      .post<SingleResponse<Payment>>("/payments", data)
      .then((r) => r.data.data),
};

export type { PaymentFilter };
