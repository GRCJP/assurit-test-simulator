# CMMC Test Simulator - GitHub Pages

This is a GitHub Pages deployment of the CMMC Test Simulator.

## Deployment

This project is automatically deployed to GitHub Pages when changes are pushed to the main branch.

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

### Manual Deployment

To manually deploy to GitHub Pages:
```bash
npm run deploy:github
```

## Original Project

This is a copy of the original CMMC Test Simulator project, configured specifically for GitHub Pages deployment.

## Key Differences from Original

- Vite base path configured for GitHub Pages (`/CMMC-Test-Simulator/`)
- Netlify configuration files removed
- GitHub Actions workflow for automatic deployment
- Updated package.json scripts for GitHub Pages deployment
