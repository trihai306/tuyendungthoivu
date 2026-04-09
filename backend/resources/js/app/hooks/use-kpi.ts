import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { kpiApi } from "@/services/kpi.service";
import type { CreateKpiConfigDto, CreateKpiPeriodDto, EvaluateKpiDto } from "@/types";
import { toast } from "sonner";

const KEYS = {
  configs: ["kpi-configs"] as const,
  periods: ["kpi-periods"] as const,
  period: (id: string) => ["kpi-period", id] as const,
  records: (params: Record<string, unknown>) => ["kpi-records", params] as const,
  userSummary: (userId: string) => ["kpi-user-summary", userId] as const,
};

// ── Configs ──────────────────────────────────────────────────────

export function useKpiConfigs(params?: { active_only?: boolean; role?: string }) {
  return useQuery({
    queryKey: [...KEYS.configs, params],
    queryFn: () => kpiApi.listConfigs(params),
  });
}

export function useCreateKpiConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateKpiConfigDto) => kpiApi.createConfig(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.configs });
      toast.success("Tạo chỉ số KPI thành công");
    },
    onError: () => toast.error("Lỗi khi tạo chỉ số KPI"),
  });
}

export function useUpdateKpiConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateKpiConfigDto> }) =>
      kpiApi.updateConfig(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.configs });
      toast.success("Cập nhật chỉ số KPI thành công");
    },
    onError: () => toast.error("Lỗi khi cập nhật chỉ số KPI"),
  });
}

export function useDeleteKpiConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => kpiApi.deleteConfig(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.configs });
      toast.success("Xóa chỉ số KPI thành công");
    },
    onError: () => toast.error("Lỗi khi xóa chỉ số KPI"),
  });
}

// ── Periods ──────────────────────────────────────────────────────

export function useKpiPeriods(params?: { status?: string }) {
  return useQuery({
    queryKey: [...KEYS.periods, params],
    queryFn: () => kpiApi.listPeriods(params),
  });
}

export function useKpiPeriod(id: string) {
  return useQuery({
    queryKey: KEYS.period(id),
    queryFn: () => kpiApi.showPeriod(id),
    enabled: !!id,
  });
}

export function useCreateKpiPeriod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateKpiPeriodDto) => kpiApi.createPeriod(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: KEYS.periods });
      toast.success(res.message);
    },
    onError: () => toast.error("Lỗi khi tạo kỳ đánh giá"),
  });
}

export function useCloseKpiPeriod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => kpiApi.closePeriod(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.periods });
      toast.success("Đóng kỳ đánh giá thành công");
    },
    onError: () => toast.error("Lỗi khi đóng kỳ đánh giá"),
  });
}

export function useAutoCalculateKpi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => kpiApi.autoCalculate(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: KEYS.periods });
      toast.success(res.message);
    },
    onError: () => toast.error("Lỗi khi tự động tính KPI"),
  });
}

// ── Records ──────────────────────────────────────────────────────

export function useKpiRecords(params: { period_id?: string; user_id?: string; per_page?: number }) {
  return useQuery({
    queryKey: KEYS.records(params),
    queryFn: () => kpiApi.listRecords(params),
    enabled: !!(params.period_id || params.user_id),
  });
}

export function useEvaluateKpi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EvaluateKpiDto }) =>
      kpiApi.evaluate(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kpi-records"] });
      qc.invalidateQueries({ queryKey: ["kpi-period"] });
      toast.success("Cập nhật đánh giá thành công");
    },
    onError: () => toast.error("Lỗi khi cập nhật đánh giá"),
  });
}

// ── User Summary ─────────────────────────────────────────────────

export function useUserKpiSummary(userId: string) {
  return useQuery({
    queryKey: KEYS.userSummary(userId),
    queryFn: () => kpiApi.userSummary(userId),
    enabled: !!userId,
  });
}
