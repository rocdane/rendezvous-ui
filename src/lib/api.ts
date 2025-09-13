import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Configuration de l'instance Axios
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour les requêtes - ajouter le token d'auth
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses - gestion des erreurs
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const message = getErrorMessage(error);
    
    // Rediriger vers login si non authentifié
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      // Ne pas rediriger si on est déjà sur une page publique
      if (!window.location.pathname.startsWith('/booking/')) {
        window.location.href = '/auth/login';
      }
    }
    
    // Afficher le message d'erreur
    if (error.response?.status !== 401) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Fonction utilitaire pour extraire le message d'erreur
function getErrorMessage(error: AxiosError): string {
  if (error.response?.data) {
    const data = error.response?.data as ApiError;
    
    // Message d'erreur Laravel
    if (data.message) {
      return data.message;
    }
    
    // Erreurs de validation Laravel
    if (data.errors) {
      const firstError = Object.values(data.errors)[0] as string[];
      return firstError[0];
    }
  }
  
  // Messages d'erreur par défaut selon le code de statut
  switch (error.response?.status) {
    case 400:
      return 'Requête invalide';
    case 401:
      return 'Non autorisé';
    case 403:
      return 'Accès interdit';
    case 404:
      return 'Ressource non trouvée';
    case 422:
      return 'Données invalides';
    case 500:
      return 'Erreur serveur';
    default:
      return error.message || 'Une erreur est survenue';
  }
}

// Fonction utilitaire pour gérer les requêtes CSRF (Laravel Sanctum)
export const getCsrfCookie = async (): Promise<void> => {
  await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
};

// Types pour les réponses API
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiSuccess<T = unknown> {
  data: T;
  message?: string;
}

// Wrapper pour les appels API avec gestion d'erreur
export const apiRequest = async <T>(
  request: () => Promise<AxiosResponse<T>>
): Promise<T> => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient;