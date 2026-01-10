# Update Supabase Key to Publishable Format

## Action Required

In GitHub repository secrets, update `VITE_SUPABASE_ANON_KEY`:

### Old format (anon key):
- Starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### New format (publishable key):
- Starts with: `sb_publishable_...`

## Steps

1. Go to: https://github.com/GRCJP/assurit-test-simulator/settings/secrets/actions
2. Find and edit: `VITE_SUPABASE_ANON_KEY`
3. Replace the value with your Supabase **publishable key** (starts with `sb_publishable_`)
4. Save

## After Update

The next deployment will use the new key format. We'll then verify:
- No more "Invalid API key" from Supabase auth endpoints
- signInWithIdToken attempts succeed or fail with proper error messages

## Note

No code changes needed in this phase - just the secret update.
