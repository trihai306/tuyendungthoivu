import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { staffPayrollApi, type StaffPayrollFilter } from "@/services/staff-payroll.service";
import type { CalculateStaffPayrollDto, BulkCalculateStaffPayrollDto, CreateSalaryConfigDto } from "@/types";
import { toast } from "sonner";

const KEYS = {
  list: (params: StaffPayrollFilter) => ["staff-payrolls", params] as const,
  detail: (id: string) => ["staff-payroll", id] as const,
  salaryConfigs: (userId?: string) => ["salary-configs", userId] as const,
};

// ── Salary Configs ──────────────────────────────────────────────

export function useSalaryConfigs(userId?: string) {
  return useQuery({
    queryKey: KEYS.salaryConfigs(userId),
    queryFn: () => staffPayrollApi.listSalaryConfigs(userId ? { user_id: userId } : undefined),
  });
}

export function useCreateSalaryConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSalaryConfigDto) => staffPayrollApi.createSalaryConfig(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["salary-configs"] });
      toast.success("Tạo cấu hình lương thành công");
    },
    onError: () => toast.error("Lỗi khi tạo cấu hình lương"),
  });
}

export function useUpdateSalaryConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSalaryConfigDto> }) =>
      staffPayrollApi.updateSalaryConfig(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["salary-configs"] });
      toast.success("Cập nhật cấu hình lương thành công");
    },
    onError: () => toast.error("Lỗi khi cập nhật cấu hình lương"),
  });
}

// ── Payroll ─────────────────────────────────────────────────────

export function useStaffPayrolls(params: StaffPayrollFilter) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => staffPayrollApi.list(params),
  });
}

export function useStaffPayrollDetail(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => staffPayrollApi.show(id),
    enabled: !!id,
  });
}

export function useCalculateStaffPayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CalculateStaffPayrollDto) => staffPayrollApi.calculate(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff-payrolls"] });
      toast.success("Tính lương thành công");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? "Lỗi khi tính lương"),
  });
}

export function useBulkCalculateStaffPayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: BulkCalculateStaffPayrollDto) => staffPayrollApi.bulkCalculate(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["staff-payrolls"] });
      toast.success(res.message);
    },
    onError: () => toast.error("Lỗi khi tính lương hàng loạt"),
  });
}

export function useReviewStaffPayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffPayrollApi.review(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff-payrolls"] });
      qc.invalidateQueries({ queryKey: ["staff-payroll"] });
      toast.success("Kiểm tra bảng lương thành công");
    },
    onError: () => toast.error("Lỗi khi kiểm tra bảng lương"),
  });
}

export function useApproveStaffPayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffPayrollApi.approve(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff-payrolls"] });
      qc.invalidateQueries({ queryKey: ["staff-payroll"] });
      toast.success("Duyệt bảng lương thành công");
    },
    onError: () => toast.error("Lỗi khi duyệt bảng lương"),
  });
}

export function usePayStaffPayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: { payment_method?: string; payment_reference?: string } }) =>
      staffPayrollApi.markPaid(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff-payrolls"] });
      qc.invalidateQueries({ queryKey: ["staff-payroll"] });
      toast.success("Thanh toán lương thành công");
    },
    onError: () => toast.error("Lỗi khi thanh toán lương"),
  });
}

export function useBulkApproveStaffPayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payrollIds: string[]) => staffPayrollApi.bulkApprove(payrollIds),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["staff-payrolls"] });
      toast.success(res.message);
    },
    onError: () => toast.error("Lỗi khi duyệt hàng loạt"),
  });
}

export function useBulkPayStaffPayroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ payrollIds, paymentMethod }: { payrollIds: string[]; paymentMethod?: string }) =>
      staffPayrollApi.bulkPay(payrollIds, paymentMethod),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["staff-payrolls"] });
      toast.success(res.message);
    },
    onError: () => toast.error("Lỗi khi thanh toán hàng loạt"),
  });
}
