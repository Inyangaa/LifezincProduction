import { supabase } from '../lib/supabase';

export interface JournalEntryData {
  text_entry: string;
  mood: string | null;
  emotions?: string[] | null;
  category?: string | null;
  tags?: string[] | null;
  initial_reframe?: string | null;
  is_inner_child_mode?: boolean;
  action_text?: string | null;
  action_completed?: boolean;
  chapter_id?: string | null;
}

export interface SaveEntryResult {
  success: boolean;
  data?: any;
  error?: string;
  errorCode?: 'TRIAL_EXHAUSTED' | 'RLS_DENIED' | 'NETWORK_ERROR' | 'UNKNOWN';
}

/**
 * Centralized function to save journal entries with proper trial limit enforcement
 * and error handling.
 */
export async function saveJournalEntry(
  userId: string,
  entryData: JournalEntryData
): Promise<SaveEntryResult> {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([
        {
          ...entryData,
          user_id: userId,
        },
      ])
      .select();

    if (error) {
      console.error('[saveJournalEntry] Error:', error);

      // Check if it's an RLS policy violation (trial limit reached)
      if (
        error.code === '42501' ||
        error.message?.includes('row-level security') ||
        error.message?.includes('policy')
      ) {
        return {
          success: false,
          error: "You've reached your 7 free entries. Upgrade to continue journaling.",
          errorCode: 'TRIAL_EXHAUSTED',
        };
      }

      // Network or other errors
      return {
        success: false,
        error: error.message || 'Failed to save journal entry',
        errorCode: error.code === 'PGRST301' ? 'NETWORK_ERROR' : 'UNKNOWN',
      };
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        error: 'No data returned from database',
        errorCode: 'UNKNOWN',
      };
    }

    return {
      success: true,
      data: data[0],
    };
  } catch (error) {
    console.error('[saveJournalEntry] Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      errorCode: 'UNKNOWN',
    };
  }
}

/**
 * Check if user has reached their trial limit by fetching current status from database
 */
export async function checkTrialStatus(userId: string): Promise<{
  hasReachedLimit: boolean;
  isPremium: boolean;
  freeEntriesUsed: number;
  trialLimit: number;
}> {
  const { data } = await supabase
    .from('user_preferences')
    .select('is_premium, premium_expires_at, free_entries_used, trial_limit')
    .eq('user_id', userId)
    .maybeSingle();

  if (!data) {
    // No preferences yet, user is on first entry
    return {
      hasReachedLimit: false,
      isPremium: false,
      freeEntriesUsed: 0,
      trialLimit: 7,
    };
  }

  const isPremiumActive =
    data.is_premium &&
    (!data.premium_expires_at || new Date(data.premium_expires_at) > new Date());

  const freeEntriesUsed = data.free_entries_used || 0;
  const trialLimit = data.trial_limit || 7;
  const hasReachedLimit = !isPremiumActive && freeEntriesUsed >= trialLimit;

  return {
    hasReachedLimit,
    isPremium: isPremiumActive,
    freeEntriesUsed,
    trialLimit,
  };
}

/**
 * Increment the free entries counter for non-premium users
 */
export async function incrementFreeEntriesCounter(userId: string): Promise<void> {
  try {
    // First check if user is premium
    const { data: prefs } = await supabase
      .from('user_preferences')
      .select('is_premium, premium_expires_at, free_entries_used, trial_limit')
      .eq('user_id', userId)
      .maybeSingle();

    if (!prefs) {
      console.warn('[incrementFreeEntriesCounter] No user preferences found');
      return;
    }

    const isPremiumActive =
      prefs.is_premium &&
      (!prefs.premium_expires_at || new Date(prefs.premium_expires_at) > new Date());

    // Don't increment for premium users
    if (isPremiumActive) {
      console.log('[incrementFreeEntriesCounter] User is premium, skipping increment');
      return;
    }

    const newCount = (prefs.free_entries_used || 0) + 1;
    const updateData: any = {
      free_entries_used: newCount,
    };

    // Mark trial as exhausted when limit is reached
    if (newCount >= (prefs.trial_limit || 7)) {
      updateData.trial_exhausted_at = new Date().toISOString();
    }

    console.log('[incrementFreeEntriesCounter] Incrementing counter:', {
      from: prefs.free_entries_used,
      to: newCount,
      limit: prefs.trial_limit || 7,
    });

    await supabase
      .from('user_preferences')
      .update(updateData)
      .eq('user_id', userId);
  } catch (error) {
    console.error('[incrementFreeEntriesCounter] Error:', error);
  }
}
