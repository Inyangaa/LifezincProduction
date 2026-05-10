import { PremiumStatus } from '../types/premium';

export interface PremiumCheckResult {
  allowed: boolean;
  reason?: 'loading' | 'not-premium';
}

export function requirePremium(premiumStatus: PremiumStatus): PremiumCheckResult {
  if (premiumStatus.loading) {
    return { allowed: false, reason: 'loading' };
  }

  if (!premiumStatus.isPremium) {
    return { allowed: false, reason: 'not-premium' };
  }

  return { allowed: true };
}

export const PREMIUM_FEATURES = {
  ADVANCED_EMOTION_FLOW: 'Advanced Emotion Tracking',
  INSIGHTS: 'Pattern Detection & Insights',
  ANALYTICS: 'Advanced Analytics Dashboard',
} as const;

export type PremiumFeature = typeof PREMIUM_FEATURES[keyof typeof PREMIUM_FEATURES];

export const PREMIUM_ROUTES = [
  '/advanced-emotion-flow',
  '/insights',
  '/analytics',
] as const;

export function isPremiumRoute(pathname: string): boolean {
  return PREMIUM_ROUTES.includes(pathname as typeof PREMIUM_ROUTES[number]);
}
