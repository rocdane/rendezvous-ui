import { type User, type AuthResponse, type SocialRedirectResponse } from "../types";
export type Provider = 'google' | 'microsoft' | 'github';

class AuthService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    this.token = localStorage.getItem('auth_token');
  }

  /**
   * Obtenir l'URL de redirection pour un provider
   */
  async getSocialRedirectUrl(provider: Provider): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/${provider}/redirect`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SocialRedirectResponse = await response.json();
      return data.redirect_url;
    } catch (error) {
      console.error(`Error getting redirect URL for ${provider}:`, error);
      throw error;
    }
  }

  /**
   * Traiter le callback d'authentification sociale
   */
  async handleSocialCallback(
    provider: Provider, 
    authorizationCode: string
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/${provider}/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          code: authorizationCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Authentication failed`);
      }

      const authData: AuthResponse = await response.json();
      
      // Stocker le token
      this.token = authData.access_token;
      localStorage.setItem('auth_token', this.token);
      
      return authData;
    } catch (error) {
      console.error(`Error in social callback for ${provider}:`, error);
      throw error;
    }
  }

  /**
   * Obtenir les informations de l'utilisateur connecté
   */
  async getCurrentUser(): Promise<User | null> {
    if (!this.token) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Déconnecter l'utilisateur
   */
  async logout(): Promise<void> {
    try {
      if (this.token) {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.token = null;
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Obtenir le token d'authentification
   */
  getToken(): string | null {
    return this.token;
  }
}

export const authService = new AuthService();
