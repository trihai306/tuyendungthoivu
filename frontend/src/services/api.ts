import axios from "axios";
import type { ApiError } from "@/types";

const TOKEN_KEY = "auth_token";

export const apiClient = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor: attach Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// Response interceptor: handle 401 and normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        // Redirect to login if not already there
        if (window.location.pathname !== "/dang-nhap") {
          window.location.href = "/dang-nhap";
        }
      }

      const apiError: ApiError = {
        message:
          error.response?.data?.message ?? "Đã xảy ra lỗi. Vui lòng thử lại.",
        errors: error.response?.data?.errors,
        status: error.response?.status ?? 500,
      };

      return Promise.reject(apiError);
    }

    return Promise.reject(error);
  },
);

export { TOKEN_KEY };
