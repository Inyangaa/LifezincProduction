import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PremiumStatus, UserPreferences } from '../types/premium';

export function usePremiumStatus(userId: string | undefined): PremiumStatus {
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({
    isPremium: false,
    plan: null,
    source: null,
    expiresAt: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!userId) {
      setPremiumStatus({
        isPremium: false,
        plan: null,
        source: null,
        expiresAt: null,
        loading: false,
        error: null,
      });
      return;
    }

    let mounted = true;

    const fetchPremiumStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('is_premium, premium_plan, premium_source, premium_expires_at')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          console.error('[usePremiumStatus] Error fetching premium status:', error);
          if (mounted) {
            setPremiumStatus({
              isPremium: false,
              plan: null,
              source: null,
              expiresAt: null,
              loading: false,
              error: error.message,
            });
          }
          return;
        }

        if (!data) {
          if (mounted) {
            setPremiumStatus({
              isPremium: false,
              plan: null,
              source: null,
              expiresAt: null,
              loading: false,
              error: null,
            });
          }
          return;
        }

        const preferences = data as Pick<UserPreferences, 'is_premium' | 'premium_plan' | 'premium_source' | 'premium_expires_at'>;

        if (mounted) {
          setPremiumStatus({
            isPremium: preferences.is_premium,
            plan: preferences.premium_plan,
            source: preferences.premium_source,
            expiresAt: preferences.premium_expires_at,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        console.error('[usePremiumStatus] Unexpected error:', err);
        if (mounted) {
          setPremiumStatus({
            isPremium: false,
            plan: null,
            source: null,
            expiresAt: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Unknown error',
          });
        }
      }
    };

    fetchPremiumStatus();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel(`premium_status:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_preferences',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('[usePremiumStatus] Real-time update received:', payload);
          const newData = payload.new as UserPreferences;
          setPremiumStatus({
            isPremium: newData.is_premium,
            plan: newData.premium_plan,
            source: newData.premium_source,
            expiresAt: newData.premium_expires_at,
            loading: false,
            error: null,
          });
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [userId]);

  return premiumStatus;
}
