# 🛡️ Safe Development Workflow

**Treat current production main@880831f behavior as the golden baseline. Any deviation is a bug.**

## 📋 Overview

This workflow ensures zero regressions while safely implementing new features using feature flags.

## 🎯 Enhancement Types

### ✅ **ALLOWED** (Safe Enhancements)
These are safe and encouraged:

- **UI Layout Changes** - Component arrangement, responsive design
- **Visual Density Improvements** - Better space utilization
- **Microcopy** - Button text, labels, instructions
- **Progress Visualization** - Charts, progress bars, indicators
- **Timers** - Countdown, elapsed time displays
- **Hints** - Tooltips, help text, contextual guidance
- **Badges** - Achievement indicators, status markers
- **Emphasis, Color, Spacing** - Visual hierarchy improvements
- **Explanation Presentation** - Better content layout, modals
- **Keyboard Shortcuts** - Accessibility improvements

### 🚫 **FORBIDDEN** (Caused Previous Crashes)
These changes are strictly prohibited:

- **Changing Data Structures** - Question format, user data models
- **Adding New Persistence Keys** - New localStorage items
- **Touching Selection Logic** - Question picking algorithms
- **Modifying Queues** - Review queues, spaced repetition
- **Introducing New Async Flows** - New API calls, background processes
- **Rewriting Learning Algorithms** - Adaptive difficulty, mastery calculation
- **"Optimizing" Scoring Models** - Progress tracking, statistics
- **Altering Auth0 Sync Behavior** - Cloud synchronization logic

## 🔄 Step-by-Step Process

### A) Create Branch & PR Setup
```bash
# Create feature branch
git checkout -b wind/<feature-name>

# Start with PR template
# Use .github/pull_request_template.md
```

### B) Plan Changes (Before Coding)
1. **Describe smallest possible change set**
2. **List files that will change**
3. **Identify feature flag needs**
4. **Consider impact on existing functionality**

### C) Implement Behind Feature Flag
```javascript
// In TestModeContext.jsx - Add new flag
const [featureFlags, setFeatureFlags] = useState(() => ({
  // Existing flags
  dashboardPersistence: true,
  // NEW FLAG - Default to OFF
  yourNewFeature: false,
}));

// Use flag in code
if (isFeatureEnabled('yourNewFeature')) {
  // New implementation
} else {
  // Original behavior (unchanged)
}
```

### D) Run Verification
```bash
# Automated safety checks
./scripts/verify-safety.sh

# Manual testing checklist
npm run dev
# Test Daily Drills for bank206 and bankCCA
# Check for Auth0 token errors
# Verify no sync queue growth
```

### E) PR Documentation
Provide proof in PR description:
- ✅ What you tested
- 📸 Screenshots/console snippets
- 📋 List of files changed
- 🚫 Confirmation of no regressions

### F) Fix Until Green
- All automated checks must pass
- Manual testing must succeed
- No console errors
- Production behavior unchanged

### G) Merge Only When Green
- CI must be green
- All acceptance criteria met
- Feature flag still defaulted OFF

## 🔒 Non-Negotiable Rules

### 🚫 DO NOT:
- Change production behavior unless explicitly required
- Touch Auth0 cloud sync logic unless task-specific
- Create migrations that rewrite/delete localStorage bank data
- Merge without all checks passing

### ✅ DO:
- Keep current build behavior identical first
- Add enhancement behind feature flag (defaulted OFF)
- Test all existing functionality
- Document all changes

## 🧪 Verification Checklist

### Automated Checks:
- [ ] `npm test` passes
- [ ] `npm run build` succeeds
- [ ] `npm run lint` clean
- [ ] `./scripts/verify-safety.sh` passes

### Manual Testing:
- [ ] Daily Drills loads for bank206
- [ ] Daily Drills loads for bankCCA
- [ ] No Auth0 token errors
- [ ] No sync queue growth
- [ ] All existing modes work identically

### Safety Guards:
- [ ] Feature flag implemented correctly
- [ ] Production behavior unchanged when flag OFF
- [ ] No localStorage data loss
- [ ] No breaking changes

## 🎯 Feature Flag Guidelines

### Adding New Flags:
```javascript
// 1. Add to initial state
const [featureFlags, setFeatureFlags] = useState(() => ({
  existingFeature: true,
  newFeature: false, // Default OFF
}));

// 2. Use in implementation
if (isFeatureEnabled('newFeature')) {
  // New code
} else {
  // Original code
}

// 3. Add to context exports
const value = {
  // ... existing
  isFeatureEnabled,
  setFeatureFlag,
};
```

### Enabling Features for Testing:
```javascript
// In browser console for testing
window.cmmcSetFeatureFlag('yourFeature', true);
```

## 📊 Acceptance Criteria

Every PR must meet:
- [ ] Safety Guards CI is green
- [ ] App behavior matches current production for all existing modes
- [ ] Enhancement works only when feature flag is enabled
- [ ] No new console errors
- [ ] No changes to persisted bank data formats

## 🚨 Emergency Rollback

If issues arise:
1. Disable feature flag: `setFeatureFlag('problemFeature', false)`
2. Verify production behavior restored
3. Fix issues in new branch
4. Re-test before re-enabling

## 📚 Resources

- [Safety Verification Script](./scripts/verify-safety.sh)
- [PR Template](./.github/pull_request_template.md)
- [Feature Flag System](../src/contexts/TestModeContext.jsx)
- [Quick Reference: Safe vs Forbidden Changes](./SAFE_FORBIDDEN_CHANGES.md)

## 🎯 Quick Decision Tree

```
Is it a visual/UI change? → ✅ SAFE
Is it changing data structures? → 🚫 FORBIDDEN
Is it adding new localStorage? → 🚫 FORBIDDEN
Is it modifying algorithms? → 🚫 FORBIDDEN
Is it behind a feature flag? → ✅ MAYBE (if safe type)
```

---

**⚠️ REMEMBER: Any deviation from main@880831f behavior is a bug unless explicitly approved.**
