import { useEffect, useState } from 'react';
import { CheckCircle, Loader, ArrowRight } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';

interface SuccessPageProps {
  onNavigate: (page: string) => void;
}

export function SuccessPage({ onNavigate }: SuccessPageProps) {
  const [loading, setLoading] = useState(true);
  const { refreshSubscription } = useSubscription();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (sessionId) {
      setTimeout(async () => {
        await refreshSubscription();
        setLoading(false);
      }, 2000);
    } else {
      setLoading(false);
    }
  }, [refreshSubscription]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <Loader className="w-16 h-16 text-teal-600 mx-auto animate-spin mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Confirming your subscription...
          </h2>
          <p className="text-gray-600">
            Please wait while we activate your plan
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Welcome to LifeZinc Pro!
        </h1>

        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Your subscription is now active. Enjoy unlimited journaling, deeper insights, and all premium features.
        </p>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-left p-3 bg-teal-50 rounded-xl">
            <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
            <span className="text-sm text-gray-700">Unlimited journal entries</span>
          </div>
          <div className="flex items-center gap-3 text-left p-3 bg-teal-50 rounded-xl">
            <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
            <span className="text-sm text-gray-700">Advanced emotional insights</span>
          </div>
          <div className="flex items-center gap-3 text-left p-3 bg-teal-50 rounded-xl">
            <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
            <span className="text-sm text-gray-700">Priority support & updates</span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('journal')}
          className="w-full px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full font-bold text-lg shadow-xl hover:from-teal-600 hover:to-teal-700 transition-all hover:scale-105 flex items-center justify-center gap-2"
        >
          <span>Start Journaling</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
