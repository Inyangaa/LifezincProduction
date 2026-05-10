/*
  # Add Email Verification Fields

  1. Changes to user_profiles
    - Add `email_verified` (boolean, default false) - tracks if user has verified their email
    - Add `email_verification_token` (text, nullable) - secure random token for verification
    - Add `email_verification_token_expires_at` (timestamptz, nullable) - token expiry timestamp

  2. Security
    - These fields are protected by existing RLS policies
    - Only users can read/update their own verification status
    - Tokens will be generated server-side for security

  3. Important Notes
    - Existing users will have email_verified = false by default
    - Verification tokens expire after 24 hours
    - Tokens are cleared after successful verification
*/

-- Add email verification fields to user_profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'email_verified'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN email_verified boolean DEFAULT false NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'email_verification_token'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN email_verification_token text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'email_verification_token_expires_at'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN email_verification_token_expires_at timestamptz;
  END IF;
END $$;

-- Create index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_verification_token 
  ON user_profiles(email_verification_token) 
  WHERE email_verification_token IS NOT NULL;
