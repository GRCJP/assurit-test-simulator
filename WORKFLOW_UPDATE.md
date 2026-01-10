# GitHub Actions Workflow Update

## The Issue
The build is running without VITE_* environment variables, causing the bundle to have undefined config values, leading to "Invalid API key" and 401 errors.

## The Fix

### 1. Update .github/workflows/deploy.yml

Replace the entire file with this:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    permissions:
      contents: read
      pages: write
      id-token: write
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        VITE_AUTH0_DOMAIN: ${{ secrets.VITE_AUTH0_DOMAIN }}
        VITE_AUTH0_CLIENT_ID: ${{ secrets.VITE_AUTH0_CLIENT_ID }}
        VITE_AUTH0_AUDIENCE: ${{ secrets.VITE_AUTH0_AUDIENCE }}
        VITE_AUTH0_REDIRECT_URI: ${{ secrets.VITE_AUTH0_REDIRECT_URI }}
      run: npm run build

    - name: Setup Pages
      uses: actions/configure-pages@v4

    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest

    permissions:
      pages: write
      id-token: write

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

### 2. Make sure you have the secrets added

Go to: https://github.com/GRCJP/assurit-test-simulator/settings/secrets/actions

Ensure these 6 secrets exist:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_AUTH0_DOMAIN
- VITE_AUTH0_CLIENT_ID
- VITE_AUTH0_AUDIENCE
- VITE_AUTH0_REDIRECT_URI

### 3. After updating

1. Commit the workflow changes
2. Go to Actions tab and watch the build
3. The Build step should be green
4. After deployment, validate the bundle:
   - Open https://grcjp.github.io/assurit-test-simulator/
   - View Page Source
   - Find the JavaScript bundle (index-*.js)
   - Search for `szyjviaolnaoywopfrqp` (should find it)
   - Search for `eyJhbGci` (should find it)

If you find these values, the build has the correct configuration!
