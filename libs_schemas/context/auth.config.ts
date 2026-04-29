/**
 * Auth Context Configuration
 * 
 * Define storage keys and configuration for the AuthProvider.
 * This allows the auth context to be reusable across different applications
 * by overriding these defaults when creating an AuthProvider instance.
 */

export interface AuthConfig {
  /** Key for storing user data in sessionStorage */
  userStorageKey: string;
  /** Key for storing access token in sessionStorage */
  accessTokenStorageKey: string;
}

/**
 * Default auth configuration
 * Override these when initializing AuthProvider by passing config prop
 */
export const defaultAuthConfig: AuthConfig = {
  userStorageKey: 'mentor_app_user',
  accessTokenStorageKey: 'mentor_app_access_token',
};

/**
 * Create custom auth config for different applications/instances
 * 
 * @example
 * const customConfig = createAuthConfig('myapp');
 * // Returns: { userStorageKey: 'myapp_user', accessTokenStorageKey: 'myapp_access_token' }
 */
export function createAuthConfig(appName: string): AuthConfig {
  return {
    userStorageKey: `${appName}_user`,
    accessTokenStorageKey: `${appName}_access_token`,
  };
}
