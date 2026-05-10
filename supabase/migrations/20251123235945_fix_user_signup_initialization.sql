/*
  # Fix User Signup Initialization

  1. Changes
    - Drop existing conflicting triggers for user creation
    - Create a single consolidated function that initializes all user tables
    - Create a single trigger that calls this function
    
  2. Tables Initialized
    - user_preferences (theme, settings)
    - user_gamification (gems, level, XP)
    - user_subscriptions (free tier by default)
    - user_streaks (tracking data)
    
  3. Security
    - Function runs with SECURITY DEFINER to bypass RLS during initialization
    - All records are created with proper user_id association
*/

-- Drop existing triggers to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_user_created_gamification ON auth.users;
DROP TRIGGER IF EXISTS on_user_created_preferences ON auth.users;
DROP TRIGGER IF EXISTS on_user_created_streaks ON auth.users;

-- Drop existing functions
DROP FUNCTION IF EXISTS create_default_subscription();
DROP FUNCTION IF EXISTS create_default_gamification();
DROP FUNCTION IF EXISTS create_default_preferences();
DROP FUNCTION IF EXISTS create_default_streaks();

-- Create a single consolidated initialization function
CREATE OR REPLACE FUNCTION initialize_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user preferences
  INSERT INTO user_preferences (user_id, theme, faith_support_enabled, inner_child_mode, guidance_voice)
  VALUES (NEW.id, 'light', false, false, 'gentle_therapist')
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create user gamification
  INSERT INTO user_gamification (user_id, gems, level, xp, skill_badges)
  VALUES (NEW.id, 0, 1, 0, '[]'::jsonb)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create user subscription
  INSERT INTO user_subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create user streaks
  INSERT INTO user_streaks (user_id, current_streak, longest_streak)
  VALUES (NEW.id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a single trigger for new user initialization
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_new_user();
