import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';
import { EmailVerificationPendingPage } from './EmailVerificationPendingPage';
import { validateEmail, validatePassword, sanitizeInput } from '../utils/validation';
import { routeAfterAuth } from '../utils/authRouting';
import { supabase } from '../lib/supabase';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationPending, setShowVerificationPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user, signIn } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      console.log('[LoginPage] User already logged in, routing after auth');
      routeAfterAuth(user, onNavigate);
    }
  }, [user, loading, onNavigate]);

  useEffect(() => {
    console.log('[LoginPage] Loading saved email on mount');
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const emailFromNav = hashParams.get('email');

    if (emailFromNav) {
      const decodedEmail = decodeURIComponent(emailFromNav);
      console.log('[LoginPage] Email from navigation:', decodedEmail);
      setEmail(decodedEmail);
      localStorage.setItem('lifezinc_remembered_email', decodedEmail);
    } else {
      const savedEmail = localStorage.getItem('lifezinc_remembered_email');
      console.log('[LoginPage] Saved email from localStorage:', savedEmail);
      if (savedEmail) {
        console.log('[LoginPage] Pre-filling email field with:', savedEmail);
        setEmail(savedEmail);
      } else {
        console.log('[LoginPage] No saved email found');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const sanitizedEmail = sanitizeInput(email);

      // Validate inputs
      const emailValidation = validateEmail(sanitizedEmail);
      const passwordValidation = validatePassword(password, false);

      if (!emailValidation.isValid) {
        setError(emailValidation.message);
        setLoading(false);
        return;
      }

      if (!passwordValidation.isValid) {
        setError(passwordValidation.message);
        setLoading(false);
        return;
      }

      const { error: signInError } = await signIn(sanitizedEmail, password);

      if (signInError) {
        if (signInError.message.includes('Email not confirmed')) {
          setShowVerificationPending(true);
        } else if (signInError.message.includes('Invalid login credentials')) {
          setError('Incorrect email or password. Please try again.');
        } else if (signInError.message.includes('Invalid email')) {
          setError('Please enter a valid email address.');
        } else {
          setError(signInError.message);
        }
      } else {
        console.log('[LoginPage] Saving email to localStorage:', sanitizedEmail);
        localStorage.setItem('lifezinc_remembered_email', sanitizedEmail);

        console.log('[LoginPage] Login successful, fetching user and routing');
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          await routeAfterAuth(currentUser, onNavigate);
        }
      }
    } catch (err: any) {
      console.error('[LoginPage] Sign in error:', err);
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showVerificationPending) {
    return <EmailVerificationPendingPage email={email} onNavigate={onNavigate} />;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-white">Welcome back to LifeZinc</h1>
          <p className="text-sm text-slate-300">
            Sign in to continue your emotional wellness journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="••••••••"
              minLength={6}
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => onNavigate('forgot-password')}
              className="text-emerald-400 hover:text-emerald-300 transition"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <p className="text-sm text-emerald-400 text-center">
              Signing in...
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-slate-400">
            New to LifeZinc?{' '}
            <button
              onClick={() => onNavigate('signup')}
              className="text-emerald-400 hover:text-emerald-300 font-medium transition"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
