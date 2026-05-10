import { useEffect, useState } from 'react';
import { CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface UpgradeSuccessPageProps {
  onNavigate: (page: string) => void;
}

export function UpgradeSuccessPage({ onNavigate }: UpgradeSuccessPageProps) {
  const [searchParams] = useSearchParams();
  const { refreshSubscription, isPro } = useSubscription();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    const verifyAndRefresh = async () => {
      const sessionId = searchParams.get('session_id');

      if (sessionId) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await refreshSubscription();
      }

      setIsVerifying(false);
      setVerificationComplete(true);

      setTimeout(() => {
        onNavigate('journal');
      }, 3000);
    };

    verifyAndRefresh();
  }, [searchParams, refreshSubscription, onNavigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center">
        {isVerifying ? (
          <>
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Processing your upgrade...
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Please wait while we activate your premium features
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Welcome to LifeZinc Premium!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Your premium subscription is now active. You have unlimited access to all features.
            </p>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-emerald-600" />
                Premium Features Unlocked
              </h3>
              <div className="space-y-3 text-left">
                {[
                  'Unlimited journal entries',
                  'Advanced emotional tracking with 35+ states',
                  'AI-powered insights & pattern detection',
                  'Personalized coping strategies',
                  'Priority support',
                  'Export & backup your data',
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigate('journal')}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all"
            >
              Start Journaling
            </button>

            <p className="text-sm text-gray-500 mt-4">
              Redirecting automatically in a few seconds...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
