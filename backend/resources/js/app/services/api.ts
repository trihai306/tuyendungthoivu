import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiError } from "@/types";

const TOKEN_KEY = "auth_token";

export const apiClient = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30_000,
});

// Request interceptor: attach Bearer token + CSRF
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// Track if we are already redirecting to avoid multiple redirects
let isRedirecting = false;

/**
 * Transform an AxiosError into a normalized ApiError.
 */
function transformError(error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>): ApiError {
  return {
    message: error.response?.data?.message ?? "Da xay ra loi. Vui long thu lai.",
    errors: error.response?.data?.errors,
    status: error.response?.status ?? 500,
  };
}

// Response interceptor: handle 401 and normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      // Handle 401 Unauthorized
      if (status === 401 && !isRedirecting) {
        localStorage.removeItem(TOKEN_KEY);
        if (window.location.pathname !== "/login") {
          isRedirecting = true;
          window.location.href = "/login";
        }
      }

      return Promise.reject(transformError(error));
    }

    // Non-axios errors (network, timeout, etc.)
    const fallback: ApiError = {
      message: "Loi ket noi. Vui long kiem tra mang va thu lai.",
      status: 0,
    };
    return Promise.reject(fallback);
  },
);

export { TOKEN_KEY };
