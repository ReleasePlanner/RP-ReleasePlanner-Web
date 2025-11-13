/**
 * API Configuration
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  AUTH: '/auth',
  BASE_PHASES: '/base-phases',
  PRODUCTS: '/products',
  FEATURES: '/features',
  CALENDARS: '/calendars',
  IT_OWNERS: '/it-owners',
  PLANS: '/plans',
} as const;

// Token storage keys
export const TOKEN_STORAGE_KEY = 'access_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';
export const USER_STORAGE_KEY = 'user';
