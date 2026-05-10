/*
  # Add Premium Subscription Fields to User Preferences

  ## Summary
  Add premium subscription tracking fields to user_preferences table to support
  premium tier management across multiple payment sources (Stripe, Apple, manual).

  ## Changes to user_preferences Table

  ### New Fields
  1. **is_premium** (boolean, NOT NULL, default: false)
     - Indicates if user has active premium subscription
     - Required field for quick premium status checks

  2. **premium_plan** (text, nullable)
     - Stores the subscription plan type
     - Allowed values: 'monthly' | 'yearly' | null
     - Null when is_premium is false

  3. **premium_source** (text, nullable)
     - Tracks the payment source/platform
     - Allowed values: 'stripe' | 'apple' | 'manual' | null
     - Null when is_premium is false
     - 'manual' for admin-granted premium access

  4. **premium_expires_at** (timestamptz, nullable)
     - Expiration timestamp for premium access
     - Used for automatic expiration checks
     - Null for lifetime premium or when is_premium is false

  ## Security
  - Users can view their own premium status
  - Users can update via existing RLS policies (auto-update via webhooks)
  - Admins can manually update via service role

  ## Index
  - Existing index on user_id (primary key) is sufficient
  - Added composite index on (user_id, is_premium) for premium feature checks
*/

-- Add premium subscription fields to user_preferences
DO $$
BEGIN
  -- Add is_premium field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'is_premium'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN is_premium boolean NOT NULL DEFAULT false;
  END IF;

  -- Add premium_plan field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'premium_plan'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN premium_plan text NULL;
  END IF;

  -- Add premium_source field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'premium_source'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN premium_source text NULL;
  END IF;

  -- Add premium_expires_at field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'premium_expires_at'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN premium_expires_at timestamptz NULL;
  END IF;
END $$;

-- Add check constraints for valid values
DO $$
BEGIN
  -- Check constraint for premium_plan
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_preferences_premium_plan_check'
  ) THEN
    ALTER TABLE user_preferences
    ADD CONSTRAINT user_preferences_premium_plan_check
    CHECK (premium_plan IS NULL OR premium_plan IN ('monthly', 'yearly'));
  END IF;

  -- Check constraint for premium_source
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_preferences_premium_source_check'
  ) THEN
    ALTER TABLE user_preferences
    ADD CONSTRAINT user_preferences_premium_source_check
    CHECK (premium_source IS NULL OR premium_source IN ('stripe', 'apple', 'manual'));
  END IF;
END $$;

-- Add composite index for premium status checks
-- This optimizes queries that filter by user_id and check premium status
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_premium
  ON user_preferences (user_id, is_premium);

-- Ensure index on user_id exists (should already exist as primary key)
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id
  ON user_preferences (user_id);