/**
 * API Configuration for Mobile App
 * Uses environment variables or defaults to localhost
 */

// Get API URL from environment or use default
const getApiBaseUrl = (): string => {
  // For development, default to localhost
  // In production, this should be set via environment variables
  if (__DEV__) {
    // For Android emulator, use 10.0.2.2 instead of localhost
    // For iOS simulator, use localhost
    // You can also use your machine's IP address for physical devices
    return 'http://localhost:3000/api';
  }
  
  // Production API URL (should be set via EAS environment variables)
  return 'https://api.releaseplanner.com/api';
};

export const API_BASE_URL = getApiBaseUrl();

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

