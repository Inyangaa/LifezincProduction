import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { Logo } from './Logo';
import { supabase } from '../lib/supabase';
import { sendVerificationEmail } from '../utils/emailService';

interface VerifyEmailPageProps {
  token: string;
  onNavigate: (page: string) => void;
}

export function VerifyEmailPage({ token, onNavigate }: VerifyEmailPageProps) {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'expired'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    console.log('[VerifyEmailPage] Starting verification for token:', token);

    try {
      const { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('user_id, email_verification_token, email_verification_token_expires_at')
        .eq('email_verification_token', token)
        .maybeSingle();

      console.log('[VerifyEmailPage] Profile lookup result:', { profile, fetchError });

      if (fetchError) {
        console.error('[VerifyEmailPage] Error fetching profile:', fetchError);
        setStatus('error');
        setErrorMessage('An error occurred while verifying your email. Please try again.');
        return;
      }

      if (!profile) {
        console.log('[VerifyEmailPage] No profile found with this token');
        setStatus('error');
        setErrorMessage('This verification link is invalid. Please check your email for the correct link.');
        return;
      }

      if (!profile.email_verification_token_expires_at) {
        console.log('[VerifyEmailPage] Token has no expiry date');
        setStatus('error');
        setErrorMessage('This verification link is invalid.');
        return;
      }

      const expiresAt = new Date(profile.email_verification_token_expires_at);
      const now = new Date();

      console.log('[VerifyEmailPage] Token expiry check:', {
        expiresAt: expiresAt.toISOString(),
        now: now.toISOString(),
        isExpired: now > expiresAt
      });

      if (now > expiresAt) {
        console.log('[VerifyEmailPage] Token expired');

        const { data: userData } = await supabase.auth.admin.getUserById(profile.user_id);
        if (userData?.user?.email) {
          setUserEmail(userData.user.email);
        }

        setStatus('expired');
        setErrorMessage('This verification link has expired. Please request a new one.');
        return;
      }

      const { data: userData } = await supabase.auth.admin.getUserById(profile.user_id);
      if (userData?.user?.email) {
        setUserEmail(userData.user.email);
      }

      console.log('[VerifyEmailPage] Updating profile to mark as verified');

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          email_verified: true,
          email_verification_token: null,
          email_verification_token_expires_at: null,
        })
        .eq('user_id', profile.user_id);

      if (updateError) {
        console.error('[VerifyEmailPage] Error updating profile:', updateError);
        setStatus('error');
        setErrorMessage('Failed to verify your email. Please try again.');
        return;
      }

      console.log('[VerifyEmailPage] Email verified successfully');
      setStatus('success');
    } catch (err) {
      console.error('[VerifyEmailPage] Unexpected error:', err);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  const handleResendEmail = async () => {
    if (!userEmail) {
      setErrorMessage('Unable to resend email. Please contact support.');
      return;
    }

    setResending(true);

    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('email_verification_token', token)
        .maybeSingle();

      if (!profile) {
        setErrorMessage('Unable to find your account. Please sign up again.');
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
        .eq('user_id', profile.user_id);

      if (updateError) {
        setErrorMessage('Failed to generate new verification link. Please try again.');
        setResending(false);
        return;
      }

      const baseUrl = window.location.origin;
      const verifyUrl = `${baseUrl}/?page=verify-email&token=${newToken}`;

      const { success, error } = await sendVerificationEmail(userEmail, verifyUrl);

      if (success) {
        onNavigate(`email-verification-sent&email=${encodeURIComponent(userEmail)}`);
      } else {
        setErrorMessage(error || 'Failed to send verification email. Please try again.');
      }
    } catch (err) {
      console.error('Error resending verification email:', err);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setResending(false);
    }
  };

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <Logo size="md" className="mx-auto mb-6" />
          <Loader2 className="w-12 h-12 text-brand-primary-500 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email</h1>
          <p className="text-gray-600">Please wait while we verify your email address...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <Logo size="md" className="mx-auto mb-6" />
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
          <p className="text-gray-600 mb-6">
            Your email has been successfully verified. You can now log in to LifeZinc and start your emotional wellness journey.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="w-full bg-brand-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-brand-primary-600 transition-colors"
          >
            Continue to Login
          </button>
        </div>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <Logo size="md" className="mx-auto mb-6" />
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-10 h-10 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h1>
          <p className="text-gray-600 mb-6">
            This verification link has expired. Verification links are valid for 24 hours. Click below to receive a new verification email.
          </p>
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {errorMessage}
            </div>
          )}
          <button
            onClick={handleResendEmail}
            disabled={resending}
            className="w-full bg-brand-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-brand-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          >
            {resending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </span>
            ) : (
              'Send New Verification Email'
            )}
          </button>
          <button
            onClick={() => onNavigate('login')}
            className="w-full text-brand-primary-500 hover:text-brand-primary-600 font-semibold"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <Logo size="md" className="mx-auto mb-6" />
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
        <p className="text-gray-600 mb-4">{errorMessage}</p>
        <div className="space-y-3">
          <button
            onClick={() => onNavigate('signup')}
            className="w-full bg-brand-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-brand-primary-600 transition-colors"
          >
            Create New Account
          </button>
          <button
            onClick={() => onNavigate('login')}
            className="w-full text-brand-primary-500 hover:text-brand-primary-600 font-semibold"
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
}
