import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './config';

const { url, anonKey } = config.supabase;
const hasValidCredentials = Boolean(url && anonKey);

/**
 * Supabase client instance.
 * Returns null in dev mode or when credentials are not configured.
 */
export const supabase: SupabaseClient | null =
  config.isDevMode || !hasValidCredentials
    ? null
    : createClient(url, anonKey);

/**
 * Get the Supabase client with runtime validation.
 * Throws an error if called in dev mode or when credentials are missing.
 */
export function getSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      config.isDevMode
        ? 'Supabase client is not available in dev mode. Use mock implementations instead.'
        : 'Supabase client is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
  }
  return supabase;
}
