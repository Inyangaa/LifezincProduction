import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { sendVerificationEmail } from '../utils/emailService';

interface SignUpMetadata {
  firstName?: string;
  lastName?: string;
  userType?: string;
}

interface UserProfile {
  user_type?: 'seeker' | 'therapist';
  therapist_profile_completed?: boolean;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  needsEmailVerification: boolean;
  unverifiedEmail: string | null;
  signUp: (email: string, password: string, metadata?: SignUpMetadata) => Promise<{ data: any; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('[Auth] Initializing auth - checking for existing session...');

        // Get session from local storage (persisted by Supabase)
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('[Auth] Error fetching session:', error);
          if (mounted) {
            setSession(null);
            setUser(null);
            setLoading(false);
          }
          return;
        }

        if (session) {
          console.log('[Auth] Found existing session for user:', session.user.email);
          console.log('[Auth] Session expires at:', new Date(session.expires_at! * 1000).toLocaleString());
        } else {
          console.log('[Auth] No existing session found');
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setNeedsEmailVerification(false);
          setUnverifiedEmail(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('[Auth] Unexpected error during initialization:', err);
        if (mounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        console.log('[Auth] State change event:', event);

        if (event === 'SIGNED_IN') {
          console.log('[Auth] User signed in successfully');
        }

        if (event === 'SIGNED_OUT') {
          console.log('[Auth] User signed out');
        }

        if (event === 'TOKEN_REFRESHED') {
          console.log('[Auth] Token refreshed successfully');
        }

        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        if (errorParam) {
          console.error('=== OAUTH CALLBACK ERROR (URL PARAMS) ===');
          console.error('[Auth] Error:', errorParam);
          console.error('[Auth] Error Description:', errorDescription);
          console.error('[Auth] Full URL:', window.location.href);
          console.error('=== END OAUTH CALLBACK ERROR ===');
        }

        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hashError = hashParams.get('error');
        const hashErrorDescription = hashParams.get('error_description');

        if (hashError) {
          console.error('=== OAUTH CALLBACK ERROR (HASH) ===');
          console.error('[Auth] Hash Error:', hashError);
          console.error('[Auth] Hash Error Description:', hashErrorDescription);
          console.error('[Auth] Full Hash:', window.location.hash);
          console.error('=== END OAUTH HASH ERROR ===');
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            setNeedsEmailVerification(false);
            setUnverifiedEmail(null);
          }
        }
      })();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) {
        setUserProfile(null);
        return;
      }

      console.log('[Auth] Fetching user profile for:', user.id);

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('user_type, therapist_profile_completed')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('[Auth] Error fetching user profile:', error);
        setUserProfile(null);
        return;
      }

      if (profile) {
        console.log('[Auth] User profile fetched:', profile);
        setUserProfile({
          user_type: profile.user_type,
          therapist_profile_completed: profile.therapist_profile_completed,
        });
      } else {
        setUserProfile(null);
      }
    };

    fetchUserProfile();
  }, [user]);

  const signUp = async (email: string, password: string, metadata?: SignUpMetadata) => {
    console.log('=== CUSTOM EMAIL VERIFICATION: SIGNUP STARTED ===');
    console.log('[Auth] Email:', email);
    console.log('[Auth] Metadata:', metadata);
    console.log('[Auth] Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('[Auth] Anon Key present:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

    let data: any = null;
    let error: AuthError | null = null;

    try {
      const signUpResult = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/#`,
          data: metadata ? {
            first_name: metadata.firstName,
            last_name: metadata.lastName,
            user_type: metadata.userType,
          } : undefined,
        },
      });

      data = signUpResult.data;
      error = signUpResult.error;

      if (error) {
        console.error('=== SIGNUP ERROR ===');
        console.error('[Auth] Error Name:', error.name);
        console.error('[Auth] Error Message:', error.message);
        console.error('[Auth] Error Status:', error.status);
        console.error('[Auth] Full Error:', JSON.stringify(error, null, 2));
        console.error('=== END SIGNUP ERROR ===');
        return { data, error };
      }

      console.log('[Auth] Supabase signUp call succeeded');
    } catch (err) {
      console.error('=== SIGNUP NETWORK/EXCEPTION ERROR ===');
      console.error('[Auth] Exception Type:', err instanceof Error ? err.constructor.name : typeof err);
      console.error('[Auth] Exception Message:', err instanceof Error ? err.message : String(err));
      console.error('[Auth] Full Exception:', err);
      console.error('=== END SIGNUP EXCEPTION ===');
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : 'Failed to fetch',
          name: 'NetworkError',
          status: 0
        } as AuthError
      };
    }

    if (!data || !data.user) {
      console.error('[Auth] No user returned after signup');
      console.error('[Auth] Data returned:', data);
      return { data, error: { message: 'No user returned', name: 'SignUpError', status: 500 } as AuthError };
    }

    console.log('=== SIGNUP SUCCESS - CREATING PROFILE ===');
    console.log('[Auth] User ID:', data.user.id);
    console.log('[Auth] Email:', data.user.email);

    try {
      const userType = metadata?.userType || 'seeker';
      console.log('[Auth] Creating profile with user_type:', userType);
      console.log('[Auth] DEV MODE: Email verification disabled - marking as verified');

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: data.user.id,
          email_verified: true,
          user_type: userType,
          therapist_profile_completed: false,
          age_group: '18-24',
          support_style: 'Balanced',
          crisis_sensitivity: 'Medium',
        });

      if (profileError) {
        console.error('[Auth] Error creating profile:', profileError);
      } else {
        console.log('[Auth] Profile created and marked as verified');
      }

      console.log('=== END SIGNUP SUCCESS ===');
    } catch (err) {
      console.error('[Auth] Error in post-signup process:', err);
    }

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('[Auth] Email:', email);
    console.log('[Auth] DEV MODE: Email verification checks disabled');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('=== LOGIN ERROR ===');
      console.error('[Auth] Error Message:', error.message);
      console.error('[Auth] Error Status:', error.status);
      console.error('=== END LOGIN ERROR ===');
      return { error };
    }

    if (!data.user) {
      console.error('[Auth] No user returned after login');
      return { error: { message: 'Login failed', name: 'LoginError', status: 500 } as AuthError };
    }

    console.log('=== LOGIN SUCCESS ===');
    console.log('[Auth] User ID:', data.user.id);
    console.log('[Auth] Email:', data.user.email);
    console.log('=== END LOGIN SUCCESS ===');
    return { error: null };
  };

  const signInWithGoogle = async () => {
    try {
      console.log('=== GOOGLE SIGN-IN DEBUG START ===');
      console.log('[Google Sign-In] Window location origin:', window.location.origin);
      console.log('[Google Sign-In] Full URL:', window.location.href);
      console.log('[Google Sign-In] Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('[Google Sign-In] Starting OAuth flow...');

      // Let Supabase use its default redirect URL configuration
      // This avoids 400 errors from mismatched redirect URIs
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Don't specify redirectTo - let Supabase use configured URL
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('=== GOOGLE SIGN-IN ERROR DETECTED ===');
        console.error('[Google Sign-In] Full error object:', JSON.stringify(error, null, 2));
        console.error('[Google Sign-In] Error message:', error.message);
        console.error('[Google Sign-In] Error status:', error.status);
        console.error('[Google Sign-In] Error name:', error.name);
        console.error('=== END ERROR LOG ===');
        return { error };
      }

      console.log('[Google Sign-In] OAuth initiated successfully');
      console.log('[Google Sign-In] OAuth data:', data);
      console.log('=== GOOGLE SIGN-IN DEBUG END ===');
      return { error: null };
    } catch (err) {
      console.error('=== GOOGLE SIGN-IN CAUGHT EXCEPTION ===');
      console.error('[Google Sign-In] Exception:', err);
      console.error('[Google Sign-In] Exception type:', typeof err);
      console.error('[Google Sign-In] Exception stringified:', JSON.stringify(err, null, 2));
      console.error('=== END EXCEPTION LOG ===');
      return {
        error: {
          message: 'An unexpected error occurred during Google sign-in. Please try again or use email sign-in.',
          status: 500,
          name: 'UnexpectedError'
        } as AuthError
      };
    }
  };

  const signOut = async () => {
    console.log('[Auth] Signing out user...');

    try {
      // Clear state immediately to prevent flashing of protected content
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setNeedsEmailVerification(false);
      setUnverifiedEmail(null);

      // Sign out from Supabase (this clears the auth session in localStorage)
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('[Auth] Error signing out:', error);
        // Even if there's an error, we've already cleared local state
      }

      // Clear any custom local storage items
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('lifezinc_') || key.includes('supabase'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Clear session storage
      sessionStorage.clear();

      console.log('[Auth] Sign out complete - session terminated, all state cleared');

      // Force reload to ensure clean state
      window.location.href = '/#/signed-out';
    } catch (err) {
      console.error('[Auth] Sign out error:', err);
      // Force clear even on error
      window.location.href = '/#/signed-out';
    }
  };

  const value = {
    user,
    userProfile,
    session,
    loading,
    needsEmailVerification,
    unverifiedEmail,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
