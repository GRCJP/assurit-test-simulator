# Fix GitHub Pages Deployment - Step by Step

## Issue
The deployed bundle doesn't contain the correct Supabase URL and anon key because GitHub Actions isn't building with environment variables.

## Solution

### 1. Add Environment Variables to GitHub Actions

Edit `.github/workflows/deploy.yml` and update the build step:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    VITE_AUTH0_DOMAIN: ${{ secrets.VITE_AUTH0_DOMAIN }}
    VITE_AUTH0_CLIENT_ID: ${{ secrets.VITE_AUTH0_CLIENT_ID }}
    VITE_AUTH0_AUDIENCE: ${{ secrets.VITE_AUTH0_AUDIENCE }}
    VITE_AUTH0_REDIRECT_URI: ${{ secrets.VITE_AUTH0_REDIRECT_URI }}
```

### 2. Add Secrets to GitHub

1. Go to: https://github.com/GRCJP/assurit-test-simulator/settings/secrets/actions
2. Click "New repository secret" and add:

**VITE_SUPABASE_URL**
```
https://szyjviaolnaoywopfrqp.supabase.co
```

**VITE_SUPABASE_ANON_KEY**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5anZpYW9sbmFveW93cGZycXAiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNjQ4Njg1MSwiZXhwIjoyMDUyMDYyODUxfQ.VT1beAkfN48VBF_esRhUrKgIetJ0DTGW-748Tv9pPcU
```

**VITE_AUTH0_DOMAIN**
```
dev-351wds1ubpw3eyut.us.auth0.com
```

**VITE_AUTH0_CLIENT_ID**
```
DokE19cKDLTdMP9puuXtB0hJ2exARS2Q
```

**VITE_AUTH0_AUDIENCE**
```
https://dev-351wds1ubpw3eyut.us.auth0.com/api/v2/
```

**VITE_AUTH0_REDIRECT_URI**
```
https://grcjp.github.io/assurit-test-simulator
```

### 3. Update the Code for Supabase Auth

The latest code already includes:
- `signInWithIdToken` to get Supabase UUID
- Fallback to Auth0 user.sub if that fails
- Proper error handling
- Support for both UUID and Auth0 ID formats

### 4. Run Database Migration

In Supabase SQL Editor, run one of these:

**Option A: Keep user_id as TEXT (for Auth0 IDs)**
```sql
-- Run supabase-migration-simple.sql
-- This removes RLS restrictions and relies on app-level filtering
```

**Option B: Convert to UUID (for Supabase Auth)**
```sql
-- Run supabase-migration-uuid.sql
-- This converts user_id to UUID type
```

### 5. Verify Deployment

After pushing the workflow update:

1. Wait for GitHub Actions to complete
2. Go to https://grcjp.github.io/assurit-test-simulator/
3. View Page Source (Ctrl+U)
4. Find the JavaScript bundle (e.g., `index-xxxxxx.js`)
5. Open the bundle and search for:
   - `szyjviaolnaoywopfrqp` - should find the Supabase URL
   - `eyJhbGci` - should find the anon key

### 6. Test Authentication

After login, you should see in console:
- `Supabase session established with UUID: [uuid]` if signInWithIdToken works
- OR `Falling back to Auth0 user ID: auth0|xxx` if it falls back
- Data sync should work with either ID

## Summary

The main issue is that GitHub Pages needs the environment variables to be included in the build. Once you add the secrets and update the workflow, the deployment will have the correct credentials and authentication should work properly.
