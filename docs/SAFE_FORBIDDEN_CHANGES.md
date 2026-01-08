# 🚀 Quick Reference: Safe vs Forbidden Changes

## ✅ SAFE CHANGES (Go for it!)

### UI/Visual Enhancements
```jsx
// ✅ Allowed: Styling and layout
<div className="p-4 bg-blue-500 text-white rounded-lg">
  <h2 className="text-xl font-bold">Better Progress</h2>
  <div className="flex items-center gap-2">
    <span className="text-sm">75% Complete</span>
  </div>
</div>

// ✅ Allowed: Microcopy
<button>Start Practice →</button>
<button aria-label="Begin daily practice session">Start</button>

// ✅ Allowed: Keyboard shortcuts
useEffect(() => {
  const handleKeyPress = (e) => {
    if (e.key === 'n' && e.ctrlKey) {
      nextQuestion();
    }
  };
  document.addEventListener('keydown', handleKeyPress);
  return () => document.removeEventListener('keydown', handleKeyPress);
}, []);
```

### Progress Visualization
```jsx
// ✅ Allowed: Better progress bars
<div className="w-full bg-gray-200 rounded-full h-2">
  <div 
    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>

// ✅ Allowed: Charts and badges
<Badge variant="success">🔥 5 Day Streak!</Badge>
<ProgressChart data={weeklyData} />
```

## 🚫 FORBIDDEN CHANGES (Stop!)

### Data Structure Changes
```jsx
// 🚫 FORBIDDEN: Changing question format
interface Question {
  // ❌ Don't add new required fields
  newField: string; // This breaks existing data
}

// 🚫 FORBIDDEN: New localStorage keys
localStorage.setItem('cmmc_new_tracking', JSON.stringify(data)); // ❌
```

### Selection Logic Changes
```jsx
// 🚫 FORBIDDEN: Modifying question selection
const getPrioritizedQuestions = () => {
  // ❌ Don't change the core algorithm
  return questions.sort((a, b) => a.newMetric - b.newMetric);
};
```

### Queue Modifications
```jsx
// 🚫 FORBIDDEN: Changing review queues
const spacedRepetition = {
  queue: [...oldQueue, newItem], // ❌ Don't modify queue structure
};
```

### Async Flow Changes
```jsx
// 🚫 FORBIDDEN: New API calls
const fetchNewData = async () => {
  const response = await fetch('/api/new-endpoint'); // ❌
  return response.json();
};
```

### Learning Algorithm Changes
```jsx
// 🚫 FORBIDDEN: Modifying adaptive difficulty
const updateAdaptiveDifficulty = () => {
  // ❌ Don't change the core algorithm
  adaptiveDifficulty.currentLevel = newCalculation();
};
```

### Scoring Model Changes
```jsx
// 🚫 FORBIDDEN: Changing score calculation
const updateScoreStats = () => {
  // ❌ Don't modify the scoring model
  scoreStats.accuracy = newWeightedAverage();
};
```

### Auth0 Sync Changes
```jsx
// 🚫 FORBIDDEN: Modifying sync behavior
const syncDataToCloud = async () => {
  // ❌ Don't change the sync logic
  await customSyncEndpoint(data);
};
```

## 🛡️ Safe Development Pattern

```jsx
// ✅ SAFE: Use feature flags for new features
const EnhancedProgress = () => {
  const { isFeatureEnabled } = useTestMode();
  
  if (!isFeatureEnabled('enhancedProgress')) {
    return <OldProgress />; // Original behavior
  }
  
  return (
    <div className="enhanced-progress">
      {/* New safe enhancement */}
    </div>
  );
};
```

## 🧪 Testing Checklist

Before committing:
- [ ] Only UI/visual changes?
- [ ] No new localStorage keys?
- [ ] No data structure changes?
- [ ] No algorithm modifications?
- [ ] No new async flows?
- [ ] Feature flag implemented?

## 🚨 Emergency

If you accidentally make forbidden changes:
```bash
# Reset to safe state
git reset --hard HEAD~1
git checkout main
git checkout -b wind/safe-enhancement-name
```

Remember: **When in doubt, ask!** It's better to clarify than to break production.
