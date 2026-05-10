import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Logo } from './Logo';
import { supabase } from '../lib/supabase';
import { sendVerificationEmail } from '../utils/emailService';

interface EmailVerificationSentPageProps {
  email: string;
  onNavigate: (page: string) => void;
}

export function EmailVerificationSentPage({ email, onNavigate }: EmailVerificationSentPageProps) {
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');

  const handleResendEmail = async () => {
    setResending(true);
    setResendError('');
    setResendSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setResendError('User not found. Please sign up again.');
        setResending(false);
        return;
      }

      const newToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          email_verification_token: newToken,
          email_verification_token_expires_at: expiresAt.toISOString(),
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating verification token:', updateError);
        setResendError('Failed to generate new verification link. Please try again.');
        setResending(false);
        return;
      }

      const baseUrl = window.location.origin;
      const verifyUrl = `${baseUrl}/?page=verify-email&token=${newToken}`;

      const { success, error } = await sendVerificationEmail(email, verifyUrl);

      if (success) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      } else {
        setResendError(error || 'Failed to send verification email. Please try again.');
      }
    } catch (err) {
      console.error('Error resending verification email:', err);
      setResendError('Something went wrong. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <Logo size="md" className="mb-4" />
            <div className="w-16 h-16 bg-brand-primary-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-brand-primary-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
              Check Your Email
            </h1>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              We've sent a verification link to
            </p>
            <p className="text-sm sm:text-base font-semibold text-brand-primary-600 text-center mt-1">
              {email}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Account Created Successfully!</p>
                <p>Click the verification link in your email to activate your account and start your emotional wellness journey.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <span className="flex-shrink-0 w-6 h-6 bg-brand-primary-100 rounded-full flex items-center justify-center text-brand-primary-600 font-semibold text-xs">
                1
              </span>
              <p>Check your inbox (and spam folder) for an email from LifeZinc</p>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <span className="flex-shrink-0 w-6 h-6 bg-brand-primary-100 rounded-full flex items-center justify-center text-brand-primary-600 font-semibold text-xs">
                2
              </span>
              <p>Click the "Verify Email Address" button in the email</p>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <span className="flex-shrink-0 w-6 h-6 bg-brand-primary-100 rounded-full flex items-center justify-center text-brand-primary-600 font-semibold text-xs">
                3
              </span>
              <p>Once verified, you can log in and complete your profile</p>
            </div>
          </div>

          {resendSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800">Verification email sent successfully!</p>
            </div>
          )}

          {resendError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{resendError}</p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 text-center mb-4">
              Didn't receive the email?
            </p>
            <button
              onClick={handleResendEmail}
              disabled={resending || resendSuccess}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-brand-primary-500 text-brand-primary-600 rounded-lg hover:bg-brand-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {resending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Resending...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Resend Verification Email
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <button
              onClick={() => onNavigate('login')}
              className="text-brand-primary-500 hover:text-brand-primary-600 font-semibold"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
