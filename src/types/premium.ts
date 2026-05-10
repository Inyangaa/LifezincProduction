export type PremiumPlan = 'monthly' | 'yearly';
export type PremiumSource = 'stripe' | 'apple' | 'manual';

export interface PremiumStatus {
  isPremium: boolean;
  plan: PremiumPlan | null;
  source: PremiumSource | null;
  expiresAt: string | null;
  loading: boolean;
  error: string | null;
}

export interface UserPreferences {
  user_id: string;
  theme: string;
  faith_support_enabled: boolean;
  faith_tradition: string | null;
  inner_child_mode: boolean;
  guidance_voice: string;
  teen_mode: boolean;
  consent_accepted: boolean;
  consent_accepted_at: string | null;
  is_premium: boolean;
  premium_plan: PremiumPlan | null;
  premium_source: PremiumSource | null;
  premium_expires_at: string | null;
  created_at: string;
  updated_at: string;
}
