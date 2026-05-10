import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, AlertCircle, CheckCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Logo } from './Logo';
import { EmailVerificationPendingPage } from './EmailVerificationPendingPage';
import { validateEmail, validatePassword, sanitizeInput, getPasswordStrength } from '../utils/validation';
import { routeAfterAuth } from '../utils/authRouting';

interface SignUpPageProps {
  onNavigate: (page: string) => void;
}

export function SignUpPage({ onNavigate }: SignUpPageProps) {
  const storedUserType = localStorage.getItem('lifezinc_user_type') as 'seeker' | 'therapist' | null;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<string>(storedUserType || 'seeker');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationPending, setShowVerificationPending] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false, confirmPassword: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user, signUp } = useAuth();

  useEffect(() => {
    console.log('[SignUpPage] User type from localStorage:', storedUserType);
  }, [storedUserType]);

  useEffect(() => {
    if (user && !loading) {
      console.log('[SignUpPage] User already logged in, routing after auth');
      routeAfterAuth(user, onNavigate);
    }
  }, [user, loading, onNavigate]);

  const validateForm = (): boolean => {
    const sanitizedEmail = sanitizeInput(email);
    const emailValidation = validateEmail(sanitizedEmail);
    const passwordValidation = validatePassword(password, true);

    setEmailError(emailValidation.isValid ? '' : emailValidation.message);
    setPasswordError(passwordValidation.isValid ? '' : passwordValidation.message);

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    } else {
      setConfirmPasswordError('');
    }

    return emailValidation.isValid && passwordValidation.isValid && password === confirmPassword;
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
      const validation = validatePassword(password, true);
      setPasswordError(validation.isValid ? '' : validation.message);
    }
  };

  const handleConfirmPasswordBlur = () => {
    setTouched({ ...touched, confirmPassword: true });
    if (confirmPassword) {
      if (password !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
      } else {
        setConfirmPasswordError('');
      }
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email) {
      const validation = validateEmail(sanitizeInput(value));
      setEmailError(validation.isValid ? '' : validation.message);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) {
      const validation = validatePassword(value, true);
      setPasswordError(validation.isValid ? '' : validation.message);
    }
    if (touched.confirmPassword && confirmPassword) {
      setConfirmPasswordError(value !== confirmPassword ? 'Passwords do not match' : '');
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (touched.confirmPassword) {
      setConfirmPasswordError(password !== value ? 'Passwords do not match' : '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setTouched({ email: true, password: true, confirmPassword: true });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const sanitizedEmail = sanitizeInput(email);
      const { data, error } = await signUp(sanitizedEmail, password, {
        firstName,
        lastName,
        userType,
      });

      if (error) {
        if (error.message.includes('Invalid email')) {
          setError('Please enter a valid email address.');
        } else if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          console.log('[SignUpPage] Email already registered, redirecting to login');
          onNavigate(`login&email=${encodeURIComponent(sanitizedEmail)}`);
          return;
        } else {
          setError(error.message);
        }
      } else if (data?.user) {
        if (data.user.identities && data.user.identities.length === 0) {
          console.log('[SignUpPage] User already exists (no identities), redirecting to login');
          onNavigate(`login&email=${encodeURIComponent(sanitizedEmail)}`);
          return;
        } else {
          onNavigate(`email-verification-sent&email=${encodeURIComponent(sanitizedEmail)}`);
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showVerificationPending) {
    return <EmailVerificationPendingPage email={email} onNavigate={onNavigate} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <Logo size="md" className="mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Create Your LifeZinc Account
            </h1>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Start tracking your emotions, habits, and daily wins in one safe space.
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
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                  placeholder="Jane"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
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
                I am a...
              </label>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="userType"
                    value="seeker"
                    checked={userType === 'seeker'}
                    onChange={(e) => setUserType(e.target.value)}
                    className="w-4 h-4 text-brand-primary-500 border-gray-300 focus:ring-brand-primary-500"
                  />
                  <span className="ml-3 text-gray-700">Individual / Parent</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="userType"
                    value="therapist"
                    checked={userType === 'therapist'}
                    onChange={(e) => setUserType(e.target.value)}
                    className="w-4 h-4 text-brand-primary-500 border-gray-300 focus:ring-brand-primary-500"
                  />
                  <span className="ml-3 text-gray-700">Coach / Therapist</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-xs text-gray-500">(min 8 characters)</span>
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
                  minLength={8}
                  autoComplete="new-password"
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
              {password && !passwordError && touched.password && (
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  confirmPasswordError && touched.confirmPassword ? 'text-red-400' :
                  confirmPassword && !confirmPasswordError && touched.confirmPassword ? 'text-green-400' :
                  'text-gray-400'
                }`} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  onBlur={handleConfirmPasswordBlur}
                  className={`w-full pl-10 pr-20 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                    confirmPasswordError && touched.confirmPassword
                      ? 'border-red-300 focus:ring-red-500'
                      : confirmPassword && !confirmPasswordError && touched.confirmPassword
                      ? 'border-green-300 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-brand-primary-500'
                  }`}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {confirmPassword && !confirmPasswordError && touched.confirmPassword && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {confirmPasswordError && touched.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{confirmPasswordError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (touched.email && !!emailError) || (touched.password && !!passwordError) || (touched.confirmPassword && !!confirmPasswordError)}
              className="w-full bg-brand-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-brand-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate('login')}
              className="text-sm text-brand-primary-500 hover:text-brand-primary-600 font-medium"
            >
              Already have an account? Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
