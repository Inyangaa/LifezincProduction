/*
  # Add emotions array to journal entries

  1. Changes
    - Add `emotions` column to `journal_entries` table as text array
    - This allows users to select multiple emotions per journal entry
    - Existing `mood` column remains for backward compatibility
  
  2. Notes
    - Uses PostgreSQL text array type
    - Default value is empty array
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'journal_entries' AND column_name = 'emotions'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN emotions text[] DEFAULT '{}';
  END IF;
END $$;