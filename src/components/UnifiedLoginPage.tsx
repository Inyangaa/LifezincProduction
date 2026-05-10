import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { routeAfterAuth } from '../utils/authRouting';
import { supabase } from '../lib/supabase';

type Role = 'member' | 'therapist';

interface UnifiedLoginPageProps {
  onNavigate: (page: string) => void;
}

export function UnifiedLoginPage({ onNavigate }: UnifiedLoginPageProps) {
  const { signIn } = useAuth();
  const [role, setRole] = useState<Role>('member');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('Signing you in…');

    try {
      console.log('LifeZinc login:', { email, role });

      const { error } = await signIn(email, password);

      if (error) {
        console.error('Login error:', error);
        setStatus('error');

        if (error.message === 'Email not confirmed' || error.name === 'EmailNotVerified') {
          setMessage('Please verify your email before signing in. Check your inbox for the verification link.');
          setTimeout(() => {
            onNavigate('email-verification-sent');
          }, 2000);
        } else if (error.message === 'Invalid login credentials') {
          setMessage('Invalid email or password. Please try again.');
        } else {
          setMessage(error.message || 'Something went wrong. Please try again.');
        }
        return;
      }

      setStatus('success');
      setMessage('Signed in successfully! Taking you to your dashboard…');

      // Get the authenticated user and route appropriately
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (currentUser) {
        console.log('[UnifiedLoginPage] Login successful, routing user...');
        await routeAfterAuth(currentUser, onNavigate);
      } else {
        console.error('[UnifiedLoginPage] User is null after successful login');
        setStatus('error');
        setMessage('Authentication error. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-4xl grid gap-8 md:grid-cols-2 items-center">
        <div className="space-y-4 text-white">
          <h1 className="text-3xl font-semibold">
            Welcome to <span className="text-emerald-400">LifeZinc</span>
          </h1>
          <p className="text-slate-300 text-sm">
            A gentle space to process emotions, build micro-habits, and get support — whether
            you're here for your own healing or to care for others.
          </p>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• Emotion check-ins with emojis</li>
            <li>• Guided processing and reflections</li>
            <li>• Therapist / coach support when needed</li>
          </ul>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl p-6 space-y-6">
          <div className="flex rounded-full bg-slate-800 p-1 text-xs">
            <button
              type="button"
              onClick={() => setRole('member')}
              className={`flex-1 px-4 py-3 rounded-full transition ${
                role === 'member'
                  ? 'bg-emerald-500 text-slate-950 font-medium'
                  : 'text-slate-300'
              }`}
            >
              I'm here for me
            </button>
            <button
              type="button"
              onClick={() => setRole('therapist')}
              className={`flex-1 px-4 py-3 rounded-full transition ${
                role === 'therapist'
                  ? 'bg-emerald-500 text-slate-950 font-medium'
                  : 'text-slate-300'
              }`}
            >
              I'm a therapist / coach
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-white">
              {role === 'member' ? 'Sign in to your safe space' : 'Sign in to your support hub'}
            </h2>
            <p className="text-xs text-slate-400">
              {role === 'member'
                ? 'Track how you feel, process your day, and build emotional strength.'
                : 'Support your clients, track sessions, and see emotional patterns.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-200">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-base text-white outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-200">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-base text-white outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="••••••••"
                minLength={6}
                autoComplete="current-password"
              />
            </div>

            {message && (
              <p
                className={`text-xs ${
                  status === 'error' ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-lg bg-emerald-500 px-4 py-4 text-base font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {status === 'loading'
                ? 'Signing you in…'
                : role === 'member'
                ? 'Continue as Member'
                : 'Continue as Therapist'}
            </button>
          </form>

          <div className="space-y-3 text-center">
            <button
              onClick={() => onNavigate('forgot-password')}
              className="text-xs text-slate-400 hover:text-emerald-400 transition"
            >
              Forgot your password?
            </button>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <span>Don't have an account?</span>
              <button
                onClick={() => onNavigate('unified-signup')}
                className="text-emerald-400 hover:text-emerald-300 font-medium transition"
              >
                Sign up
              </button>
            </div>
          </div>

          <p className="text-[11px] text-center text-slate-500">
            No overwhelm. Just small steps, gentle check-ins, and support whenever you need it.
          </p>
        </div>
      </div>
    </main>
  );
}
