import { apiClient } from "./api";
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  User,
} from "@/types";

/**
 * Flatten permissions from roles[].permissions[].name into user.permissions.
 * The API returns permissions as objects nested inside each role, but the
 * frontend User type expects a flat string array at the top level.
 */
function flattenPermissions(user: User): User {
  if ((!user.permissions || user.permissions.length === 0) && user.roles?.length) {
    const permSet = new Set<string>();
    for (const role of user.roles) {
      const perms = (role as unknown as { permissions?: { name: string }[] }).permissions;
      if (perms) {
        for (const p of perms) {
          permSet.add(p.name);
        }
      }
    }
    user.permissions = Array.from(permSet);
  }
  return user;
}

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>("/auth/login", data).then((r) => {
      r.data.user = flattenPermissions(r.data.user);
      return r.data;
    }),

  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>("/auth/register", data).then((r) => {
      r.data.user = flattenPermissions(r.data.user);
      return r.data;
    }),

  logout: () =>
    apiClient.post<{ message: string }>("/auth/logout").then((r) => r.data),

  getMe: () =>
    apiClient.get<{ user: User }>("/auth/me").then((r) => flattenPermissions(r.data.user)),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient
      .post<{ message: string }>("/auth/forgot-password", data)
      .then((r) => r.data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient
      .post<{ message: string }>("/auth/reset-password", data)
      .then((r) => r.data),
};
