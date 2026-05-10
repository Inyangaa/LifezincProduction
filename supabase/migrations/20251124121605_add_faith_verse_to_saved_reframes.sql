/*
  # Add Faith Verse Support to Saved Reframes

  1. Changes to `saved_reframes` table
    - Add `emotion` column (text, nullable) to store the emotion key (anxiety, fear, sadness, etc.)
    - Add `verse_text` column (text, nullable) to store the verse text from Bible/Qur'an
    - Add `verse_reference` column (text, nullable) to store the verse citation (e.g., "Psalm 34:18")
  
  2. Purpose
    - Allows users to save their reframes along with the faith-friendly verses that were shown
    - Emotion helps categorize and retrieve appropriate verses
    - Verse text and reference are optional and only saved when Faith-Friendly Mode is active
*/

-- Add new columns to saved_reframes table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_reframes' AND column_name = 'emotion'
  ) THEN
    ALTER TABLE saved_reframes ADD COLUMN emotion text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_reframes' AND column_name = 'verse_text'
  ) THEN
    ALTER TABLE saved_reframes ADD COLUMN verse_text text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_reframes' AND column_name = 'verse_reference'
  ) THEN
    ALTER TABLE saved_reframes ADD COLUMN verse_reference text;
  END IF;
END $$;
