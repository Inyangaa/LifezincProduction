/*
  # Add Consent & Safety Gate Field

  1. Changes
    - Add `consent_accepted` (boolean) to user_preferences table
    - Add `consent_accepted_at` (timestamptz) to track when consent was given
    - Default value is false for existing users (they will see the gate on next login)
  
  2. Purpose
    - Track whether user has accepted the consent & safety disclaimer
    - Required before first app use
    - Can be re-opened from Settings at any time
  
  3. Security
    - Users can update their own consent status via existing RLS policies
*/

-- Add consent fields to user_preferences
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'consent_accepted'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN consent_accepted boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'consent_accepted_at'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN consent_accepted_at timestamptz;
  END IF;
END $$;
