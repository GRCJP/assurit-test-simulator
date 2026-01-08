## 📋 Pull Request Template

### 🎯 **Treat current production main@880831f behavior as the golden baseline. Any deviation is a bug.**

---

## 🎯 Enhancement Type Classification

### ✅ ALLOWED Enhancement Types:
- [ ] UI Layout Changes
- [ ] Visual Density Improvements  
- [ ] Microcopy
- [ ] Progress Visualization
- [ ] Timers
- [ ] Hints
- [ ] Badges
- [ ] Emphasis, Color, Spacing
- [ ] Explanation Presentation
- [ ] Keyboard Shortcuts

### 🚫 FORBIDDEN Enhancement Types (Must NOT include):
- [ ] Changing Data Structures
- [ ] Adding New Persistence Keys
- [ ] Touching Selection Logic
- [ ] Modifying Queues
- [ ] Introducing New Async Flows
- [ ] Rewriting Learning Algorithms
- [ ] "Optimizing" Scoring Models
- [ ] Altering Auth0 Sync Behavior

---

## 📝 Description
<!-- Brief description of the change -->

## 🔄 Change Summary
<!-- Smallest possible change set description -->

### Files Changed:
<!-- List of files that will be modified -->

### Feature Flag Status:
- [ ] Feature implemented behind flag (defaulted OFF)
- [ ] Flag name: `featureName`
- [ ] Production behavior unchanged when flag is OFF

---

## ✅ Safety Verification

### 🧪 Automated Checks
```bash
# All checks passed:
npm test:     [ ] PASS/FAIL
npm run build: [ ] PASS/FAIL  
npm run lint:  [ ] PASS/FAIL
./scripts/verify-safety.sh: [ ] PASS/FAIL
```

### 🎮 Manual Testing Results

#### Daily Drills Verification:
- [ ] bank206 loads without crashing
- [ ] bankCCA loads without crashing
- [ ] All existing modes work identically to production
- [ ] No new console errors

#### Auth0 & Sync Verification:
- [ ] No Auth0 token errors
- [ ] No sync queue growth
- [ ] Cloud sync functionality unchanged
- [ ] LocalStorage data formats unchanged

#### Screenshots/Console Output:
<!-- Add screenshots or console snippets showing Daily Drills works -->

```
// Console output showing successful operation
```

---

## 🔒 Safety Guards

### Non-negotiable Rules Compliance:
- [ ] **Production behavior unchanged** when feature flag is OFF
- [ ] **Auth0 cloud sync logic untouched** (unless specifically required)
- [ ] **No localStorage migrations** that rewrite/delete bank data
- [ ] **Current build behavior identical** first, then enhancement added

### Risk Assessment:
- [ ] Low risk: Feature flag controlled
- [ ] No breaking changes
- [ ] Backward compatible

---

## 📊 Test Results

### What I tested:
1. <!-- Test case 1 -->
2. <!-- Test case 2 -->
3. <!-- Test case 3 -->

### Test Environment:
- Browser: <!-- Chrome/Firefox/Safari version -->
- Node.js: <!-- version -->
- Question banks tested: bank206, bankCCA

### Performance Impact:
- [ ] No performance degradation
- [ ] Memory usage unchanged
- [ ] Build size impact: <!-- bytes -->

---

## 🚀 Acceptance Criteria

- [ ] Safety Guards CI is green
- [ ] App behavior matches current production for all existing modes
- [ ] Enhancement works only when feature flag is enabled
- [ ] No new console errors
- [ ] No changes to persisted bank data formats

---

## 📚 Documentation

- [ ] Code comments added where necessary
- [ ] Feature flag documented in code
- [ ] User-facing documentation updated (if applicable)

---

## 🔗 Related Issues

Closes: #<!-- issue number -->
Related: #<!-- issue number -->

---

## 📝 Review Checklist

### For Reviewers:
- [ ] Verify production behavior unchanged when flag is OFF
- [ ] Check Daily Drills loads for both bank206 and bankCCA
- [ ] Confirm no Auth0 token errors
- [ ] Verify no localStorage data loss
- [ ] Test feature flag ON/OFF functionality

### For Author:
- [ ] All verification steps completed
- [ ] Documentation updated
- [ ] Ready for production deployment

---

**⚠️  DO NOT MERGE until all checks are GREEN and manual testing is complete.**
