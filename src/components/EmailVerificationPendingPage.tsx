import { Mail, ArrowRight, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Logo } from './Logo';

interface EmailVerificationPendingPageProps {
  email: string;
  onNavigate: (page: string) => void;
}

export function EmailVerificationPendingPage({ email, onNavigate }: EmailVerificationPendingPageProps) {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');
  const [sendingMagicLink, setSendingMagicLink] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  useEffect(() => {
    console.log('=== EMAIL VERIFICATION: PENDING PAGE ===');
    console.log('[EmailVerificationPending] User email:', email);
    console.log('[EmailVerificationPending] Verification email should have been sent to:', email);
    console.log('[EmailVerificationPending] User should:');
    console.log('[EmailVerificationPending]   1. Check inbox (and spam) for verification email');
    console.log('[EmailVerificationPending]   2. Click verification link in email');
    console.log('[EmailVerificationPending]   3. Or use "Resend" / "Magic Link" buttons below');
    console.log('[EmailVerificationPending]   4. Or try logging in directly (for testing)');
    console.log('=== END PENDING PAGE ===');
  }, [email]);

  const handleResendEmail = async () => {
    setResending(true);
    setError('');
    setResent(false);

    try {
      console.log('=== EMAIL VERIFICATION: RESEND REQUESTED ===');
      console.log('[EmailVerificationPending] Email:', email);

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        console.error('=== EMAIL VERIFICATION: RESEND ERROR ===');
        console.error('[EmailVerificationPending] Error:', error);
        console.error('=== END RESEND ERROR ===');
        setError('Failed to resend email. Please try again.');
      } else {
        console.log('=== EMAIL VERIFICATION: RESEND SUCCESS ===');
        console.log('[EmailVerificationPending] Verification email resent to:', email);
        console.log('[EmailVerificationPending] User should check inbox and spam folder');
        console.log('=== END RESEND SUCCESS ===');
        setResent(true);
        setTimeout(() => setResent(false), 5000);
      }
    } catch (err) {
      console.error('=== EMAIL VERIFICATION: RESEND EXCEPTION ===');
      console.error('[EmailVerificationPending] Error:', err);
      console.error('=== END RESEND EXCEPTION ===');
      setError('Something went wrong. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleSendMagicLink = async () => {
    setSendingMagicLink(true);
    setError('');
    setMagicLinkSent(false);

    try {
      console.log('=== EMAIL VERIFICATION: MAGIC LINK REQUESTED ===');
      console.log('[EmailVerificationPending] Email:', email);
      console.log('[EmailVerificationPending] Sending passwordless login link...');

      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}`,
        },
      });

      if (error) {
        console.error('=== EMAIL VERIFICATION: MAGIC LINK ERROR ===');
        console.error('[EmailVerificationPending] Error:', error);
        console.error('=== END MAGIC LINK ERROR ===');
        setError('Failed to send magic link. Please try again.');
      } else {
        console.log('=== EMAIL VERIFICATION: MAGIC LINK SUCCESS ===');
        console.log('[EmailVerificationPending] Magic link sent to:', email);
        console.log('[EmailVerificationPending] This link will verify email AND log user in');
        console.log('[EmailVerificationPending] User should check inbox and spam folder');
        console.log('=== END MAGIC LINK SUCCESS ===');
        setMagicLinkSent(true);
      }
    } catch (err) {
      console.error('=== EMAIL VERIFICATION: MAGIC LINK EXCEPTION ===');
      console.error('[EmailVerificationPending] Error:', err);
      console.error('=== END MAGIC LINK EXCEPTION ===');
      setError('Something went wrong. Please try again.');
    } finally {
      setSendingMagicLink(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center text-center">
            <Logo size="md" className="mb-6" />

            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-teal-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Check Your Email
            </h1>

            <p className="text-gray-600 mb-2">
              We've sent a verification link to:
            </p>
            <p className="text-teal-600 font-semibold mb-6">
              {email}
            </p>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Next steps:</strong>
              </p>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Check your inbox (and spam folder)</li>
                <li>Click the verification link in the email</li>
                <li>You'll be redirected back to LifeZinc</li>
              </ol>
            </div>

            {resent && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg w-full">
                <p className="text-sm text-green-800 text-center">
                  Verification email resent successfully!
                </p>
              </div>
            )}

            {magicLinkSent && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg w-full">
                <p className="text-sm text-blue-800 text-center">
                  Magic link sent! Check your email and click the link to sign in instantly.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg w-full">
                <p className="text-sm text-red-800 text-center">
                  {error}
                </p>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 w-full">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-left w-full">
                  <p className="text-sm font-semibold text-amber-900 mb-1">
                    Email not arriving?
                  </p>
                  <p className="text-xs text-amber-800 mb-3">
                    If you don't see the verification email, you can use a magic link instead. It works the same way and will verify your account.
                  </p>
                  <button
                    onClick={handleSendMagicLink}
                    disabled={sendingMagicLink}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LinkIcon className="w-4 h-4" />
                    {sendingMagicLink ? 'Sending...' : 'Send Magic Link Instead'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 w-full">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    For Development/Testing
                  </p>
                  <p className="text-xs text-blue-800 mb-2">
                    If emails aren't working in your environment, you can also log in directly. Your account has been created successfully.
                  </p>
                  <button
                    onClick={() => onNavigate('login')}
                    className="text-xs text-blue-600 underline hover:text-blue-800"
                  >
                    Try logging in now
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleResendEmail}
              disabled={resending}
              className="w-full py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-all mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? 'Sending...' : 'Resend Verification Email'}
            </button>

            <button
              onClick={() => onNavigate('login')}
              className="w-full py-3 text-teal-600 font-semibold hover:text-teal-700 transition-all flex items-center justify-center gap-2"
            >
              <span>Back to Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
