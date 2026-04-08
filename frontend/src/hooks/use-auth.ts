import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/services/auth";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiError, LoginRequest, RegisterRequest } from "@/types";

export function useLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: () => {
      toast.success("Đăng nhập thành công!");
      navigate("/");
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Đăng nhập thất bại. Vui lòng thử lại.");
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: () => {
      toast.success("Đăng ký thành công!");
      navigate("/");
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Đăng ký thất bại. Vui lòng thử lại.");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.clear();
      toast.success("Đã đăng xuất.");
      navigate("/login");
    },
  });
}

export function useCurrentUser() {
  const { isAuthenticated, token } = useAuthStore();
  const fetchUser = useAuthStore((s) => s.fetchUser);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.getMe(),
    enabled: !!token && isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
    meta: { fetchUser },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success("Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.");
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Không thể gửi email. Vui lòng thử lại.");
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
      navigate("/login");
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? "Không thể đặt lại mật khẩu. Vui lòng thử lại.");
    },
  });
}
