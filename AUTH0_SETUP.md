# Simple Auth0 Setup for CMMC Exam Prep

## Quick Setup (5 minutes)

### 1. Create Auth0 Application
1. Go to https://auth0.com/dashboard
2. Create new application → **Single Page Application**
3. Name: "CMMC Exam Prep"
4. Click **Create**

### 2. Configure Application URLs
In Application Settings → Application URIs, add:

**Allowed Callback URLs:**
```
http://localhost:5173,http://localhost:5174,https://cmmctestprepsim.netlify.app
```

**Allowed Logout URLs:**
```
http://localhost:5173,http://localhost:5174,https://cmmctestprepsim.netlify.app
```

**Allowed Web Origins:**
```
http://localhost:5173,http://localhost:5174,https://cmmctestprepsim.netlify.app
```

**Allowed Origins (CORS):**
```
http://localhost:5173,http://localhost:5174,https://cmmctestprepsim.netlify.app
```

### 3. Enable Management API
1. Go to **Applications** → **APIs** → **Auth0 Management API**
2. **Machine to Machine Applications** tab
3. Find your "CMMC Exam Prep" app
4. Toggle **ON** to authorize
5. Select permissions:
   - ✅ read:current_user
   - ✅ update:current_user_metadata
   - ✅ read:users_app_metadata
   - ✅ update:users_app_metadata
6. Click **Update**

### 4. Get Your Credentials
In Application Settings, copy:
- **Domain** (e.g., dev-xxxxx.us.auth0.com)
- **Client ID** (e.g., xxxxxxxxxxxxxxxxxxxxxx)

### 5. Update Environment Variables
Update your local `.env` file:
```bash
VITE_AUTH0_DOMAIN=your-domain-here.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id-here
VITE_AUTH0_AUDIENCE=https://your-domain-here.auth0.com/api/v2/
```

### 6. Update Netlify Environment Variables
1. Go to Netlify → Site Settings → Environment Variables
2. Update the same three variables with your new credentials
3. Save changes

### 7. Deploy and Test
1. Commit and push your changes
2. Wait for Netlify deployment
3. Test on both computer and Kindle

## Features After Setup
- ✅ Computer: Automatic login and sync
- ✅ Kindle: Login works, or click "Continue without sign-in" after 2.5 seconds
- ✅ Cross-device sync between both devices
- ✅ All features work normally

## Troubleshooting
- If Kindle gets stuck: Wait 2.5 seconds, then click "Continue without sign-in"
- If computer has issues: Check that all URLs are added to Auth0 settings
- If deployment fails: Check Netlify environment variables match exactly

That's it! Your app will work on both devices with sync.
