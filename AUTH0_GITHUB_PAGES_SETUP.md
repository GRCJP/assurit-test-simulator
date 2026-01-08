# Auth0 Configuration for Assurit Test Simulator

## Quick Setup for GitHub Pages

### 1. Update Auth0 Application
1. Go to https://auth0.com/dashboard
2. Select your existing "CMMC Exam Prep" application
3. Go to **Settings** → **Application URIs**

### 2. Update Application URLs
Replace ALL the URL configurations with:

**Allowed Callback URLs:**
```
http://localhost:5173,http://localhost:5174,https://cmmctestprepsim.netlify.app,https://grcjp.github.io/assurit-test-simulator
```

**Allowed Logout URLs:**
```
http://localhost:5173,http://localhost:5174,https://cmmctestprepsim.netlify.app,https://grcjp.github.io/assurit-test-simulator
```

**Allowed Web Origins:**
```
http://localhost:5173,http://localhost:5174,https://cmmctestprepsim.netlify.app,https://grcjp.github.io/assurit-test-simulator
```

**Allowed Origins (CORS):**
```
http://localhost:5173,http://localhost:5174,https://cmmctestprepsim.netlify.app,https://grcjp.github.io/assurit-test-simulator
```

### 3. Important: Save Changes
Click **Save Changes** at the bottom of the page

### 4. Test the Application
Go to https://grcjp.github.io/assurit-test-simulator/ and try logging in again

## Troubleshooting
- If you still get the error, make sure you copied the EXACT URL: `https://grcjp.github.io/assurit-test-simulator`
- No trailing slash needed in Auth0 configuration
- Make sure all four URL fields are updated
- Wait 30 seconds after saving before testing

## Alternative: Disable Auth0 for Testing
If you want to test without Auth0, create a `.env` file with:
```
VITE_BYPASS_AUTH=true
```

Then redeploy:
```bash
npm run build
git add . && git commit -m "Bypass Auth0 for testing"
git push origin main
```
