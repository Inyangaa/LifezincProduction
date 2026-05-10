import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, AlertCircle, CheckCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Logo } from './Logo';
import { validateEmail, validatePassword, sanitizeInput, getPasswordStrength } from '../utils/validation';
import { routeAfterAuth } from '../utils/authRouting';
import { supabase } from '../lib/supabase';

interface AuthPageProps {
  onNavigate?: (page: string) => void;
}

export function AuthPage({ onNavigate }: AuthPageProps = {}) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const { user, signUp, signIn, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (user && !loading && onNavigate) {
      console.log('[AuthPage] User already logged in, routing after auth');
      routeAfterAuth(user, onNavigate);
    }
  }, [user, loading, onNavigate]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('lifezinc_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateForm = (): boolean => {
    const sanitizedEmail = sanitizeInput(email);
    const emailValidation = validateEmail(sanitizedEmail);
    const passwordValidation = validatePassword(password, isSignUp);

    setEmailError(emailValidation.isValid ? '' : emailValidation.message);
    setPasswordError(passwordValidation.isValid ? '' : passwordValidation.message);

    return emailValidation.isValid && passwordValidation.isValid;
  };

  const handleEmailBlur = () => {
    setTouched({ ...touched, email: true });
    if (email) {
      const validation = validateEmail(sanitizeInput(email));
      setEmailError(validation.isValid ? '' : validation.message);
    }
  };

  const handlePasswordBlur = () => {
    setTouched({ ...touched, password: true });
    if (password) {
      const validation = validatePassword(password, isSignUp);
      setPasswordError(validation.isValid ? '' : validation.message);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email && emailError) {
      const validation = validateEmail(sanitizeInput(value));
      setEmailError(validation.isValid ? '' : validation.message);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password && passwordError) {
      const validation = validatePassword(value, isSignUp);
      setPasswordError(validation.isValid ? '' : validation.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setTouched({ email: true, password: true });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const sanitizedEmail = sanitizeInput(email);
      if (isSignUp) {
        const { data, error } = await signUp(sanitizedEmail, password);

        if (error) {
          setError(error.message);
        } else if (data?.user) {
          if (data.user.identities && data.user.identities.length === 0) {
            setError('This email is already registered. Please sign in instead.');
          } else {
            setSuccess(
              'Success! Please check your email to confirm your account. Check your spam folder if you don\'t see it.'
            );
            setEmail('');
            setPassword('');
          }
        }
      } else {
        const { error } = await signIn(sanitizedEmail, password);

        if (error) {
          if (error.message.includes('Email not confirmed')) {
            setError('Please confirm your email address before signing in. Check your inbox for the confirmation link.');
          } else if (error.message.includes('Invalid login credentials')) {
            setError('Invalid email or password. Please try again.');
          } else {
            setError(error.message);
          }
        } else {
          if (rememberMe) {
            localStorage.setItem('lifezinc_remembered_email', email);
          } else {
            localStorage.removeItem('lifezinc_remembered_email');
          }

          if (onNavigate) {
            console.log('[AuthPage] Login successful, fetching user and routing');
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (currentUser) {
              await routeAfterAuth(currentUser, onNavigate);
            }
          }
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      console.log('[AuthPage] Initiating Google sign-in...');
      const { error } = await signInWithGoogle();

      if (error) {
        console.error('[AuthPage] Google sign-in error:', error);
        setError('Google sign-in didn\'t work just now. Please try again, or sign up with your email and password.');
        setLoading(false);
      }
    } catch (err) {
      console.error('[AuthPage] Unexpected error during Google sign-in:', err);
      setError('Google sign-in didn\'t work just now. Please try again, or sign up with your email and password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <Logo size="md" className="mb-4" />
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Transform your emotions, nurture your growth
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  emailError && touched.email ? 'text-red-400' :
                  email && !emailError && touched.email ? 'text-green-400' :
                  'text-gray-400'
                }`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={handleEmailBlur}
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                    emailError && touched.email
                      ? 'border-red-300 focus:ring-red-500'
                      : email && !emailError && touched.email
                      ? 'border-green-300 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-brand-primary-500'
                  }`}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
                {email && !emailError && touched.email && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {emailError && touched.email && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password {isSignUp && <span className="text-xs text-gray-500">(min 8 characters)</span>}
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  passwordError && touched.password ? 'text-red-400' :
                  password && !passwordError && touched.password ? 'text-green-400' :
                  'text-gray-400'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={handlePasswordBlur}
                  className={`w-full pl-10 pr-20 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                    passwordError && touched.password
                      ? 'border-red-300 focus:ring-red-500'
                      : password && !passwordError && touched.password
                      ? 'border-green-300 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-brand-primary-500'
                  }`}
                  placeholder="••••••••"
                  required
                  minLength={isSignUp ? 8 : 6}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {password && !passwordError && touched.password && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {passwordError && touched.password && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
              {isSignUp && password && !passwordError && touched.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${getPasswordStrength(password).color}`}
                        style={{ width: `${(getPasswordStrength(password).score / 6) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 capitalize">
                      {getPasswordStrength(password).strength}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Use uppercase, lowercase, numbers, and special characters for a stronger password
                  </p>
                </div>
              )}
            </div>

            {!isSignUp && (
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-brand-primary-500 border-gray-300 rounded focus:ring-brand-primary-500"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                  Remember my email
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (touched.email && !!emailError) || (touched.password && !!passwordError)}
              className="w-full bg-brand-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-brand-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-brand-primary-500 hover:text-brand-primary-600 font-medium"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
