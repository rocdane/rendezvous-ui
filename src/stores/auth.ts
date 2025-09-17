/**src/stores/auth.ts */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type User, type LoginData, type RegisterData, type ResetData } from '@/types';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  reset: (data: ResetData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  handleOAuthLogin: (provider: string) => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (data: LoginData) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.login(data);
          apiClient.setToken(response.token);
          
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
          
          toast.success('Connexion réussie !');
        } catch (error) {
          set({ isLoading: false });
          toast.error(error instanceof Error ? error.message : 'Erreur de connexion');
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.register(data);
          apiClient.setToken(response.token);
          
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
          
          toast.success('Compte créé avec succès !');
        } catch (error) {
          set({ isLoading: false });
          toast.error(error instanceof Error ? error.message : 'Erreur lors de la création du compte');
          throw error;
        }
      },

      reset: async (data: ResetData) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.reset(data);
          apiClient.setToken(response.token);
          
          set({
            user: response.user,
            isAuthenticated: false,
            isLoading: false,
          });
          
          toast.success('Compte réinitialisé avec succès !');
        } catch (error) {
          set({ isLoading: false });
          toast.error(error instanceof Error ? error.message : 'Erreur lors de la réinitialisation du compte');
          throw error;
        }
      },

      logout: async () => {
        try {
          await apiClient.logout();
        } catch (error) {
          console.error('Erreur lors de la déconnexion:', error);
        } finally {
          apiClient.setToken(null);
          set({
            user: null,
            isAuthenticated: false,
          });
          toast.success('Déconnexion réussie');
        }
      },

      checkAuth: async () => {
        try {
          const response = await apiClient.me();
          set({
            user: response.user,
            isAuthenticated: true,
          });
        } catch (error) {
          apiClient.setToken(null);
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      handleOAuthLogin: async (provider: string) => {
        try {
          const response = await apiClient.getOAuthRedirectUrl(provider);
          window.location.href = response.redirect_url;
        } catch (error) {
          toast.error(`Erreur lors de la connexion avec ${provider}`);
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);