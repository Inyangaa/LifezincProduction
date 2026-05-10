import { supabase } from '../lib/supabase';

const SESSION_START_KEY = 'lifezinc_session_start';

export function markSessionStart() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_START_KEY, new Date().toISOString());
  }
}

export function isNewSession(): boolean {
  if (typeof window === 'undefined') return false;

  const sessionStart = localStorage.getItem(SESSION_START_KEY);
  return sessionStart === null;
}

export async function updateLastCheckInTime(userId: string) {
  try {
    await supabase
      .from('user_preferences')
      .update({
        last_check_in_time: new Date().toISOString(),
        feedback_shown_this_session: false
      })
      .eq('user_id', userId);
  } catch (error) {
    console.error('Error updating last check-in time:', error);
  }
}

export async function shouldShowFeedbackModal(userId: string): Promise<boolean> {
  try {
    if (!isNewSession()) {
      return false;
    }

    const { data, error } = await supabase
      .from('user_preferences')
      .select('last_check_in_time, feedback_shown_this_session')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      return false;
    }

    const hasCompletedCheckIn = data.last_check_in_time !== null;
    const feedbackNotShown = data.feedback_shown_this_session === false;

    return hasCompletedCheckIn && feedbackNotShown;
  } catch (error) {
    console.error('Error checking feedback modal status:', error);
    return false;
  }
}

export async function markFeedbackShown(userId: string) {
  try {
    await supabase
      .from('user_preferences')
      .update({ feedback_shown_this_session: true })
      .eq('user_id', userId);
  } catch (error) {
    console.error('Error marking feedback as shown:', error);
  }
}
