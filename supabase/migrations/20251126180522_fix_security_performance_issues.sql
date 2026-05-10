/*
  # Fix Security and Performance Issues

  1. Missing Indexes
    - Add indexes on all foreign key columns for optimal query performance
    - caregiver_logs(user_id)
    - community_shares(user_id)
    - distress_tracking(journal_entry_id)
    - journal_entries(chapter_id)
    - life_chapters(user_id)
    - saved_reframes(journal_entry_id)
    - user_activities(user_id)
    - user_challenge_progress(challenge_id)

  2. RLS Policy Optimization
    - Replace auth.uid() with (select auth.uid()) in all policies
    - This prevents re-evaluation for each row, improving performance at scale
    - Affects all tables with RLS policies

  3. Security
    - These changes improve query performance and maintain security
*/

-- ==============================================
-- PART 1: ADD MISSING FOREIGN KEY INDEXES
-- ==============================================

-- Add index on caregiver_logs.user_id
CREATE INDEX IF NOT EXISTS idx_caregiver_logs_user_id
ON caregiver_logs(user_id);

-- Add index on community_shares.user_id
CREATE INDEX IF NOT EXISTS idx_community_shares_user_id
ON community_shares(user_id);

-- Add index on distress_tracking.journal_entry_id
CREATE INDEX IF NOT EXISTS idx_distress_tracking_journal_entry_id
ON distress_tracking(journal_entry_id);

-- Add index on journal_entries.chapter_id
CREATE INDEX IF NOT EXISTS idx_journal_entries_chapter_id
ON journal_entries(chapter_id);

-- Add index on life_chapters.user_id
CREATE INDEX IF NOT EXISTS idx_life_chapters_user_id
ON life_chapters(user_id);

-- Add index on saved_reframes.journal_entry_id
CREATE INDEX IF NOT EXISTS idx_saved_reframes_journal_entry_id
ON saved_reframes(journal_entry_id);

-- Add index on user_activities.user_id
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id
ON user_activities(user_id);

-- Add index on user_challenge_progress.challenge_id
CREATE INDEX IF NOT EXISTS idx_user_challenge_progress_challenge_id
ON user_challenge_progress(challenge_id);

-- ==============================================
-- PART 2: OPTIMIZE RLS POLICIES
-- ==============================================

-- Drop and recreate all RLS policies with optimized auth.uid() calls

-- journal_entries policies
DROP POLICY IF EXISTS "Users can view own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can insert own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can update own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can delete own journal entries" ON journal_entries;

CREATE POLICY "Users can view own journal entries"
  ON journal_entries FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own journal entries"
  ON journal_entries FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own journal entries"
  ON journal_entries FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own journal entries"
  ON journal_entries FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- user_preferences policies
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- user_achievements policies
DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON user_achievements;

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- user_streaks policies
DROP POLICY IF EXISTS "Users can view own streaks" ON user_streaks;
DROP POLICY IF EXISTS "Users can insert own streaks" ON user_streaks;
DROP POLICY IF EXISTS "Users can update own streaks" ON user_streaks;

CREATE POLICY "Users can view own streaks"
  ON user_streaks FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own streaks"
  ON user_streaks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own streaks"
  ON user_streaks FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- user_demographics policies
DROP POLICY IF EXISTS "Users can view own demographics" ON user_demographics;
DROP POLICY IF EXISTS "Users can insert own demographics" ON user_demographics;
DROP POLICY IF EXISTS "Users can update own demographics" ON user_demographics;
DROP POLICY IF EXISTS "Users can delete own demographics" ON user_demographics;

CREATE POLICY "Users can view own demographics"
  ON user_demographics FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own demographics"
  ON user_demographics FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own demographics"
  ON user_demographics FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own demographics"
  ON user_demographics FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- saved_reframes policies
DROP POLICY IF EXISTS "Users can view own saved reframes" ON saved_reframes;
DROP POLICY IF EXISTS "Users can insert own saved reframes" ON saved_reframes;
DROP POLICY IF EXISTS "Users can update own saved reframes" ON saved_reframes;
DROP POLICY IF EXISTS "Users can delete own saved reframes" ON saved_reframes;

CREATE POLICY "Users can view own saved reframes"
  ON saved_reframes FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own saved reframes"
  ON saved_reframes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own saved reframes"
  ON saved_reframes FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own saved reframes"
  ON saved_reframes FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- community_shares policies
DROP POLICY IF EXISTS "Users can insert own shares" ON community_shares;
DROP POLICY IF EXISTS "Users can update own shares" ON community_shares;
DROP POLICY IF EXISTS "Users can delete own shares" ON community_shares;

CREATE POLICY "Users can insert own shares"
  ON community_shares FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own shares"
  ON community_shares FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own shares"
  ON community_shares FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- user_challenge_progress policies
DROP POLICY IF EXISTS "Users can view own challenge progress" ON user_challenge_progress;
DROP POLICY IF EXISTS "Users can insert own challenge progress" ON user_challenge_progress;
DROP POLICY IF EXISTS "Users can update own challenge progress" ON user_challenge_progress;
DROP POLICY IF EXISTS "Users can delete own challenge progress" ON user_challenge_progress;

CREATE POLICY "Users can view own challenge progress"
  ON user_challenge_progress FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own challenge progress"
  ON user_challenge_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own challenge progress"
  ON user_challenge_progress FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own challenge progress"
  ON user_challenge_progress FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- user_subscriptions policies
DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON user_subscriptions;

CREATE POLICY "Users can view own subscription"
  ON user_subscriptions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own subscription"
  ON user_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own subscription"
  ON user_subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- user_gamification policies
DROP POLICY IF EXISTS "Users can view own gamification" ON user_gamification;
DROP POLICY IF EXISTS "Users can insert own gamification" ON user_gamification;
DROP POLICY IF EXISTS "Users can update own gamification" ON user_gamification;

CREATE POLICY "Users can view own gamification"
  ON user_gamification FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own gamification"
  ON user_gamification FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own gamification"
  ON user_gamification FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- user_activities policies
DROP POLICY IF EXISTS "Users can view own activities" ON user_activities;
DROP POLICY IF EXISTS "Users can insert own activities" ON user_activities;

CREATE POLICY "Users can view own activities"
  ON user_activities FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own activities"
  ON user_activities FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- life_chapters policies
DROP POLICY IF EXISTS "Users can view own chapters" ON life_chapters;
DROP POLICY IF EXISTS "Users can create own chapters" ON life_chapters;
DROP POLICY IF EXISTS "Users can update own chapters" ON life_chapters;
DROP POLICY IF EXISTS "Users can delete own chapters" ON life_chapters;

CREATE POLICY "Users can view own chapters"
  ON life_chapters FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create own chapters"
  ON life_chapters FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own chapters"
  ON life_chapters FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own chapters"
  ON life_chapters FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- caregiver_logs policies
DROP POLICY IF EXISTS "Users can view own caregiver logs" ON caregiver_logs;
DROP POLICY IF EXISTS "Users can create own caregiver logs" ON caregiver_logs;
DROP POLICY IF EXISTS "Users can update own caregiver logs" ON caregiver_logs;
DROP POLICY IF EXISTS "Users can delete own caregiver logs" ON caregiver_logs;

CREATE POLICY "Users can view own caregiver logs"
  ON caregiver_logs FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create own caregiver logs"
  ON caregiver_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own caregiver logs"
  ON caregiver_logs FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own caregiver logs"
  ON caregiver_logs FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- distress_tracking policies
DROP POLICY IF EXISTS "Users can view own distress tracking" ON distress_tracking;
DROP POLICY IF EXISTS "Users can insert own distress tracking" ON distress_tracking;
DROP POLICY IF EXISTS "Users can update own distress tracking" ON distress_tracking;
DROP POLICY IF EXISTS "Users can delete own distress tracking" ON distress_tracking;

CREATE POLICY "Users can view own distress tracking"
  ON distress_tracking FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own distress tracking"
  ON distress_tracking FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own distress tracking"
  ON distress_tracking FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own distress tracking"
  ON distress_tracking FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- therapist_recommendations policies
DROP POLICY IF EXISTS "Users can view own therapist recommendations" ON therapist_recommendations;
DROP POLICY IF EXISTS "Users can insert own therapist recommendations" ON therapist_recommendations;
DROP POLICY IF EXISTS "Users can update own therapist recommendations" ON therapist_recommendations;
DROP POLICY IF EXISTS "Users can delete own therapist recommendations" ON therapist_recommendations;

CREATE POLICY "Users can view own therapist recommendations"
  ON therapist_recommendations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own therapist recommendations"
  ON therapist_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own therapist recommendations"
  ON therapist_recommendations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own therapist recommendations"
  ON therapist_recommendations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- user_goals policies
DROP POLICY IF EXISTS "Users can view own goals" ON user_goals;
DROP POLICY IF EXISTS "Users can create own goals" ON user_goals;
DROP POLICY IF EXISTS "Users can update own goals" ON user_goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON user_goals;

CREATE POLICY "Users can view own goals"
  ON user_goals FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create own goals"
  ON user_goals FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own goals"
  ON user_goals FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own goals"
  ON user_goals FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- saved_tools policies
DROP POLICY IF EXISTS "Users can view own saved tools" ON saved_tools;
DROP POLICY IF EXISTS "Users can insert own saved tools" ON saved_tools;
DROP POLICY IF EXISTS "Users can delete own saved tools" ON saved_tools;

CREATE POLICY "Users can view own saved tools"
  ON saved_tools FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own saved tools"
  ON saved_tools FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own saved tools"
  ON saved_tools FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));
