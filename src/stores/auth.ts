/**src/stores/auth.ts */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient, getCsrfCookie } from '@/lib/api';
import { User, LoginCredentials, RegisterData, AuthResponse } from '@/types';
import { toast } from 'sonner';
import axios from 'axios';

interface AuthStore {
  // État
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // État initial
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Connexion
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        
        try {
          // Récupérer le cookie CSRF pour Laravel Sanctum
          await getCsrfCookie();
          
          const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
          const { token, user } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Stocker le token dans localStorage pour les requêtes futures
          localStorage.setItem('auth_token', token);
          
          toast.success(`Bienvenue ${user.name} !`);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Inscription
      register: async (data: RegisterData) => {
        set({ isLoading: true });
        
        try {
          await getCsrfCookie();
          
          const response = await apiClient.post<AuthResponse>('/auth/register', data);
          const { token, user } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem('auth_token', token);
          
          toast.success(`Compte créé avec succès ! Bienvenue ${user.name} !`);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Déconnexion
      logout: () => {
        // Appel API pour invalider le token côté serveur
        apiClient.post('/auth/logout').catch(() => {
          // Ignorer les erreurs de déconnexion
        });

        // Nettoyer le localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });

        toast.success('Déconnexion réussie');
        
        // Rediriger vers la page de connexion
        window.location.href = '/auth/login';
      },

      // Rafraîchir les données utilisateur
      refreshUser: async () => {
        try {
          const response = await apiClient.get<{ data: User }>('/user');
          const user = response.data.data;
          
          set({ user });
        } catch (error) {
          // Si l'utilisateur n'est plus authentifié, le déconnecter
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            get().logout();
          }
        }
      },

      // Setter pour l'utilisateur
      setUser: (user: User | null) => {
        set({ 
          user, 
          isAuthenticated: !!user 
        });
      },

      // Setter pour le token
      setToken: (token: string | null) => {
        set({ 
          token, 
          isAuthenticated: !!token 
        });
        
        if (token) {
          localStorage.setItem('auth_token', token);
        } else {
          localStorage.removeItem('auth_token');
        }
      },

      // Initialiser le store depuis localStorage
      initialize: () => {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({
              user,
              token,
              isAuthenticated: true,
            });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            // Données corrompues, nettoyer
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hook personnalisé pour l'authentification
export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login: store.login,
    register: store.register,
    logout: store.logout,
    refreshUser: store.refreshUser,
    setUser: store.setUser,
    setToken: store.setToken,
    initialize: store.initialize,
  };
};