import { create } from "zustand";
import { authApi } from "@/services/auth";
import type { ApiError, LoginRequest, RegisterRequest, User } from "@/types";
import { TOKEN_KEY } from "@/services/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setToken: (token: string | null) => void;
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem(TOKEN_KEY),
  isAuthenticated: false,
  isLoading: false,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  login: async (data: LoginRequest) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login(data);
      localStorage.setItem(TOKEN_KEY, response.token);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error as ApiError;
    }
  },

  register: async (data: RegisterRequest) => {
    set({ isLoading: true });
    try {
      const response = await authApi.register(data);
      localStorage.setItem(TOKEN_KEY, response.token);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error as ApiError;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout API errors - still clear local state
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  fetchUser: async () => {
    const { token } = get();
    if (!token) {
      set({ isAuthenticated: false, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await authApi.getMe();
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  setToken: (token: string | null) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    set({ token, isAuthenticated: !!token });
  },

  reset: () => {
    localStorage.removeItem(TOKEN_KEY);
    set(initialState);
  },
}));
