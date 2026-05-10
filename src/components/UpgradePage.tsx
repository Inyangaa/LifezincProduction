import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Award, Crown, Check, Loader2 } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useSearchParams } from 'react-router-dom';

interface UpgradePageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export default function UpgradePage({ onBack, onNavigate }: UpgradePageProps) {
  const { user } = useAuth();
  const { freeEntriesUsed, trialLimit, isPro } = useSubscription();
  const [searchParams] = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const reason = searchParams.get('reason');
    const from = searchParams.get('from');
    console.log('[UpgradePage] Mounted successfully - reason:', reason, 'from:', from);
  }, [searchParams]);

  const handleUpgrade = async () => {
    if (!user) {
      console.log('[UpgradePage] No user, redirecting to login');
      onNavigate('login');
      return;
    }

    console.log('[UpgradePage] Starting checkout for plan:', selectedPlan);
    setIsLoading(true);
    setError(null);

    try {
      console.log('[UpgradePage] Calling create-checkout-session edge function...');
      const { data, error: fnError } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          plan: selectedPlan,
        },
      });

      console.log('[UpgradePage] Edge function response:', { data, error: fnError });

      if (fnError) {
        throw new Error(fnError.message || 'Failed to create checkout session');
      }

      if (data?.url) {
        console.log('[UpgradePage] Redirecting to Stripe checkout:', data.url);
        window.location.href = data.url;
      } else {
        console.error('[UpgradePage] No checkout URL in response:', data);
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      console.error('[UpgradePage] Checkout error:', err);
      setError(err.message || 'Failed to start checkout. Please try again.');
      setIsLoading(false);
    }
  };

  if (isPro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            You're already a Pro member!
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            You have unlimited access to all LifeZinc features.
          </p>
          <button
            onClick={() => onNavigate('journal')}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full font-semibold hover:from-teal-600 hover:to-teal-700 transition-all"
          >
            Continue Journaling
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full mb-4">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Upgrade to LifeZinc Premium
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Unlock advanced features designed to accelerate your mental health journey
            </p>
          </div>

          <div className="mb-8 bg-gray-50 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Your Status
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Free entries used:</span>
              <span className="font-bold text-gray-900">{freeEntriesUsed} / {trialLimit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all"
                style={{ width: `${Math.min((freeEntriesUsed / trialLimit) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={`cursor-pointer rounded-2xl border-2 p-6 transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg'
                  : 'border-gray-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Monthly</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-emerald-600">$9.99</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === 'monthly' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                  }`}
                >
                  {selectedPlan === 'monthly' && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Perfect for trying premium with flexibility to cancel anytime
              </p>
            </div>

            <div
              onClick={() => setSelectedPlan('yearly')}
              className={`cursor-pointer rounded-2xl border-2 p-6 transition-all relative ${
                selectedPlan === 'yearly'
                  ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg'
                  : 'border-gray-200 hover:border-amber-300'
              }`}
            >
              <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                BEST VALUE
              </div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Yearly</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-amber-600">$79.99</span>
                    <span className="text-gray-600">/year</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Just $6.67/month</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === 'yearly' ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
                  }`}
                >
                  {selectedPlan === 'yearly' && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Best value for committed growth. Save $40 per year
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Premium Features
            </h3>
            <div className="space-y-3">
              {[
                {
                  title: 'Advanced emotional states + deep reflection flow',
                  description: 'Track 35+ emotional states with intensity levels for deeper self-awareness'
                },
                {
                  title: 'Insights & trends over time',
                  description: 'AI-powered pattern detection to understand your emotional journey'
                },
                {
                  title: 'Personalized coping action plans',
                  description: 'Customized strategies based on your unique patterns and needs'
                },
                {
                  title: 'Advanced pattern detection',
                  description: 'Identify triggers, cycles, and growth opportunities automatically'
                }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-emerald-50/30 rounded-xl">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h4>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5" />
                  <span>Upgrade to Premium</span>
                </>
              )}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Cancel anytime. No questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}
