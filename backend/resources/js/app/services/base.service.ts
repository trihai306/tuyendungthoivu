import { apiClient } from "./api";
import type {
  CrudService,
  MessageResponse,
  PaginatedResponse,
  QueryParams,
  SingleResponse,
} from "@/types";

/**
 * Factory that creates a type-safe CRUD service for any API resource.
 *
 * Usage:
 * ```ts
 * const jobService = createCrudService<JobPost, CreateJobPostRequest, UpdateJobPostRequest>("/job-posts");
 * ```
 *
 * The returned object contains the standard CRUD methods (list, show, create, update, remove, bulkDelete).
 * Module services spread this object and add custom methods on top.
 */
export function createCrudService<
  TEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TEntity>,
  TFilter extends QueryParams = QueryParams,
>(resource: string): CrudService<TEntity, TCreateDto, TUpdateDto, TFilter> {
  // Ensure resource starts with /
  const base = resource.startsWith("/") ? resource : `/${resource}`;

  return {
    list: (params?: TFilter) =>
      apiClient
        .get<PaginatedResponse<TEntity>>(base, { params })
        .then((r) => r.data),

    show: (id: string) =>
      apiClient
        .get<SingleResponse<TEntity>>(`${base}/${id}`)
        .then((r) => r.data.data),

    create: (data: TCreateDto) =>
      apiClient
        .post<SingleResponse<TEntity>>(base, data)
        .then((r) => r.data.data),

    update: (id: string, data: TUpdateDto) =>
      apiClient
        .put<SingleResponse<TEntity>>(`${base}/${id}`, data)
        .then((r) => r.data.data),

    remove: (id: string) =>
      apiClient
        .delete<MessageResponse>(`${base}/${id}`)
        .then((r) => r.data),

    bulkDelete: (ids: string[]) =>
      apiClient
        .post<MessageResponse>(`${base}/bulk-delete`, { ids })
        .then((r) => r.data),
  };
}
