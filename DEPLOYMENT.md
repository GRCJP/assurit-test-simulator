# Secure Deployment Instructions

## Why This Matters
- **Current issue**: Auth0 client ID exposed in browser code when manually uploading `dist` folder
- **Security risk**: Client ID visible in JavaScript bundle
- **Solution**: Use Netlify's build system to inject environment variables securely

## Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Update UI and fix Auth0 configuration"
git push origin backup-before-cca-bank-empty
```

## Step 2: Set Up Netlify Continuous Deployment
1. **Netlify Dashboard** → Sites → Add new site → Import existing project
2. **Connect to GitHub** (authorize Netlify access)
3. **Select repository**: `GRCJP/CMMC-Test-Bank`
4. **Select branch**: `backup-before-cca-bank-empty`

## Step 3: Configure Build Settings
Netlify auto-detects from `netlify.toml`:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `20`

## Step 4: Set Environment Variables (SECURE)
1. **Site settings** → Environment variables
2. **Add variables**:
   - `VITE_AUTH0_DOMAIN` = `your-auth0-domain.auth0.com`
   - `VITE_AUTH0_CLIENT_ID` = `your-auth0-client-id`

## Step 5: Deploy & Verify
1. **Trigger deploy** in Netlify
2. **Wait for build** - Netlify injects env vars during build
3. **Verify** - Site loads without Auth0 errors

## Security Benefits
- Client ID never exposed in source code
- Environment variables stay on Netlify servers
- Future updates deploy automatically
- No manual `dist` uploads needed

## File Location
Save this file as: `DEPLOYMENT.md` in the project root directory
