import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { routeAfterAuth } from '../utils/authRouting';
import { Logo } from './Logo';

interface AuthCallbackPageProps {
  onNavigate: (page: string) => void;
}

export function AuthCallbackPage({ onNavigate }: AuthCallbackPageProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log('[AuthCallback] Processing auth callback...');

      try {
        // Check for hash parameters (OAuth, email verification, password reset)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const type = hashParams.get('type');
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        // Handle errors
        if (error) {
          console.error('[AuthCallback] Auth error:', error, errorDescription);
          setStatus('error');
          setMessage(errorDescription || 'Authentication failed. Please try again.');
          setTimeout(() => onNavigate('unified-login'), 3000);
          return;
        }

        // Handle OAuth callback
        if (type === 'signup' || type === 'email_change' || type === 'magiclink') {
          console.log('[AuthCallback] Email verification callback detected');
          setMessage('Verifying your email...');

          // Supabase should automatically set the session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (sessionError || !session) {
            console.error('[AuthCallback] Session error:', sessionError);
            setStatus('error');
            setMessage('Failed to verify email. Please try again.');
            setTimeout(() => onNavigate('unified-login'), 3000);
            return;
          }

          setStatus('success');
          setMessage('Email verified successfully! Redirecting...');

          setTimeout(async () => {
            await routeAfterAuth(session.user, onNavigate);
          }, 1500);
          return;
        }

        // Handle password reset
        if (type === 'recovery') {
          console.log('[AuthCallback] Password recovery detected');
          setMessage('Reset link verified. Please create a new password.');
          setTimeout(() => onNavigate('reset-password'), 1000);
          return;
        }

        // Handle generic OAuth callback
        if (accessToken) {
          console.log('[AuthCallback] OAuth callback with access token');
          setMessage('Completing sign in...');

          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (sessionError || !session) {
            console.error('[AuthCallback] Session error:', sessionError);
            setStatus('error');
            setMessage('Failed to complete sign in. Please try again.');
            setTimeout(() => onNavigate('unified-login'), 3000);
            return;
          }

          setStatus('success');
          setMessage('Signed in successfully! Redirecting...');

          setTimeout(async () => {
            await routeAfterAuth(session.user, onNavigate);
          }, 1500);
          return;
        }

        // No auth callback detected - redirect to login
        console.log('[AuthCallback] No auth callback detected, redirecting to login');
        setMessage('Redirecting...');
        setTimeout(() => onNavigate('unified-login'), 1000);

      } catch (err) {
        console.error('[AuthCallback] Unexpected error:', err);
        setStatus('error');
        setMessage('An unexpected error occurred. Redirecting to login...');
        setTimeout(() => onNavigate('unified-login'), 3000);
      }
    };

    handleAuthCallback();
  }, [onNavigate, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <Logo size="md" className="mx-auto mb-6" />

        {status === 'loading' && (
          <div className="w-12 h-12 border-4 border-brand-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        )}

        {status === 'success' && (
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {status === 'error' && (
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}

        <p className={`text-lg ${status === 'error' ? 'text-red-600' : 'text-gray-900'}`}>
          {message}
        </p>
      </div>
    </div>
  );
}
