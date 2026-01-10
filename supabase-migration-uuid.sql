-- Migration to update user_progress table to use UUID for user_id
-- This aligns with Supabase Auth UUIDs and RLS policies using auth.uid()

-- First, drop existing policies
DROP POLICY IF EXISTS "Users can view own data" ON user_progress;
DROP POLICY IF EXISTS "Users can update own data" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own data" ON user_progress;
DROP POLICY IF EXISTS "Users can upsert own data" ON user_progress;

-- Alter the user_id column from TEXT to UUID
ALTER TABLE user_progress ALTER COLUMN user_id TYPE UUID USING user_id::uuid;

-- Recreate policies using auth.uid() directly (no casting needed)
CREATE POLICY "Users can view own data" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can upsert own data" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

-- The unique constraint still works with UUIDs
-- No need to change the index as it works with UUIDs as well
