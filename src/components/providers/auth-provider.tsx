'use client';
import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/stores/auth';
import { apiClient } from '@/lib/api';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { checkAuth, isAuthenticated } = useAuth();

  useEffect(() => {
    // Vérifier l'authentification au montage si un token existe
    const token = localStorage.getItem('auth_token');
    if (token && !isAuthenticated) {
      apiClient.setToken(token);
      checkAuth();
    }
  }, [checkAuth, isAuthenticated]);

  return <>{children}</>;
}