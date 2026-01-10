-- Update the user_progress table to use Auth0 user_id instead of Supabase auth.uid()
-- Also update RLS policies to check against the actual user_id field

-- First, update existing policies
DROP POLICY IF EXISTS "Users can view own data" ON user_progress;
DROP POLICY IF EXISTS "Users can update own data" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own data" ON user_progress;
DROP POLICY IF EXISTS "Users can upsert own data" ON user_progress;

-- Create new policies that work with Auth0 user IDs
CREATE POLICY "Users can view own data" ON user_progress
  FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own data" ON user_progress
  FOR UPDATE USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own data" ON user_progress
  FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

-- Create a function to set the user context
CREATE OR REPLACE FUNCTION set_auth_user_id()
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_user_id', current_setting('request.jwt.claims', true)::json->>'sub', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically set the user context
CREATE OR REPLACE FUNCTION auth_user_id_trigger()
RETURNS trigger AS $$
BEGIN
  PERFORM set_auth_user_id();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old trigger if exists
DROP TRIGGER IF EXISTS set_auth_user_id_trigger ON user_progress;

-- Create trigger to run before any operation on user_progress
CREATE TRIGGER set_auth_user_id_trigger
  BEFORE INSERT OR UPDATE OR SELECT OR DELETE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION auth_user_id_trigger();

-- Note: In the application code, we need to set the user_id explicitly
-- since we're not using Supabase Auth, but Auth0 instead

-- The user_progress table should work with Auth0 user IDs (user.sub) directly
-- No changes needed to the table structure since user_id is already a TEXT field
