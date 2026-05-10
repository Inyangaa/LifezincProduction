/*
  # Fix Performance and Security Issues

  This migration addresses:
  1. Missing indexes on foreign keys for optimal query performance
  2. RLS policy optimization using (select auth.uid()) pattern

  ## Changes

  ### Indexes Added
  - caregiver_logs: user_id index
  - community_shares: user_id index
  - distress_tracking: journal_entry_id index
  - journal_entries: chapter_id index
  - life_chapters: user_id index
  - saved_reframes: journal_entry_id index
  - user_activities: user_id index
  - user_challenge_progress: challenge_id index

  ### RLS Policies Optimized
  All RLS policies updated to use (select auth.uid()) pattern to prevent
  re-evaluation on each row, significantly improving query performance at scale.
*/

-- =====================================================
-- PART 1: Add Missing Indexes on Foreign Keys
-- =====================================================

-- caregiver_logs
CREATE INDEX IF NOT EXISTS idx_caregiver_logs_user_id
ON public.caregiver_logs(user_id);

-- community_shares
CREATE INDEX IF NOT EXISTS idx_community_shares_user_id
ON public.community_shares(user_id);

-- distress_tracking
CREATE INDEX IF NOT EXISTS idx_distress_tracking_journal_entry_id
ON public.distress_tracking(journal_entry_id);

-- journal_entries
CREATE INDEX IF NOT EXISTS idx_journal_entries_chapter_id
ON public.journal_entries(chapter_id);

-- life_chapters
CREATE INDEX IF NOT EXISTS idx_life_chapters_user_id
ON public.life_chapters(user_id);

-- saved_reframes
CREATE INDEX IF NOT EXISTS idx_saved_reframes_journal_entry_id
ON public.saved_reframes(journal_entry_id);

-- user_activities
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id
ON public.user_activities(user_id);

-- user_challenge_progress
CREATE INDEX IF NOT EXISTS idx_user_challenge_progress_challenge_id
ON public.user_challenge_progress(challenge_id);

-- =====================================================
-- PART 2: Optimize RLS Policies
-- =====================================================

-- ==================
-- journal_entries
-- ==================
DROP POLICY IF EXISTS "Users can view own journal entries" ON public.journal_entries;
CREATE POLICY "Users can view own journal entries"
  ON public.journal_entries FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own journal entries" ON public.journal_entries;
CREATE POLICY "Users can insert own journal entries"
  ON public.journal_entries FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own journal entries" ON public.journal_entries;
CREATE POLICY "Users can update own journal entries"
  ON public.journal_entries FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own journal entries" ON public.journal_entries;
CREATE POLICY "Users can delete own journal entries"
  ON public.journal_entries FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==================
-- user_preferences
-- ==================
DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own preferences" ON public.user_preferences;
CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own preferences" ON public.user_preferences;
CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ==================
-- user_achievements
-- ==================
DROP POLICY IF EXISTS "Users can view own achievements" ON public.user_achievements;
CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own achievements" ON public.user_achievements;
CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ==================
-- user_streaks
-- ==================
DROP POLICY IF EXISTS "Users can view own streaks" ON public.user_streaks;
CREATE POLICY "Users can view own streaks"
  ON public.user_streaks FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own streaks" ON public.user_streaks;
CREATE POLICY "Users can insert own streaks"
  ON public.user_streaks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own streaks" ON public.user_streaks;
CREATE POLICY "Users can update own streaks"
  ON public.user_streaks FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ==================
-- user_demographics
-- ==================
DROP POLICY IF EXISTS "Users can view own demographics" ON public.user_demographics;
CREATE POLICY "Users can view own demographics"
  ON public.user_demographics FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own demographics" ON public.user_demographics;
CREATE POLICY "Users can insert own demographics"
  ON public.user_demographics FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own demographics" ON public.user_demographics;
CREATE POLICY "Users can update own demographics"
  ON public.user_demographics FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own demographics" ON public.user_demographics;
CREATE POLICY "Users can delete own demographics"
  ON public.user_demographics FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==================
-- saved_reframes
-- ==================
DROP POLICY IF EXISTS "Users can view own saved reframes" ON public.saved_reframes;
CREATE POLICY "Users can view own saved reframes"
  ON public.saved_reframes FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own saved reframes" ON public.saved_reframes;
CREATE POLICY "Users can insert own saved reframes"
  ON public.saved_reframes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own saved reframes" ON public.saved_reframes;
CREATE POLICY "Users can update own saved reframes"
  ON public.saved_reframes FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own saved reframes" ON public.saved_reframes;
CREATE POLICY "Users can delete own saved reframes"
  ON public.saved_reframes FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==================
-- community_shares
-- ==================
DROP POLICY IF EXISTS "Users can insert own shares" ON public.community_shares;
CREATE POLICY "Users can insert own shares"
  ON public.community_shares FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own shares" ON public.community_shares;
CREATE POLICY "Users can update own shares"
  ON public.community_shares FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own shares" ON public.community_shares;
CREATE POLICY "Users can delete own shares"
  ON public.community_shares FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==================
-- user_challenge_progress
-- ==================
DROP POLICY IF EXISTS "Users can view own challenge progress" ON public.user_challenge_progress;
CREATE POLICY "Users can view own challenge progress"
  ON public.user_challenge_progress FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own challenge progress" ON public.user_challenge_progress;
CREATE POLICY "Users can insert own challenge progress"
  ON public.user_challenge_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own challenge progress" ON public.user_challenge_progress;
CREATE POLICY "Users can update own challenge progress"
  ON public.user_challenge_progress FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own challenge progress" ON public.user_challenge_progress;
CREATE POLICY "Users can delete own challenge progress"
  ON public.user_challenge_progress FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==================
-- user_subscriptions
-- ==================
DROP POLICY IF EXISTS "Users can view own subscription" ON public.user_subscriptions;
CREATE POLICY "Users can view own subscription"
  ON public.user_subscriptions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own subscription" ON public.user_subscriptions;
CREATE POLICY "Users can insert own subscription"
  ON public.user_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own subscription" ON public.user_subscriptions;
CREATE POLICY "Users can update own subscription"
  ON public.user_subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ==================
-- user_gamification
-- ==================
DROP POLICY IF EXISTS "Users can view own gamification" ON public.user_gamification;
CREATE POLICY "Users can view own gamification"
  ON public.user_gamification FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own gamification" ON public.user_gamification;
CREATE POLICY "Users can insert own gamification"
  ON public.user_gamification FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own gamification" ON public.user_gamification;
CREATE POLICY "Users can update own gamification"
  ON public.user_gamification FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ==================
-- user_activities
-- ==================
DROP POLICY IF EXISTS "Users can view own activities" ON public.user_activities;
CREATE POLICY "Users can view own activities"
  ON public.user_activities FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own activities" ON public.user_activities;
CREATE POLICY "Users can insert own activities"
  ON public.user_activities FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ==================
-- life_chapters
-- ==================
DROP POLICY IF EXISTS "Users can view own chapters" ON public.life_chapters;
CREATE POLICY "Users can view own chapters"
  ON public.life_chapters FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own chapters" ON public.life_chapters;
CREATE POLICY "Users can create own chapters"
  ON public.life_chapters FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own chapters" ON public.life_chapters;
CREATE POLICY "Users can update own chapters"
  ON public.life_chapters FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own chapters" ON public.life_chapters;
CREATE POLICY "Users can delete own chapters"
  ON public.life_chapters FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==================
-- caregiver_logs
-- ==================
DROP POLICY IF EXISTS "Users can view own caregiver logs" ON public.caregiver_logs;
CREATE POLICY "Users can view own caregiver logs"
  ON public.caregiver_logs FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own caregiver logs" ON public.caregiver_logs;
CREATE POLICY "Users can create own caregiver logs"
  ON public.caregiver_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own caregiver logs" ON public.caregiver_logs;
CREATE POLICY "Users can update own caregiver logs"
  ON public.caregiver_logs FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own caregiver logs" ON public.caregiver_logs;
CREATE POLICY "Users can delete own caregiver logs"
  ON public.caregiver_logs FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==================
-- distress_tracking
-- ==================
DROP POLICY IF EXISTS "Users can view own distress tracking" ON public.distress_tracking;
CREATE POLICY "Users can view own distress tracking"
  ON public.distress_tracking FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own distress tracking" ON public.distress_tracking;
CREATE POLICY "Users can insert own distress tracking"
  ON public.distress_tracking FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own distress tracking" ON public.distress_tracking;
CREATE POLICY "Users can update own distress tracking"
  ON public.distress_tracking FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own distress tracking" ON public.distress_tracking;
CREATE POLICY "Users can delete own distress tracking"
  ON public.distress_tracking FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==================
-- therapist_recommendations
-- ==================
DROP POLICY IF EXISTS "Users can view own therapist recommendations" ON public.therapist_recommendations;
CREATE POLICY "Users can view own therapist recommendations"
  ON public.therapist_recommendations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own therapist recommendations" ON public.therapist_recommendations;
CREATE POLICY "Users can insert own therapist recommendations"
  ON public.therapist_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own therapist recommendations" ON public.therapist_recommendations;
CREATE POLICY "Users can update own therapist recommendations"
  ON public.therapist_recommendations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own therapist recommendations" ON public.therapist_recommendations;
CREATE POLICY "Users can delete own therapist recommendations"
  ON public.therapist_recommendations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==================
-- user_goals
-- ==================
DROP POLICY IF EXISTS "Users can view own goals" ON public.user_goals;
CREATE POLICY "Users can view own goals"
  ON public.user_goals FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own goals" ON public.user_goals;
CREATE POLICY "Users can create own goals"
  ON public.user_goals FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own goals" ON public.user_goals;
CREATE POLICY "Users can update own goals"
  ON public.user_goals FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own goals" ON public.user_goals;
CREATE POLICY "Users can delete own goals"
  ON public.user_goals FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ==================
-- saved_tools
-- ==================
DROP POLICY IF EXISTS "Users can view own saved tools" ON public.saved_tools;
CREATE POLICY "Users can view own saved tools"
  ON public.saved_tools FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own saved tools" ON public.saved_tools;
CREATE POLICY "Users can insert own saved tools"
  ON public.saved_tools FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own saved tools" ON public.saved_tools;
CREATE POLICY "Users can delete own saved tools"
  ON public.saved_tools FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));
