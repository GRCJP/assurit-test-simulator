# Supabase Schema Configuration

## Important Notes

### 1. user_progress.user_id Column Type
- **Must be TEXT**, not UUID
- Stores Auth0 user.sub values (e.g., "auth0|1234567890abcdef")

### 2. Row Level Security (RLS)
- **DISABLE RLS on user_progress table**
- We're using app-level filtering by user_id
- This is NOT secure for multi-tenant hostile environments
- RLS with auth.uid() won't work with Auth0 third-party auth

## SQL to Apply in Supabase

```sql
-- Ensure user_progress.user_id is TEXT
ALTER TABLE user_progress 
ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- Disable RLS on user_progress (required for Auth0 user.sub access)
ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;

-- Drop any existing RLS policies that reference auth.uid()
DROP POLICY IF EXISTS "Users can view own data" ON user_progress;
DROP POLICY IF EXISTS "Users can update own data" ON user_progress;
```

## Security Note

This configuration relies on client-side filtering by user_id. While this works for single-user or trusted environments, it's not secure against malicious users who could modify the client code to access other users' data.

For production multi-tenant applications, you would need:
1. A backend service or Edge Function
2. JWT verification of Auth0 tokens
3. Proper RLS policies using the verified user ID

## Current Implementation

- Uses Auth0 for authentication
- Stores data using Auth0 user.sub as the primary key
- No Supabase Auth integration (no signInWithIdToken)
- Simple and functional for single-user scenarios
