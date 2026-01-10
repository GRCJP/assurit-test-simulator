# GitHub Actions Environment Variables Setup

## The Fix Has Been Applied

I've updated `.github/workflows/deploy.yml` to include environment variables in the build step:

```yaml
- name: Build
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    VITE_AUTH0_DOMAIN: ${{ secrets.VITE_AUTH0_DOMAIN }}
    VITE_AUTH0_CLIENT_ID: ${{ secrets.VITE_AUTH0_CLIENT_ID }}
    VITE_AUTH0_AUDIENCE: ${{ secrets.VITE_AUTH0_AUDIENCE }}
    VITE_AUTH0_REDIRECT_URI: ${{ secrets.VITE_AUTH0_REDIRECT_URI }}
  run: npm run build
```

## You Need to Add the Secrets

Go to: https://github.com/GRCJP/assurit-test-simulator/settings/secrets/actions

Add these 6 secrets:

### 1. VITE_SUPABASE_URL
```
https://szyjviaolnaoywopfrqp.supabase.co
```

### 2. VITE_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5anZpYW9sbmFveW93cGZycXAiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNjQ4Njg1MSwiZXhwIjoyMDUyMDYyODUxfQ.VT1beAkfN48VBF_esRhUrKgIetJ0DTGW-748Tv9pPcU
```

### 3. VITE_AUTH0_DOMAIN
```
dev-351wds1ubpw3eyut.us.auth0.com
```

### 4. VITE_AUTH0_CLIENT_ID
```
DokE19cKDLTdMP9puuXtB0hJ2exARS2Q
```

### 5. VITE_AUTH0_AUDIENCE
```
https://dev-351wds1ubpw3eyut.us.auth0.com/api/v2/
```

### 6. VITE_AUTH0_REDIRECT_URI
```
https://grcjp.github.io/assurit-test-simulator
```

## After Adding Secrets

1. Commit and push the updated workflow
2. GitHub Actions will automatically run with the new environment variables
3. Check the deployment to see the environment variables in the console

## Verification

Once deployed, open https://grcjp.github.io/assurit-test-simulator/ and check the console. You should see:

```
=== Production Environment Check ===
VITE_SUPABASE_URL: https://szyjviaolnaoywopfrqp.supabase.co
VITE_SUPABASE_ANON_KEY present: true
VITE_AUTH0_DOMAIN: dev-351wds1ubpw3eyut.us.auth0.com
=== End Environment Check ===
```

This confirms the environment variables are properly included in the build!
