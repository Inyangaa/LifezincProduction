/*
  # Enforce Trial Limit on Journal Entries

  ## Summary
  This migration adds a Row Level Security (RLS) policy to enforce the 7-entry trial limit
  at the database level. Non-premium users cannot insert new journal entries once they've
  reached their trial limit.

  ## Changes
  1. **RLS Policy**: Add INSERT policy `enforce_trial_limit_on_insert` to `journal_entries`
     - Blocks inserts when user is not premium AND has exhausted their free trial
     - Premium users (with valid expiration) can always insert
     - Non-premium users can only insert if `free_entries_used < trial_limit`

  ## Security
  This ensures that the trial limit cannot be bypassed client-side. The database itself
  rejects any attempt to create journal entries beyond the trial limit.

  ## Notes
  - Premium status is checked with: `is_premium = true` AND (`premium_expires_at` IS NULL OR `premium_expires_at > now()`)
  - Free users are limited by: `free_entries_used < trial_limit`
  - The policy name explicitly describes its purpose for maintainability
*/

-- Drop existing INSERT policy if it exists (to replace it with the trial-enforcing version)
DROP POLICY IF EXISTS "Users can insert own journal entries" ON journal_entries;

-- Create new INSERT policy that enforces trial limits
CREATE POLICY "Users can insert journal entries within trial limit"
  ON journal_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND (
      -- Allow if user is premium with valid expiration
      EXISTS (
        SELECT 1
        FROM user_preferences up
        WHERE up.user_id = auth.uid()
        AND up.is_premium = true
        AND (up.premium_expires_at IS NULL OR up.premium_expires_at > now())
      )
      -- OR allow if user hasn't reached trial limit
      OR EXISTS (
        SELECT 1
        FROM user_preferences up
        WHERE up.user_id = auth.uid()
        AND (up.free_entries_used IS NULL OR up.free_entries_used < COALESCE(up.trial_limit, 7))
      )
      -- OR allow if user_preferences doesn't exist yet (first entry)
      OR NOT EXISTS (
        SELECT 1
        FROM user_preferences up
        WHERE up.user_id = auth.uid()
      )
    )
  );
