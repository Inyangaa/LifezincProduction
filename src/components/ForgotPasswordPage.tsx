import { useState } from 'react';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';
import { supabase } from '../lib/supabase';
import { sendPasswordResetEmail } from '../utils/emailService';

interface ForgotPasswordPageProps {
  onNavigate: (page: string) => void;
}

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    console.log('[password-reset] Starting password reset for:', email);

    try {
      // Send password reset email via Supabase Auth
      const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/reset-password`,
      });

      if (resetError) {
        console.error('[password-reset] Supabase resetPasswordForEmail error:', resetError);
      } else {
        console.log('[password-reset] Supabase reset token generated successfully');
      }

      const baseUrl = window.location.origin;
      const resetUrl = `${baseUrl}/#reset-password`;

      console.log('[password-reset] Sending password reset email to:', email);
      console.log('[password-reset] Reset URL:', resetUrl);

      const { success: emailSuccess, error: emailError } = await sendPasswordResetEmail(email, resetUrl);

      if (emailSuccess) {
        console.log('[password-reset] Password reset email sent successfully');
        setSuccess(
          'If an account exists with this email, you will receive password reset instructions shortly.'
        );
        setEmail('');
      } else {
        console.error('[password-reset] FAILED to send password reset email:', emailError);
        setError(
          'We encountered an issue sending the reset email. Please try again later or contact support.'
        );
      }
    } catch (err) {
      console.error('[password-reset] Unexpected error during password reset:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
          <button
            onClick={() => onNavigate('login')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Login</span>
          </button>

          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <Logo size="md" className="mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Reset Your Password
            </h1>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Enter your email address and we'll send you instructions to reset your password.
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
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-brand-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Remember your password?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-brand-primary-500 hover:text-brand-primary-600 font-semibold"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
