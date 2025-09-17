/**
 * Remplacements sûrs pour 'any'
 */

// Pour les objets génériques
export type GenericObject = Record<string, unknown>;

// Pour les données d'API
export type ApiData = Record<string, unknown>;

// Pour les événements
export type EventHandler<T = Event> = (event: T) => void;

// Pour les fonctions callback
export type Callback<T = void> = () => T;
export type CallbackWithArgs<Args extends unknown[], Return = void> = (...args: Args) => Return;

// Pour les données de formulaire
export type FormData = Record<string, string | number | boolean | null>;

// Pour les props de composants
export type ComponentProps<T = GenericObject> = T & {
  children?: React.ReactNode;
  className?: string;
};

// Type guards utiles
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

// Helper pour caster de manière sûre
export const safeCast = <T>(value: unknown): T => {
  return value as T;
};

// Pour les erreurs
export interface SafeError {
  message: string;
  code?: string | number;
  details?: GenericObject;
}

// Pour les réponses d'API typées
export interface SafeApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

// Exemple d'usage dans votre ApiRequest
export class SafeApiRequest {
  private async handleResponse<T>(response: Response): Promise<SafeApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let rawData: unknown;
    try {
      rawData = isJson ? await response.json() : await response.text();
    } catch (error) {
      rawData = null;
    }

    if (!response.ok) {
      const errorData = isObject(rawData) ? rawData : {};
      throw {
        message: isString(errorData.message) ? errorData.message : `HTTP Error ${response.status}`,
        code: response.status,
        details: errorData,
      } as SafeError;
    }

    const responseData = isObject(rawData) ? rawData : {};

    return {
      data: safeCast<T>(rawData),
      message: isString(responseData.message) ? responseData.message : undefined,
      status: response.status,
      success: response.ok,
    };
  }
}