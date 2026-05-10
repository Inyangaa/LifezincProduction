/*
  # Add Therapist Support

  1. Changes to user_profiles
    - Add `user_type` (text) - either 'seeker' or 'therapist', defaults to 'seeker'
    - Add `therapist_profile_completed` (boolean) - tracks if therapist has completed onboarding

  2. New Tables
    - `therapist_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, unique)
      - `full_name` (text, required)
      - `profession` (text, required) - e.g., "Psychologist", "Therapist / Counselor"
      - `license_region` (text, required) - e.g., "Maryland, USA"
      - `years_experience` (text, required) - e.g., "0-2", "3-5", "6-10", "10+"
      - `practice_type` (text, required) - e.g., "Private practice", "Clinic/Hospital"
      - `focus_areas` (text[], array) - e.g., ["Teens", "Adults", "Anxiety"]
      - `consent_statement_accepted` (boolean, required)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  3. Security
    - Enable RLS on `therapist_profiles` table
    - Add policies for therapists to read and update their own profiles
*/

-- Add user_type and therapist_profile_completed to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'user_type'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN user_type text DEFAULT 'seeker' NOT NULL CHECK (user_type IN ('seeker', 'therapist'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'therapist_profile_completed'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN therapist_profile_completed boolean DEFAULT false NOT NULL;
  END IF;
END $$;

-- Create therapist_profiles table
CREATE TABLE IF NOT EXISTS therapist_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name text NOT NULL,
  profession text NOT NULL CHECK (profession IN (
    'Psychologist',
    'Therapist / Counselor',
    'Social Worker',
    'Psychiatrist',
    'Coach',
    'Other'
  )),
  license_region text NOT NULL,
  years_experience text NOT NULL CHECK (years_experience IN ('0-2', '3-5', '6-10', '10+')),
  practice_type text NOT NULL CHECK (practice_type IN (
    'Private practice',
    'Clinic/Hospital',
    'School/University',
    'Online-only',
    'Other'
  )),
  focus_areas text[] DEFAULT ARRAY[]::text[],
  consent_statement_accepted boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE therapist_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists can read own profile"
  ON therapist_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Therapists can insert own profile"
  ON therapist_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Therapists can update own profile"
  ON therapist_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_therapist_profiles_user_id ON therapist_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON user_profiles(user_type);
