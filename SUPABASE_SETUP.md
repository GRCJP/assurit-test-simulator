# Supabase Setup Guide - PostgreSQL Backend

## Quick Setup for Cross-Device Sync

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Click **"Start your project"**
3. Sign up/login with GitHub
4. Click **"New Project"**
5. Choose your organization
6. Create new project:
   - **Name**: `cmmc-training-platform`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users

### 2. Get Project Credentials
1. In your project dashboard, click **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with https://)
   - **anon public** API key

### 3. Create Database Table
Go to **SQL Editor** → **New query** and run:

```sql
-- Create user progress table
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  question_bank_id TEXT NOT NULL DEFAULT 'bankCCP',
  study_plan JSONB,
  domain_mastery JSONB,
  progress_streaks JSONB,
  score_stats JSONB,
  missed_questions JSONB,
  question_stats JSONB,
  test_history JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, question_bank_id)
);

-- Enable Row Level Security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policy for users to access their own data
CREATE POLICY "Users can view own data" ON user_progress
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own data" ON user_progress
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own data" ON user_progress
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can upsert own data" ON user_progress
  FOR ALL USING (auth.uid()::text = user_id);

-- Create index for performance
CREATE INDEX idx_user_progress_user_bank ON user_progress(user_id, question_bank_id);
```

### 4. Configure Auth0 Integration
1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Authentication providers**, enable **Auth0**
3. Add your Auth0 credentials:
   - **Client ID**: Your Auth0 client ID
   - **Secret**: Your Auth0 client secret
   - **Domain**: Your Auth0 domain

### 5. Update Environment Variables
In your `.env` file:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 6. Test the Integration
1. Build and deploy your app
2. Login with Auth0
3. Make some progress changes
4. Check browser console for:
   - ✅ "Loading studyPlan from PostgreSQL..."
   - ✅ "studyPlan synced to PostgreSQL successfully"

### 7. Verify Cross-Device Sync
1. Open app in regular browser
2. Make progress changes
3. Open incognito window
4. Login with same account
5. Progress should be synced automatically!

## Benefits:
✅ Real PostgreSQL database (industry standard)
✅ Free tier (500MB, unlimited users)
✅ Enterprise security (Row Level Security)
✅ Real-time sync across devices
✅ Analytics-ready data storage
✅ No more 400 errors!

## Troubleshooting:
- **"Missing environment variables"** - Check your .env file
- **"PostgreSQL sync error"** - Verify database table exists
- **"No data found"** - Check Row Level Security policies

This gives you enterprise-grade cloud storage for your training platform!
