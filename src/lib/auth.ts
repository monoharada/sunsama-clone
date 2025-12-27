import { getSupabase } from './supabase';
import type { User } from '../types';

/**
 * Authentication helper functions.
 * These functions require Supabase to be configured and will throw in dev mode.
 * Components should check config.isDevMode before calling these methods.
 */
export const auth = {
  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar',
        redirectTo: window.location.origin,
      },
    });

    if (error) throw error;
  },

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    const supabase = getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    return {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name,
      avatarUrl: user.user_metadata?.avatar_url,
    };
  },

  /**
   * Get session
   */
  async getSession() {
    const supabase = getSupabase();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    const supabase = getSupabase();
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name,
          avatarUrl: session.user.user_metadata?.avatar_url,
        };
        callback(user);
      } else {
        callback(null);
      }
    });
  },
};
