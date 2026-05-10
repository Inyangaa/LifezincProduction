import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

type Role = 'member' | 'therapist';

interface UnifiedSignUpPageProps {
  onNavigate: (page: string) => void;
}

export function UnifiedSignUpPage({ onNavigate }: UnifiedSignUpPageProps) {
  const { signUp, signIn } = useAuth();
  const [role, setRole] = useState<Role>('member');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage(null);

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match. Please try again.');
      return;
    }

    if (password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      console.log('LifeZinc signup:', { email, role, firstName, lastName });

      const { error: signUpError } = await signUp(email, password, {
        firstName,
        lastName,
        userType: role === 'member' ? 'seeker' : 'therapist',
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        setStatus('error');
        if (signUpError.message.includes('already registered')) {
          setMessage('This email is already registered. Please sign in instead.');
        } else {
          setMessage(signUpError.message || 'Something went wrong. Please try again.');
        }
        return;
      }

      console.log('[Signup] Account created, logging in automatically...');

      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        console.error('Auto-login error:', signInError);
        setStatus('success');
        setMessage('Account created! Redirecting to login...');
        setTimeout(() => {
          onNavigate('unified-login');
        }, 1500);
        return;
      }

      setStatus('success');
      setMessage(
        role === 'member'
          ? 'Account created! Welcome to your LifeZinc safe space.'
          : 'Therapist account created! Welcome to your support hub.'
      );

      setTimeout(() => {
        if (role === 'member') {
          onNavigate('journal');
        } else {
          onNavigate('therapist-support');
        }
      }, 1000);
    } catch (err: any) {
      console.error('Signup error:', err);
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8">
      <div className="w-full max-w-4xl grid gap-8 md:grid-cols-2 items-center">
        <div className="space-y-4 text-white">
          <h1 className="text-3xl font-semibold">
            Join <span className="text-emerald-400">LifeZinc</span>
          </h1>
          <p className="text-slate-300 text-sm">
            Create your account and start your journey to emotional wellness. Whether you're here
            for yourself or to support others, we're glad you're here.
          </p>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• Private and secure emotion tracking</li>
            <li>• Personalized insights and reflections</li>
            <li>• Professional support when you need it</li>
            <li>• Built with care for your well-being</li>
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
              {role === 'member' ? 'Create your safe space' : 'Create your support hub'}
            </h2>
            <p className="text-xs text-slate-400">
              {role === 'member'
                ? 'Start tracking your emotions and building emotional strength.'
                : 'Set up your account to support clients and track their progress.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-base text-white outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="John"
                  autoComplete="given-name"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-base text-white outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Doe"
                  autoComplete="family-name"
                />
              </div>
            </div>

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
                placeholder="At least 6 characters"
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-200">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-base text-white outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Re-enter password"
                minLength={6}
                autoComplete="new-password"
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
                ? 'Creating your account…'
                : role === 'member'
                ? 'Create Member Account'
                : 'Create Therapist Account'}
            </button>
          </form>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <span>Already have an account?</span>
              <button
                onClick={() => onNavigate('unified-login')}
                className="text-emerald-400 hover:text-emerald-300 font-medium transition"
              >
                Sign in
              </button>
            </div>
          </div>

          <p className="text-[11px] text-center text-slate-500">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
}
