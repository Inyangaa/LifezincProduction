/*
  # Add category field to journal entries

  1. Changes
    - Add `category` column to `journal_entries` table
    - Category tracks the life area (school, family, friends, etc.)
    - This helps personalize reflections and verses based on context

  2. Security
    - No changes to RLS policies needed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'journal_entries' AND column_name = 'category'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN category text;
  END IF;
END $$;