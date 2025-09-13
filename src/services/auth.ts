/**src/services/auth.ts */
import { apiClient, apiRequest } from '@/lib/api';
import { User, LoginCredentials, RegisterData, AuthResponse } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiRequest(() =>
      apiClient.post<AuthResponse>('/auth/login', credentials)
    );
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    return apiRequest(() =>
      apiClient.post<AuthResponse>('/auth/register', data)
    );
  },

  async logout(): Promise<void> {
    return apiRequest(() =>
      apiClient.post('/auth/logout')
    );
  },

  async getUser(): Promise<User> {
    return apiRequest(() =>
      apiClient.get<{ data: User }>('/user')
    ).then(response => response.data);
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    return apiRequest(() =>
      apiClient.put<{ data: User }>('/user', data)
    ).then(response => response.data);
  },
};
