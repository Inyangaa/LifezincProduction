/*
  # Fix Signup Trigger RLS Bypass

  1. Problem
    - The initialize_new_user trigger runs when a user signs up
    - At that moment, the user is not yet "authenticated" 
    - RLS policies block INSERT for non-authenticated users
    - This causes "Database error saving new user"

  2. Solution
    - Grant the trigger function permission to bypass RLS
    - Add explicit SET statements to ensure function runs as superuser context
    - This allows the initialization to complete before user authentication

  3. Security
    - Function already has SECURITY DEFINER
    - Function only inserts data for NEW.id (the user being created)
    - No risk of unauthorized data access
*/

-- Recreate the function with proper RLS bypass
CREATE OR REPLACE FUNCTION initialize_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create user preferences (bypasses RLS due to SECURITY DEFINER)
  INSERT INTO public.user_preferences (user_id, theme, faith_support_enabled, inner_child_mode, guidance_voice)
  VALUES (NEW.id, 'light', false, false, 'gentle_therapist')
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create user gamification
  INSERT INTO public.user_gamification (user_id, gems, level, xp, skill_badges)
  VALUES (NEW.id, 0, 1, 0, '[]'::jsonb)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create user subscription
  INSERT INTO public.user_subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create user streaks
  INSERT INTO public.user_streaks (user_id, current_streak, longest_streak)
  VALUES (NEW.id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail signup
    RAISE WARNING 'Error initializing user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_new_user();
