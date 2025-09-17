import { toast } from 'sonner';
import { ApiResponse, ApiError } from '@/types';

export class ApiRequest {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') {
    this.baseURL = baseURL.replace(/\/$/, '');
    
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  /**
   * Set authentication token
   */
  setToken(token: string | null): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Build headers for requests
   */
  private buildHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: unknown;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch (error) {
      data = null;
    }

    if (!response.ok) {
      const apiError: ApiError = {
        message: data?.message || data?.error || `HTTP Error ${response.status}`,
        errors: data?.errors,
        status: response.status,
      };

      // Handle token expiration
      if (response.status === 401) {
        this.setToken(null);
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
          toast.error('Session expirée, veuillez vous reconnecter');
          window.location.href = '/auth/login';
        }
      }

      throw apiError;
    }

    return {
      data,
      message: data?.message,
      status: response.status,
    };
  }

  /**
   * GET request
   */
  async get<T = unknown>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]));
        }
      });
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.buildHeaders(),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'TypeError') {
        throw {
          message: 'Erreur de connexion au serveur',
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  /**
   * POST request
   */
  async post<T = unknown>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'TypeError') {
        throw {
          message: 'Erreur de connexion au serveur',
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  /**
   * PUT request
   */
  async put<T = unknown>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.buildHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'TypeError') {
        throw {
          message: 'Erreur de connexion au serveur',
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PATCH',
        headers: this.buildHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'TypeError') {
        throw {
          message: 'Erreur de connexion au serveur',
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.buildHeaders(),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'TypeError') {
        throw {
          message: 'Erreur de connexion au serveur',
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  /**
   * Upload file with FormData
   */
  async upload<T = unknown>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'TypeError') {
        throw {
          message: 'Erreur de connexion au serveur',
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Clear authentication
   */
  clearAuth(): void {
    this.setToken(null);
  }
}

// Create a singleton instance
export const apiRequest = new ApiRequest();

// Export types for use in other files
export type { ApiResponse, ApiError };