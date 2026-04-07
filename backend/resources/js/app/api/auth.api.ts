import apiClient from './client';
import type { User } from '../types';

interface LoginPayload {
  phone: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  phone: string;
  email?: string;
  password: string;
  role: 'worker' | 'employer' | 'landlord';
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: (data: LoginPayload) =>
    apiClient.post<AuthResponse>('/auth/login', data),

  register: (data: RegisterPayload) =>
    apiClient.post<AuthResponse>('/auth/register', data),

  logout: () =>
    apiClient.post('/auth/logout'),

  me: () =>
    apiClient.get<{ user: User }>('/auth/me'),
};
