import {
  type QueryKey,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  ApiError,
  CrudService,
  MessageResponse,
  PaginatedResponse,
  QueryParams,
} from "@/types";

// ---------------------------------------------------------------------------
// Configuration for the factory
// ---------------------------------------------------------------------------

interface CrudHookMessages {
  createSuccess?: string;
  createError?: string;
  updateSuccess?: string;
  updateError?: string;
  deleteSuccess?: string;
  deleteError?: string;
}

interface CreateCrudHooksOptions {
  /** Vietnamese-friendly messages shown via toast */
  messages?: CrudHookMessages;
  /** Additional query keys to invalidate on mutation success */
  relatedKeys?: QueryKey[];
}

// ---------------------------------------------------------------------------
// Return type of the factory
// ---------------------------------------------------------------------------

interface CrudHooks<
  TEntity,
  TCreateDto,
  TUpdateDto,
  TFilter extends QueryParams,
> {
  /** Paginated list with optional filters */
  useList: (
    filters?: TFilter,
    options?: Partial<UseQueryOptions<PaginatedResponse<TEntity>>>,
  ) => ReturnType<typeof useQuery<PaginatedResponse<TEntity>>>;

  /** Single entity by ID */
  useDetail: (
    id: string | undefined,
    options?: Partial<UseQueryOptions<TEntity>>,
  ) => ReturnType<typeof useQuery<TEntity>>;

  /** Create mutation */
  useCreate: () => ReturnType<typeof useMutation<TEntity, ApiError, TCreateDto>>;

  /** Update mutation (receives { id, data }) */
  useUpdate: () => ReturnType<
    typeof useMutation<TEntity, ApiError, { id: string; data: TUpdateDto }>
  >;

  /** Delete mutation (receives id) */
  useDelete: () => ReturnType<typeof useMutation<MessageResponse, ApiError, string>>;

  /** Bulk delete mutation (receives ids[]) */
  useBulkDelete: () => ReturnType<
    typeof useMutation<MessageResponse, ApiError, string[]>
  >;

  /** The base query key for manual invalidation */
  queryKey: readonly string[];
}

// ---------------------------------------------------------------------------
// Factory function
// ---------------------------------------------------------------------------

const DEFAULT_MESSAGES: Required<CrudHookMessages> = {
  createSuccess: "Tao moi thanh cong!",
  createError: "Khong the tao moi. Vui long thu lai.",
  updateSuccess: "Cap nhat thanh cong!",
  updateError: "Khong the cap nhat. Vui long thu lai.",
  deleteSuccess: "Da xoa thanh cong.",
  deleteError: "Khong the xoa. Vui long thu lai.",
};

/**
 * Factory that creates a full set of TanStack Query hooks for a CRUD service.
 *
 * Usage:
 * ```ts
 * const jobHooks = createCrudHooks("job-posts", jobsApi, {
 *   messages: { createSuccess: "Dang tin tuyen dung thanh cong!" },
 * });
 * export const useJobs = jobHooks.useList;
 * export const useJob = jobHooks.useDetail;
 * ```
 */
export function createCrudHooks<
  TEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TEntity>,
  TFilter extends QueryParams = QueryParams,
>(
  queryKeyBase: string,
  service: CrudService<TEntity, TCreateDto, TUpdateDto, TFilter>,
  options?: CreateCrudHooksOptions,
): CrudHooks<TEntity, TCreateDto, TUpdateDto, TFilter> {
  const baseKey = [queryKeyBase] as const;
  const msgs = { ...DEFAULT_MESSAGES, ...options?.messages };
  const relatedKeys = options?.relatedKeys ?? [];

  // Helper to invalidate all related queries
  function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
    queryClient.invalidateQueries({ queryKey: baseKey });
    for (const key of relatedKeys) {
      queryClient.invalidateQueries({ queryKey: key });
    }
  }

  return {
    queryKey: baseKey,

    useList(filters?, queryOptions?) {
      return useQuery({
        queryKey: [...baseKey, filters] as QueryKey,
        queryFn: () => service.list(filters),
        ...queryOptions,
      });
    },

    useDetail(id, queryOptions?) {
      return useQuery({
        queryKey: [...baseKey, id] as QueryKey,
        queryFn: () => service.show(id!),
        enabled: !!id,
        ...queryOptions,
      });
    },

    useCreate() {
      const queryClient = useQueryClient();
      return useMutation<TEntity, ApiError, TCreateDto>({
        mutationFn: (data) => service.create(data),
        onSuccess: () => {
          invalidateAll(queryClient);
          toast.success(msgs.createSuccess);
        },
        onError: (error) => {
          toast.error(error.message ?? msgs.createError);
        },
      });
    },

    useUpdate() {
      const queryClient = useQueryClient();
      return useMutation<TEntity, ApiError, { id: string; data: TUpdateDto }>({
        mutationFn: ({ id, data }) => service.update(id, data),
        onSuccess: (_data, variables) => {
          invalidateAll(queryClient);
          queryClient.invalidateQueries({ queryKey: [...baseKey, variables.id] });
          toast.success(msgs.updateSuccess);
        },
        onError: (error) => {
          toast.error(error.message ?? msgs.updateError);
        },
      });
    },

    useDelete() {
      const queryClient = useQueryClient();
      return useMutation<MessageResponse, ApiError, string>({
        mutationFn: (id) => service.remove(id),
        onSuccess: () => {
          invalidateAll(queryClient);
          toast.success(msgs.deleteSuccess);
        },
        onError: (error) => {
          toast.error(error.message ?? msgs.deleteError);
        },
      });
    },

    useBulkDelete() {
      const queryClient = useQueryClient();
      return useMutation<MessageResponse, ApiError, string[]>({
        mutationFn: (ids) => service.bulkDelete(ids),
        onSuccess: () => {
          invalidateAll(queryClient);
          toast.success(msgs.deleteSuccess);
        },
        onError: (error) => {
          toast.error(error.message ?? msgs.deleteError);
        },
      });
    },
  };
}
