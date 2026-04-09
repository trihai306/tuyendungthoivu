// Common types used across the application

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
  path: string;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

// ---------------------------------------------------------------------------
// API Errors
// ---------------------------------------------------------------------------

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

// ---------------------------------------------------------------------------
// Query / Filter helpers
// ---------------------------------------------------------------------------

export interface SelectOption {
  label: string;
  value: string;
}

export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

/**
 * Generic query parameters accepted by all list endpoints.
 * Module-specific filters extend this interface.
 */
export interface QueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_direction?: SortDirection;
  [key: string]: unknown;
}

/**
 * Standard single-resource response wrapper from the API.
 */
export interface SingleResponse<T> {
  data: T;
}

/**
 * Standard message-only response (delete, bulk actions, etc.)
 */
export interface MessageResponse {
  message: string;
}

// ---------------------------------------------------------------------------
// CRUD Service types (used by base.service.ts factory)
// ---------------------------------------------------------------------------

/**
 * Describes the shape of a generic CRUD service.
 * Module services extend this with additional methods.
 */
export interface CrudService<
  TEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TEntity>,
  TFilter extends QueryParams = QueryParams,
> {
  list: (params?: TFilter) => Promise<PaginatedResponse<TEntity>>;
  show: (id: string) => Promise<TEntity>;
  create: (data: TCreateDto) => Promise<TEntity>;
  update: (id: string, data: TUpdateDto) => Promise<TEntity>;
  remove: (id: string) => Promise<MessageResponse>;
  bulkDelete: (ids: string[]) => Promise<MessageResponse>;
}

// ---------------------------------------------------------------------------
// Re-export all types from submodules
// ---------------------------------------------------------------------------

export * from "./user";
export * from "./job";
export * from "./application";
export * from "./notification";
export * from "./task";
export * from "./staff";
export * from "./rbac";
export * from "./report";
export * from "./staffing";
export * from "./kpi";
