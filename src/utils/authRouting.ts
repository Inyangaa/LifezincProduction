import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id?: string;
  email_verified?: boolean;
  user_type?: 'seeker' | 'therapist';
  therapist_profile_completed?: boolean;
}

export async function routeAfterAuth(
  user: User,
  onNavigate: (page: string) => void
): Promise<void> {
  console.log('[routeAfterAuth] Routing user after authentication', {
    userId: user.id,
    email: user.email,
    emailConfirmed: user.email_confirmed_at,
  });

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('id, email_verified, user_type, therapist_profile_completed')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('[routeAfterAuth] Error fetching user profile:', error);
  }

  const userProfile: UserProfile | null = profile
    ? {
        id: profile.id,
        email_verified: profile.email_verified,
        user_type: profile.user_type,
        therapist_profile_completed: profile.therapist_profile_completed,
      }
    : null;

  console.log('[routeAfterAuth] User profile:', userProfile);

  if (!userProfile || !userProfile.id) {
    console.log('[routeAfterAuth] No profile found, routing to profile-setup');
    onNavigate('profile-setup');
    return;
  }

  // DEV MODE: Email verification disabled
  // if (!userProfile.email_verified) {
  //   console.log('[routeAfterAuth] Email not verified, routing to verify-email');
  //   onNavigate('verify-email');
  //   return;
  // }

  if (userProfile.user_type === 'therapist' && !userProfile.therapist_profile_completed) {
    console.log('[routeAfterAuth] Therapist profile incomplete, routing to therapist-setup');
    onNavigate('therapist-setup');
    return;
  }

  console.log('[routeAfterAuth] Routing to journal (emoji check-in page)');
  onNavigate('journal');
}
