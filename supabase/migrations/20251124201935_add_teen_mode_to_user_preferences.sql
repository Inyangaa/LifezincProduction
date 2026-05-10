/*
  # Add Teen/Youth Mode to User Preferences

  1. Changes
    - Add `teen_mode` boolean column to `user_preferences` table
    - Default to false for existing users
    - Allow users to toggle teen-appropriate content and resources

  2. Notes
    - Teen mode provides age-appropriate language and support
    - Includes school-specific resources and bullying/social pressure options
    - Adjusts coaching tone to be more relatable for younger users
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'teen_mode'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN teen_mode boolean DEFAULT false;
  END IF;
END $$;