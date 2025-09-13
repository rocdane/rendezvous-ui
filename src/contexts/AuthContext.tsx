import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User, Provider } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (provider: Provider) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (provider: Provider): Promise<void> => {
    try {
      setLoading(true);
      
      // Obtenir l'URL de redirection
      const redirectUrl = await authService.getSocialRedirectUrl(provider);
      
      // Créer une popup pour l'authentification
      const popup = window.open(
        redirectUrl,
        `${provider}_auth`,
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Écouter les messages de la popup
      return new Promise((resolve, reject) => {
        const messageListener = async (event: MessageEvent) => {
          // Vérifier l'origine du message pour la sécurité
          if (event.origin !== window.location.origin) {
            return;
          }

          if (event.data.type === 'SOCIAL_AUTH_SUCCESS') {
            try {
              // Traiter le callback avec le code d'autorisation
              const authData = await authService.handleSocialCallback(
                provider, 
                event.data.code
              );
              
              setUser(authData.user);
              popup?.close();
              window.removeEventListener('message', messageListener);
              resolve();
            } catch (error) {
              console.error('Authentication error:', error);
              popup?.close();
              window.removeEventListener('message', messageListener);
              reject(error);
            }
          } else if (event.data.type === 'SOCIAL_AUTH_ERROR') {
            popup?.close();
            window.removeEventListener('message', messageListener);
            reject(new Error(event.data.error || 'Authentication failed'));
          }
        };

        window.addEventListener('message', messageListener);

        // Vérifier si la popup a été fermée manuellement
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            reject(new Error('Authentication cancelled'));
          }
        }, 1000);
      });

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
