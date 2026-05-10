import { useEffect, useState } from 'react';
import { Mail, CheckCircle, XCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Logo } from './Logo';
import { useAuth } from '../contexts/AuthContext';

interface EmailVerificationPageProps {
  onNavigate: (page: string) => void;
}

export function EmailVerificationPage({ onNavigate }: EmailVerificationPageProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      console.log('=== EMAIL VERIFICATION: PROCESSING VERIFICATION LINK ===');
      console.log('[EmailVerification] Full URL:', window.location.href);
      console.log('[EmailVerification] Hash:', window.location.hash);
      console.log('[EmailVerification] Search:', window.location.search);

      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');
      const errorParam = hashParams.get('error');
      const errorDescription = hashParams.get('error_description');

      console.log('[EmailVerification] Hash params:', {
        type,
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        error: errorParam,
        errorDescription
      });

      if (errorParam) {
        console.error('=== EMAIL VERIFICATION: ERROR IN URL ===');
        console.error('[EmailVerification] Error:', errorParam);
        console.error('[EmailVerification] Description:', errorDescription);
        console.error('=== END VERIFICATION ERROR ===');
        setStatus('error');
        setMessage(errorDescription || 'Verification failed. Please try again.');
        return;
      }

      if (type === 'signup' || type === 'email_change' || type === 'magiclink') {
        if (accessToken) {
          console.log('[EmailVerification] Valid verification link detected');
          console.log('[EmailVerification] Type:', type);
          console.log('[EmailVerification] Setting session...');

          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (error) {
            console.error('=== EMAIL VERIFICATION: SESSION ERROR ===');
            console.error('[EmailVerification] Error:', error);
            console.error('[EmailVerification] The verification link may be invalid or expired');
            console.error('=== END SESSION ERROR ===');
            setStatus('error');
            setMessage('Failed to verify your email. The link may be invalid or expired.');
          } else {
            console.log('=== EMAIL VERIFICATION: SUCCESS ===');
            console.log('[EmailVerification] Email verified successfully!');
            console.log('[EmailVerification] Checking profile status...');
            setStatus('success');
            setMessage('Your email has been verified successfully!');

            // Check if user has completed profile
            if (user?.id) {
              const { data: profile } = await supabase
                .from('user_profiles')
                .select('id')
                .eq('user_id', user.id)
                .maybeSingle();

              setProfileChecked(true);

              if (!profile) {
                console.log('[EmailVerification] No profile found - will redirect to profile-setup');
              } else {
                console.log('[EmailVerification] Profile exists - will redirect to journal');
              }
            }

            console.log('=== END VERIFICATION SUCCESS ===');
          }
        } else {
          console.error('=== EMAIL VERIFICATION: MISSING TOKEN ===');
          console.error('[EmailVerification] No access token found in URL');
          console.error('[EmailVerification] URL may be malformed or incomplete');
          console.error('=== END MISSING TOKEN ===');
          setStatus('error');
          setMessage('Invalid verification link. Please try requesting a new one.');
        }
      } else {
        console.error('=== EMAIL VERIFICATION: INVALID TYPE ===');
        console.error('[EmailVerification] Type:', type);
        console.error('[EmailVerification] Expected: signup, email_change, or magiclink');
        console.error('=== END INVALID TYPE ===');
        setStatus('error');
        setMessage('Invalid verification link. Please try requesting a new one.');
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center text-center">
            <Logo size="md" className="mb-6" />

            {status === 'loading' && (
              <>
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                  <Loader className="w-8 h-8 text-teal-600 animate-spin" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  Verifying Your Email
                </h1>
                <p className="text-gray-600">
                  Please wait while we verify your email address...
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  Email Verified!
                </h1>
                <p className="text-gray-600 mb-8">
                  {message} {!profileChecked ? 'Checking your profile...' : 'You can now continue.'}
                </p>
                <button
                  onClick={async () => {
                    // Check profile status and route accordingly
                    if (user?.id) {
                      const { data: profile } = await supabase
                        .from('user_profiles')
                        .select('id')
                        .eq('user_id', user.id)
                        .maybeSingle();

                      if (!profile) {
                        console.log('[EmailVerification] Routing to profile-setup');
                        onNavigate('profile-setup');
                      } else {
                        console.log('[EmailVerification] Routing to journal');
                        onNavigate('journal');
                      }
                    } else {
                      // Fallback to journal if no user (shouldn't happen)
                      onNavigate('journal');
                    }
                  }}
                  className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-full hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg"
                >
                  Continue to LifeZinc
                </button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  Verification Failed
                </h1>
                <p className="text-gray-600 mb-8">
                  {message}
                </p>
                <div className="space-y-3 w-full">
                  <button
                    onClick={() => onNavigate('login')}
                    className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-full hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg"
                  >
                    Go to Login
                  </button>
                  <button
                    onClick={() => onNavigate('signup')}
                    className="w-full py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-all"
                  >
                    Sign Up Again
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
