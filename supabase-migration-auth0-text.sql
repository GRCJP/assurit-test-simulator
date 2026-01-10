-- Migration to use Auth0 user.sub with RLS policies
-- Keep user_id as TEXT since Auth0 IDs are strings like "auth0|xxx"

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own data" ON user_progress;
DROP POLICY IF EXISTS "Users can update own data" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own data" ON user_progress;
DROP POLICY IF EXISTS "Users can upsert own data" ON user_progress;

-- Create a custom function to extract user ID from JWT
CREATE OR REPLACE FUNCTION get_user_id_from_jwt()
RETURNS TEXT AS $$
DECLARE
  auth_header TEXT;
  token TEXT;
  payload JSONB;
  user_id TEXT;
BEGIN
  -- Get the Authorization header
  auth_header := current_setting('request.headers', true)::json->>'authorization';
  
  -- Extract Bearer token
  IF auth_header LIKE 'Bearer %' THEN
    token := substr(auth_header, 8);
    
    -- For Supabase anon key requests, we can't extract Auth0 user ID
    -- So we'll use a different approach with app settings
    RETURN current_setting('app.current_user_id', true);
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policies that work with the app setting approach
CREATE POLICY "Users can view own data" ON user_progress
  FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own data" ON user_progress
  FOR UPDATE USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own data" ON user_progress
  FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can upsert own data" ON user_progress
  FOR ALL USING (user_id = current_setting('app.current_user_id', true));

-- Create a function to set the user context for requests
CREATE OR REPLACE FUNCTION set_request_user_id(user_id TEXT)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_user_id', user_id, true);
END;
$$ LANGUAGE plpgsql;

-- Note: Since we're using the anon key and not Supabase Auth,
-- we'll rely on the application to filter by user_id in queries
-- The RLS policies above provide an additional layer of protection
