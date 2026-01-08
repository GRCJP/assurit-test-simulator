# Component Development Safety Guide

## Preventing Temporal Dead Zone Errors

This guide helps prevent the `ReferenceError: Cannot access 'X' before initialization` errors that can crash your React components.

## 🚫 Common Pitfalls

### 1. Variable Used Before Declaration
```javascript
// ❌ WRONG - Causes temporal dead zone error
const MyComponent = () => {
  useEffect(() => {
    if (q && someCondition(q)) { // q used before declaration!
      // ...
    }
  }, [q]);
  
  const q = someFunction(); // Declared after useEffect!
  
  return <div>{q?.text}</div>;
};
```

### 2. Context Values Without Defaults
```javascript
// ❌ WRONG - Can crash if context is undefined
const { darkMode, missedQuestions } = useTestMode(); // May be undefined
```

### 3. Array Access Without Bounds Checking
```javascript
// ❌ WRONG - Can crash if array is empty or index is invalid
const question = questions[currentIndex]; // May be undefined
```

## ✅ Safe Patterns

### 1. Declare Variables Before Use
```javascript
// ✅ CORRECT - Variable declared before useEffect
const MyComponent = () => {
  const [data, setData] = useState(null);
  
  // Declare computed values before using them
  const computedValue = useMemo(() => {
    return data ? data.someProperty : null;
  }, [data]);
  
  useEffect(() => {
    if (computedValue) {
      // Safe to use computedValue here
    }
  }, [computedValue]);
  
  return <div>{computedValue}</div>;
};
```

### 2. Safe Context Destructuring
```javascript
// ✅ CORRECT - Use defaults for context values
import { safeContextDestructure } from './utils/componentSafety.js';

const MyComponent = () => {
  const context = useTestMode();
  const { 
    darkMode = false, 
    missedQuestions = [], 
    recordAttempt = () => {} 
  } = safeContextDestructure(context, {
    darkMode: false,
    missedQuestions: [],
    recordAttempt: () => {}
  });
  
  // Safe to use these values now
};
```

### 3. Safe Array Access
```javascript
// ✅ CORRECT - Use bounds checking
import { safeArrayAccess } from './utils/componentSafety.js';

const MyComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const currentQuestion = useMemo(() => {
    return safeArrayAccess(questions, currentIndex, null);
  }, [questions, currentIndex]);
  
  if (!currentQuestion) {
    return <div>Loading...</div>;
  }
  
  return <div>{currentQuestion.text}</div>;
};
```

## 🛡️ Defensive Programming Checklist

Before committing any component changes, verify:

- [ ] **Variable Declaration Order**: All variables used in useEffect are declared before the useEffect
- [ ] **Context Safety**: Context values have default values or null checks
- [ ] **Array Access**: Array indexing uses bounds checking
- [ ] **Object Properties**: Object properties are checked before access
- [ ] **Error Handling**: Risky operations are wrapped in try-catch
- [ ] **Null Checks**: Optional chaining (?.) is used for potentially null values

## 🔧 Utility Functions

Use the safety utilities in `src/utils/componentSafety.js`:

```javascript
import { 
  safeAccess, 
  safeArrayAccess, 
  isValidQuestion, 
  safeContextDestructure 
} from './utils/componentSafety.js';

// Safe variable access
const value = safeAccess(variable, defaultValue);

// Safe array access
const item = safeArrayAccess(array, index, defaultValue);

// Question validation
if (isValidQuestion(question)) {
  // Safe to use question properties
}

// Safe context destructuring
const context = safeContextDestructure(useTestMode(), defaults);
```

## 🧪 Testing

Run component safety tests in development:

```bash
# The safety tests will auto-run in development mode
# Check console for test results
npm run dev
```

## 📋 Code Review Checklist

When reviewing PRs, check for:

1. **Temporal Dead Zone Issues**: Look for variables used before declaration
2. **Context Safety**: Ensure context values have fallbacks
3. **Array Safety**: Verify array access is bounds-checked
4. **Error Handling**: Confirm risky operations have try-catch blocks
5. **Null Safety**: Check for proper null/undefined handling

## 🚨 Recent Fixed Issues

### ReviewMissed Component
- **Issue**: Variable `q` was used in useEffect before declaration
- **Fix**: Moved `q` declaration before useEffect and added useMemo with safety checks
- **Prevention**: Added comprehensive defensive programming patterns

### Prevention Measures
1. Created component safety utilities
2. Added automatic safety tests
3. Implemented defensive programming patterns
4. Created development safety guide

## 🔄 Migration Guide

To migrate existing components to safe patterns:

1. **Identify Risky Patterns**: Search for useEffect with variables declared after
2. **Add Safety Imports**: Import safety utilities
3. **Implement Safe Access**: Replace direct access with safe utilities
4. **Add Tests**: Verify component handles edge cases
5. **Update Documentation**: Document any special cases

## 📞 Getting Help

If you encounter temporal dead zone errors:

1. Check variable declaration order
2. Use the safety utilities
3. Run the component safety tests
4. Follow this guide's patterns

Remember: **Prevention is better than debugging!**
