import { apiClient } from "./api";
import type {
  KpiConfig,
  CreateKpiConfigDto,
  KpiPeriod,
  CreateKpiPeriodDto,
  KpiRecord,
  EvaluateKpiDto,
  KpiPeriodSummaryItem,
  UserKpiPeriodData,
  SingleResponse,
  QueryParams,
} from "@/types";

export const kpiApi = {
  // ── Configs ──────────────────────────────────────────────────────

  listConfigs: (params?: { active_only?: boolean; role?: string }) =>
    apiClient
      .get<{ data: KpiConfig[]; message: string }>("/kpi/configs", { params })
      .then((r) => r.data),

  createConfig: (data: CreateKpiConfigDto) =>
    apiClient
      .post<SingleResponse<KpiConfig>>("/kpi/configs", data)
      .then((r) => r.data.data),

  updateConfig: (id: string, data: Partial<CreateKpiConfigDto>) =>
    apiClient
      .put<SingleResponse<KpiConfig>>(`/kpi/configs/${id}`, data)
      .then((r) => r.data.data),

  deleteConfig: (id: string) =>
    apiClient.delete(`/kpi/configs/${id}`).then((r) => r.data),

  // ── Periods ──────────────────────────────────────────────────────

  listPeriods: (params?: QueryParams & { status?: string }) =>
    apiClient
      .get<{ data: { data: KpiPeriod[] }; message: string }>("/kpi/periods", { params })
      .then((r) => r.data),

  createPeriod: (data: CreateKpiPeriodDto) =>
    apiClient
      .post<{ data: KpiPeriod; records_created: number; message: string }>("/kpi/periods", data)
      .then((r) => r.data),

  showPeriod: (id: string) =>
    apiClient
      .get<{ data: KpiPeriod; summary: KpiPeriodSummaryItem[]; message: string }>(`/kpi/periods/${id}`)
      .then((r) => r.data),

  closePeriod: (id: string) =>
    apiClient
      .post<SingleResponse<KpiPeriod>>(`/kpi/periods/${id}/close`)
      .then((r) => r.data.data),

  autoCalculate: (id: string) =>
    apiClient
      .post<{ updated: number; message: string }>(`/kpi/periods/${id}/auto-calculate`)
      .then((r) => r.data),

  // ── Records ──────────────────────────────────────────────────────

  listRecords: (params?: { period_id?: string; user_id?: string; per_page?: number }) =>
    apiClient
      .get<{ data: { data: KpiRecord[] }; message: string }>("/kpi/records", { params })
      .then((r) => r.data),

  evaluate: (id: string, data: EvaluateKpiDto) =>
    apiClient
      .post<SingleResponse<KpiRecord>>(`/kpi/records/${id}/evaluate`, data)
      .then((r) => r.data.data),

  // ── User Summary ─────────────────────────────────────────────────

  userSummary: (userId: string) =>
    apiClient
      .get<{ data: UserKpiPeriodData[]; message: string }>(`/kpi/users/${userId}/summary`)
      .then((r) => r.data),
};
