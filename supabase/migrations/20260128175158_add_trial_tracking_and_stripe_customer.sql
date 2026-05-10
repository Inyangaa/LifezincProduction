/*
  # Add Trial Tracking and Stripe Customer ID

  1. Changes to user_preferences table
    - Add `free_entries_used` (integer) - tracks how many free journal entries user has created
    - Add `trial_limit` (integer) - configurable limit for free entries (default 7)
    - Add `trial_exhausted_at` (timestamp) - when user hit the trial limit
    - Add `stripe_customer_id` (text) - Stripe customer ID for subscription management

  2. Security
    - Existing RLS policies will apply to new columns
    - Only authenticated users can read/update their own preferences

  3. Migration Notes
    - Default trial_limit to 7 for all users
    - Initialize free_entries_used to 0 for existing users
    - Nullable stripe_customer_id (populated on first Stripe interaction)
*/

-- Add trial tracking columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'free_entries_used'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN free_entries_used INTEGER NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'trial_limit'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN trial_limit INTEGER NOT NULL DEFAULT 7;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'trial_exhausted_at'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN trial_exhausted_at TIMESTAMPTZ NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN stripe_customer_id TEXT NULL;
  END IF;
END $$;

-- Create index on stripe_customer_id for faster lookups during webhook processing
CREATE INDEX IF NOT EXISTS idx_user_preferences_stripe_customer_id 
ON user_preferences(stripe_customer_id) 
WHERE stripe_customer_id IS NOT NULL;
