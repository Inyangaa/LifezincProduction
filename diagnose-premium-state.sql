-- Diagnose Premium State for User
-- Replace 'YOUR_USER_ID' with the actual user ID you want to check

-- 1. Check user_preferences table
SELECT
  user_id,
  is_premium,
  premium_plan,
  premium_source,
  premium_expires_at,
  free_entries_used,
  trial_limit,
  trial_exhausted_at,
  stripe_customer_id,
  created_at,
  updated_at,
  -- Calculate if premium is actually active
  CASE
    WHEN is_premium = true AND (premium_expires_at IS NULL OR premium_expires_at > NOW()) THEN 'ACTIVE PREMIUM'
    WHEN is_premium = true AND premium_expires_at <= NOW() THEN 'EXPIRED PREMIUM'
    WHEN free_entries_used >= COALESCE(trial_limit, 7) THEN 'TRIAL EXHAUSTED'
    WHEN free_entries_used < COALESCE(trial_limit, 7) THEN 'TRIAL ACTIVE (' || free_entries_used || '/' || COALESCE(trial_limit, 7) || ')'
    ELSE 'UNKNOWN'
  END as computed_status
FROM user_preferences
WHERE user_id = 'YOUR_USER_ID';

-- 2. Count journal entries
SELECT
  COUNT(*) as total_entries,
  MIN(created_at) as first_entry,
  MAX(created_at) as last_entry
FROM journal_entries
WHERE user_id = 'YOUR_USER_ID';

-- 3. Check if RLS policy would block next insert
-- This simulates what happens when user tries to save
SELECT
  CASE
    WHEN EXISTS (
      SELECT 1
      FROM user_preferences up
      WHERE up.user_id = 'YOUR_USER_ID'
      AND up.is_premium = true
      AND (up.premium_expires_at IS NULL OR up.premium_expires_at > NOW())
    ) THEN 'INSERT ALLOWED - User is Premium'
    WHEN EXISTS (
      SELECT 1
      FROM user_preferences up
      WHERE up.user_id = 'YOUR_USER_ID'
      AND (up.free_entries_used IS NULL OR up.free_entries_used < COALESCE(up.trial_limit, 7))
    ) THEN 'INSERT ALLOWED - Under Trial Limit'
    WHEN NOT EXISTS (
      SELECT 1
      FROM user_preferences up
      WHERE up.user_id = 'YOUR_USER_ID'
    ) THEN 'INSERT ALLOWED - No Preferences Yet (First Entry)'
    ELSE 'INSERT BLOCKED - Trial Exhausted'
  END as rls_policy_decision;

-- 4. Check user_subscriptions table (legacy)
SELECT
  user_id,
  tier,
  status,
  started_at,
  expires_at,
  created_at
FROM user_subscriptions
WHERE user_id = 'YOUR_USER_ID';

-- 5. Recent journal entries (to see activity)
SELECT
  id,
  created_at,
  mood,
  category,
  LEFT(text_entry, 50) || '...' as entry_preview
FROM journal_entries
WHERE user_id = 'YOUR_USER_ID'
ORDER BY created_at DESC
LIMIT 10;

-- 6. Check if Stripe customer exists
SELECT
  user_id,
  stripe_customer_id,
  CASE
    WHEN stripe_customer_id IS NOT NULL THEN 'HAS STRIPE CUSTOMER'
    ELSE 'NO STRIPE CUSTOMER'
  END as stripe_status
FROM user_preferences
WHERE user_id = 'YOUR_USER_ID';

-- EXAMPLE: Why UI might think user is Pro when they're not:
-- Common scenarios:
-- 1. is_premium = true BUT premium_expires_at is in the past (expired subscription)
-- 2. user_subscriptions.tier = 'pro' BUT expired (legacy table)
-- 3. Frontend caching old premium status
-- 4. Real-time subscription not updating properly

-- To reset a user's trial for testing:
-- UPDATE user_preferences
-- SET
--   free_entries_used = 0,
--   trial_exhausted_at = NULL,
--   is_premium = false,
--   premium_expires_at = NULL
-- WHERE user_id = 'YOUR_USER_ID';
