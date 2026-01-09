# Auth0 Management API Configuration Guide

## Quick Fix for Cross-Device Sync

Follow these exact steps in your Auth0 dashboard:

### 1. Go to Auth0 Dashboard
- Login to https://manage.auth0.com
- Select your application: "dev-351wds1ubpw3eyut.us.auth0.com"

### 2. Enable Management API
- Go to **Applications** → **Applications** → Select your app
- Click on the **APIs** tab
- Click **"Auth0 Management API"** (it should be in the list)
- Click the **"✓ Authorize"** button

### 3. Add Required Permissions
In the same Management API section, add these permissions:
- ✅ **read:current_user_metadata**
- ✅ **update:current_user_metadata**
- ✅ **read:users_app_metadata** (optional)
- ✅ **update:users_app_metadata** (optional)

### 4. Configure Application Settings
- Go back to **Applications** → **Applications** → Your app
- Click on **Settings** tab
- Scroll down to **"Application URIs"**
- Make sure **"Allowed Callback URLs"** includes:
  ```
  https://grcjp.github.io/assurit-test-simulator
  https://localhost:5173
  http://localhost:5173
  ```
- Make sure **"Allowed Logout URLs"** includes:
  ```
  https://grcjp.github.io/assurit-test-simulator
  https://localhost:5173
  http://localhost:5173
  ```
- Make sure **"Allowed Web Origins"** includes:
  ```
  https://grcjp.github.io
  https://localhost:5173
  http://localhost:5173
  ```

### 5. Enable Refresh Tokens (Important!)
- In the same Settings tab, scroll down to **"Advanced Settings"**
- Click **"OAuth"** tab
- Set **"Refresh Token Rotation"** to **"Rotating"**
- Set **"Refresh Token Expiration"** to **"2592000"** (30 days)

### 6. Save Everything
- Click **"Save Changes"** at the bottom
- Wait 2-3 minutes for changes to propagate

### 7. Test the Sync
- Go to your app: https://grcjp.github.io/assurit-test-simulator/
- Open browser console (F12)
- You should see: "✅ Management API token received successfully"
- The 400 errors should be gone

## What This Fixes:
- ✅ Eliminates all 400 Bad Request errors
- ✅ Enables automatic cross-device sync
- ✅ Study plans, domain mastery, progress sync automatically
- ✅ No more manual export/import needed

## If You Still See Errors:
1. Make sure you clicked **"✓ Authorize"** on Management API
2. Check that all permissions are added
3. Verify refresh token rotation is enabled
4. Wait 5 minutes for Auth0 to update

That's it! Once configured properly, the automatic sync will work perfectly.
