/*
  # Add Advanced Emotion Taxonomy System
  
  ## Overview
  Phase 1: Add advanced emotional state tracking alongside existing basic emotions.
  This migration preserves backward compatibility - all existing fields remain unchanged.
  
  ## Changes
  
  ### 1. Journal Entries - Add Advanced Fields
  New columns added to `journal_entries`:
  - `advanced_category_id` (text) - Category like "dysregulated", "stress-response", etc.
  - `advanced_state_id` (text) - Specific state like "numb-disconnected", "panicked", etc.
  - `intensity` (smallint 1-5) - Intensity level of the emotional state
  - `risk_level` (text) - Calculated risk: "low", "medium", or "high"
  - `selected_signals` (text[]) - User-selected signals/symptoms
  - `recommended_actions` (text[]) - Actions recommended based on state
  - `completed_actions` (text[]) - Actions user completed
  - `is_advanced_mode` (boolean) - Whether entry used advanced taxonomy
  
  ### 2. Advanced Emotion Sessions Table
  Tracks complete advanced emotion flow sessions for analytics:
  - Session start/end times
  - Initial and final intensity levels
  - Actions taken during session
  - Outcome notes
  
  ### 3. User Preferences - Add Advanced Settings
  New columns in `user_preferences`:
  - `enable_advanced_states` (boolean) - User opt-in for advanced mode
  - `preferred_mode` (text) - "basic", "advanced", or "hybrid"
  - `show_risk_warnings` (boolean) - Show risk-based warnings
  - `auto_escalate_high_risk` (boolean) - Auto-show crisis resources for high risk
  
  ## Security
  - All new tables have RLS enabled
  - Policies match existing auth patterns
  - Users can only access their own data
  
  ## Backward Compatibility
  - Existing `mood` and `emotions` fields unchanged
  - All new fields nullable - old entries remain valid
  - Basic emotion system continues to work unchanged
*/

-- Add advanced emotion fields to journal_entries
DO $$
BEGIN
  -- Advanced category (dysregulated, stress-response, relational, identity, existential, growth-oriented)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'journal_entries' AND column_name = 'advanced_category_id'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN advanced_category_id TEXT;
  END IF;
  
  -- Advanced state ID (specific emotional state)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'journal_entries' AND column_name = 'advanced_state_id'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN advanced_state_id TEXT;
  END IF;
  
  -- Intensity level (1-5)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'journal_entries' AND column_name = 'intensity'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN intensity SMALLINT CHECK (intensity >= 1 AND intensity <= 5);
  END IF;
  
  -- Risk level (low, medium, high)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'journal_entries' AND column_name = 'risk_level'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high'));
  END IF;
  
  -- Selected signals (array of signal IDs)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'journal_entries' AND column_name = 'selected_signals'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN selected_signals TEXT[] DEFAULT '{}';
  END IF;
  
  -- Recommended actions (array of action IDs)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'journal_entries' AND column_name = 'recommended_actions'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN recommended_actions TEXT[] DEFAULT '{}';
  END IF;
  
  -- Completed actions (array of action IDs)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'journal_entries' AND column_name = 'completed_actions'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN completed_actions TEXT[] DEFAULT '{}';
  END IF;
  
  -- Flag to indicate if entry used advanced mode
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'journal_entries' AND column_name = 'is_advanced_mode'
  ) THEN
    ALTER TABLE journal_entries ADD COLUMN is_advanced_mode BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Create advanced_emotion_sessions table for session tracking
CREATE TABLE IF NOT EXISTS advanced_emotion_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  completed_at TIMESTAMPTZ,
  initial_category TEXT NOT NULL,
  initial_state TEXT NOT NULL,
  initial_intensity SMALLINT NOT NULL CHECK (initial_intensity >= 1 AND initial_intensity <= 5),
  final_intensity SMALLINT CHECK (final_intensity >= 1 AND final_intensity <= 5),
  actions_taken TEXT[] DEFAULT '{}',
  outcome_notes TEXT,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on advanced_emotion_sessions
ALTER TABLE advanced_emotion_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for advanced_emotion_sessions
CREATE POLICY "Users can view own advanced sessions"
  ON advanced_emotion_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own advanced sessions"
  ON advanced_emotion_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own advanced sessions"
  ON advanced_emotion_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own advanced sessions"
  ON advanced_emotion_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add advanced preferences to user_preferences table
DO $$
BEGIN
  -- Enable advanced states toggle
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_preferences' AND column_name = 'enable_advanced_states'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN enable_advanced_states BOOLEAN DEFAULT false;
  END IF;
  
  -- Preferred mode (basic, advanced, hybrid)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_preferences' AND column_name = 'preferred_mode'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN preferred_mode TEXT DEFAULT 'basic' CHECK (preferred_mode IN ('basic', 'advanced', 'hybrid'));
  END IF;
  
  -- Show risk warnings
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_preferences' AND column_name = 'show_risk_warnings'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN show_risk_warnings BOOLEAN DEFAULT true;
  END IF;
  
  -- Auto-escalate for high risk
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_preferences' AND column_name = 'auto_escalate_high_risk'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN auto_escalate_high_risk BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Create index for faster queries on advanced fields
CREATE INDEX IF NOT EXISTS idx_journal_entries_advanced_category 
  ON journal_entries(advanced_category_id) 
  WHERE advanced_category_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_journal_entries_advanced_state 
  ON journal_entries(advanced_state_id) 
  WHERE advanced_state_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_journal_entries_risk_level 
  ON journal_entries(risk_level) 
  WHERE risk_level IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_advanced_sessions_user_created 
  ON advanced_emotion_sessions(user_id, created_at DESC);

-- Add helpful comment
COMMENT ON COLUMN journal_entries.is_advanced_mode IS 'True if entry was created using advanced emotion taxonomy';
COMMENT ON TABLE advanced_emotion_sessions IS 'Tracks complete advanced emotion flow sessions for analytics and insights';
