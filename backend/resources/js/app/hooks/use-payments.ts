import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { paymentsApi, type PaymentFilter } from "@/services/payments.service";
import type {
  ApiError,
  Payment,
  CreatePaymentDto,
  PaginatedResponse,
} from "@/types";

// ---------------------------------------------------------------------------
// Query hooks
// ---------------------------------------------------------------------------

const QUERY_KEY = "payments";

/** List payments with filters */
export function usePayments(params?: PaymentFilter) {
  return useQuery<PaginatedResponse<Payment>>({
    queryKey: [QUERY_KEY, params],
    queryFn: () => paymentsApi.list(params),
  });
}

// ---------------------------------------------------------------------------
// Mutation hooks
// ---------------------------------------------------------------------------

/** Record a new payment */
export function useCreatePayment() {
  const qc = useQueryClient();
  return useMutation<Payment, ApiError, CreatePaymentDto>({
    mutationFn: (data) => paymentsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      qc.invalidateQueries({ queryKey: ["invoices-new"] });
      qc.invalidateQueries({ queryKey: ["payrolls-new"] });
      toast.success("Ghi nhan thanh toan thanh cong!");
    },
    onError: (error) => {
      toast.error(error.message ?? "Khong the ghi nhan thanh toan.");
    },
  });
}
