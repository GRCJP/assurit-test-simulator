# Assurit Test Simulator

## Project Setup Complete ✅

Your Assurit Test Simulator has been successfully configured for GitHub Pages deployment.

## What's Been Done:

1. **Project Copied**: Created a clean copy at `/Users/jleepe/CascadeProjects/repo/assurit-test-simulator`
2. **Netlify Files Removed**: Removed `.netlify`, `netlify.toml`, and `.netlifyignore`
3. **Vite Configured**: Updated `vite.config.js` with GitHub Pages base path `/assurit-test-simulator/`
4. **Package Scripts**: Added GitHub Pages specific scripts
5. **GitHub Actions**: Created automatic deployment workflow
6. **Build Tested**: Successfully verified the build process

## Next Steps to Deploy:

### Step 1: Create GitHub Repository
```bash
# Navigate to the project directory
cd "/Users/jleepe/CascadeProjects/repo/assurit-test-simulator"

# Initialize git repository
git init
git add .
git commit -m "Initial commit - GitHub Pages setup"

# Create a new repository on GitHub named "assurit-test-simulator"
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/assurit-test-simulator.git
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click Settings → Pages
3. Source: Deploy from a branch
4. Branch: main / (root)
5. Click Save

### Step 3: Enable GitHub Actions
1. Go to Settings → Actions → General
2. Scroll down to "Workflow permissions"
3. Select "Read and write permissions"
4. Check "Allow GitHub Actions to create and approve pull requests"
5. Click Save

### Step 4: Deploy
The automatic deployment will trigger when you push to main branch. You can also deploy manually:
```bash
npm run deploy:github
```

## Key Differences from Original:

- **Base Path**: Configured for GitHub Pages subdirectory deployment
- **No Netlify**: All Netlify-specific files removed
- **Automatic Deployment**: GitHub Actions workflow for CI/CD
- **Clean Repository**: Fresh git history for clean deployment

## Testing Locally:
```bash
cd "/Users/jleepe/CascadeProjects/repo/assurit-test-simulator"
npm run dev
```

## URL Structure:
Once deployed, your app will be available at:
`https://YOUR_USERNAME.github.io/assurit-test-simulator/`

## Original Project Remains Intact:
Your original project at `/Users/jleepe/CascadeProjects/repo/CMMC Exam Prep` is completely unchanged and continues to work with Netlify.
