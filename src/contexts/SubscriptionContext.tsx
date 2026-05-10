import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface Subscription {
  id: string;
  tier: 'free' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  started_at: string;
  expires_at: string | null;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  loading: boolean;
  isPro: boolean;
  entryCount: number;
  hasReachedLimit: boolean;
  canAccessFeature: (feature: string) => boolean;
  refreshSubscription: () => Promise<void>;
  freeEntriesUsed: number;
  trialLimit: number;
  freeEntriesRemaining: number;
  incrementTrialCounter: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const PRO_FEATURES = [
  'ai_coaching',
  'unlimited_history',
  'voice_journaling',
  'pdf_export',
  'advanced_insights',
  'priority_support',
];

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [entryCount, setEntryCount] = useState(0);
  const [freeEntriesUsed, setFreeEntriesUsed] = useState(0);
  const [trialLimit, setTrialLimit] = useState(7);
  const [isPremium, setIsPremium] = useState(false);

  const loadSubscription = async () => {
    if (!user) {
      setSubscription(null);
      const localCount = parseInt(localStorage.getItem('lifezinc_entry_count') || '0');
      setEntryCount(localCount);
      setFreeEntriesUsed(localCount);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error loading subscription:', error);
    } else if (data) {
      setSubscription(data);
    } else {
      const { data: newSub, error: insertError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          tier: 'free',
          status: 'active',
        })
        .select()
        .single();

      if (!insertError && newSub) {
        setSubscription(newSub);
      }
    }

    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('free_entries_used, trial_limit, is_premium, premium_expires_at, premium_source, premium_plan')
      .eq('user_id', user.id)
      .maybeSingle();

    if (preferences) {
      setFreeEntriesUsed(preferences.free_entries_used || 0);
      setTrialLimit(preferences.trial_limit || 7);

      const isPremiumActive = preferences.is_premium && (
        !preferences.premium_expires_at ||
        new Date(preferences.premium_expires_at) > new Date()
      );
      setIsPremium(isPremiumActive);

      console.log('[SubscriptionContext] Premium status check:', {
        is_premium: preferences.is_premium,
        premium_expires_at: preferences.premium_expires_at,
        premium_source: preferences.premium_source,
        premium_plan: preferences.premium_plan,
        isPremiumActive,
        free_entries_used: preferences.free_entries_used,
        trial_limit: preferences.trial_limit
      });
    }

    const { count } = await supabase
      .from('journal_entries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    setEntryCount(count || 0);
    setLoading(false);
  };

  useEffect(() => {
    loadSubscription();
  }, [user]);

  const incrementTrialCounter = async () => {
    if (!user || isPremium) return;

    const newCount = freeEntriesUsed + 1;
    setFreeEntriesUsed(newCount);

    const updateData: any = {
      free_entries_used: newCount,
    };

    if (newCount >= trialLimit) {
      updateData.trial_exhausted_at = new Date().toISOString();
    }

    await supabase
      .from('user_preferences')
      .update(updateData)
      .eq('user_id', user.id);
  };

  const isPro = (subscription?.tier === 'pro' && subscription?.status === 'active') || isPremium;
  const hasReachedLimit = !isPro && freeEntriesUsed >= trialLimit;
  const freeEntriesRemaining = Math.max(0, trialLimit - freeEntriesUsed);

  const canAccessFeature = (feature: string): boolean => {
    if (isPro) return true;
    return !PRO_FEATURES.includes(feature);
  };

  const refreshSubscription = async () => {
    await loadSubscription();
  };

  const value = {
    subscription,
    loading,
    isPro,
    entryCount,
    hasReachedLimit,
    canAccessFeature,
    refreshSubscription,
    freeEntriesUsed,
    trialLimit,
    freeEntriesRemaining,
    incrementTrialCounter,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
