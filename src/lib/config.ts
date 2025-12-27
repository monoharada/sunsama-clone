/**
 * Application configuration
 */

export const config = {
  /**
   * Development mode - uses mock data instead of Supabase
   */
  isDevMode: import.meta.env.VITE_DEV_MODE === 'true',

  /**
   * Supabase configuration
   */
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },

  /**
   * Google OAuth configuration
   */
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  },
};
