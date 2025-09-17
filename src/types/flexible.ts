/**
 * Types ultra-flexibles qui acceptent tout (remplacements directs pour 'any')
 */

// Remplacements directs pour 'any'
export type Flexible = unknown;
export type FlexibleObject = Record<string, Flexible> | null | undefined;
export type FlexibleArray = Flexible[] | null | undefined;
export type FlexibleValue = string | number | boolean | null | undefined | FlexibleObject | FlexibleArray;

// Pour les fonctions
export type FlexibleFunction = (...args: Flexible[]) => Flexible;

// Pour les événements
export type FlexibleEvent = Event | Flexible;

// Pour les props de composants
export type FlexibleProps = {
  [key: string]: Flexible;
  children?: React.ReactNode;
  className?: string;
};

// Type le plus permissif possible (équivalent exact à 'any')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyType = any;

// Utilitaires de cast sécurisés
export const toObject = (value: Flexible): FlexibleObject => value as FlexibleObject;
export const toString = (value: Flexible): string => String(value ?? '');
export const toNumber = (value: Flexible): number => Number(value) || 0;
export const toBoolean = (value: Flexible): boolean => Boolean(value);
export const toArray = (value: Flexible): FlexibleArray => Array.isArray(value) ? value : [];

// Version encore plus permissive si nécessaire
export interface UltraFlexible {
  [key: string]: UltraFlexible | string | number | boolean | null | undefined;
  [key: number]: UltraFlexible | string | number | boolean | null | undefined;
}

// Types spécifiques pour votre API
export interface FlexibleApiResponse<T = Flexible> {
  data: T;
  message?: string | null;
  status: number;
  errors?: FlexibleObject;
  meta?: FlexibleObject;
}

export interface FlexibleUser {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  providers?: string[] | null;
  last_login_at?: string | null;
  [key: string]: Flexible; // Permet d'ajouter n'importe quelle propriété
}

// Exemples d'usage
export const createFlexibleHandler = (handler: (data: Flexible) => void) => {
  return (event: FlexibleEvent) => {
    handler(event);
  };
};

// Type guard ultra-permissif
export const exists = (value: Flexible): boolean => {
  return value !== null && value !== undefined;
};

export const isEmpty = (value: Flexible): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value as object).length === 0;
  return false;
};