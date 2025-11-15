/**
 * Auth Module Configuration Constants
 * 
 * Default values for authentication configuration
 * These values are used as fallbacks when environment variables are not set
 */

/**
 * JWT Configuration Defaults
 */
export const JWT_CONFIG_DEFAULTS = {
  /**
   * Default access token expiration time
   * Format: time units (e.g., "15m", "1h", "7d")
   */
  ACCESS_TOKEN_EXPIRES_IN: "15m",

  /**
   * Default refresh token expiration time
   * Format: time units (e.g., "7d", "30d")
   */
  REFRESH_TOKEN_EXPIRES_IN: "7d",

  /**
   * Default JWT secret (should be changed in production)
   * This is a fallback value - always set JWT_SECRET in environment variables
   */
  SECRET: "beyondnet",

  /**
   * Default refresh token secret (should be changed in production)
   * This is a fallback value - always set JWT_REFRESH_SECRET in environment variables
   */
  REFRESH_SECRET: "beyondnet",
} as const;

/**
 * Bcrypt Configuration Defaults
 */
export const BCRYPT_CONFIG_DEFAULTS = {
  /**
   * Default number of rounds for password hashing
   * Recommended: 10-12 rounds (higher = more secure but slower)
   */
  ROUNDS: 10,

  /**
   * Default number of rounds for refresh token hashing
   * Using same as password rounds for consistency
   */
  REFRESH_TOKEN_ROUNDS: 10,
} as const;

/**
 * Refresh Token Storage Configuration Defaults
 */
export const REFRESH_TOKEN_CONFIG_DEFAULTS = {
  /**
   * Default number of days until refresh token expires
   * Should match REFRESH_TOKEN_EXPIRES_IN duration
   */
  EXPIRATION_DAYS: 7,
} as const;

