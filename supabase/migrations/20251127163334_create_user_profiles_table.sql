/*
  # User Profiles System

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `age_group` (text, required)
      - `life_stage` (text, optional)
      - `support_style` (text, required)
      - `crisis_sensitivity` (text, required)
      - `goal_focus` (text[], array)
      - `nickname` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for users to read and update their own profiles
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  age_group text NOT NULL CHECK (age_group IN ('13-15', '16-17', '18-24', '25-40', '40+')),
  life_stage text CHECK (life_stage IN ('High School', 'College', 'Working', 'Entrepreneur', 'Parent', 'Healing', 'Other')),
  support_style text NOT NULL CHECK (support_style IN ('Soft', 'Direct', 'Faith-based', 'Scientific', 'Balanced')),
  crisis_sensitivity text NOT NULL CHECK (crisis_sensitivity IN ('Low', 'Medium', 'High')),
  goal_focus text[] DEFAULT ARRAY[]::text[],
  nickname text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
