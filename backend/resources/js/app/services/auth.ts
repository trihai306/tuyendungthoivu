import { apiClient } from "./api";
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  User,
} from "@/types";

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>("/auth/login", data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>("/auth/register", data).then((r) => r.data),

  logout: () =>
    apiClient.post<{ message: string }>("/auth/logout").then((r) => r.data),

  getMe: () =>
    apiClient.get<{ user: User }>("/auth/me").then((r) => r.data.user),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient
      .post<{ message: string }>("/auth/forgot-password", data)
      .then((r) => r.data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient
      .post<{ message: string }>("/auth/reset-password", data)
      .then((r) => r.data),
};
