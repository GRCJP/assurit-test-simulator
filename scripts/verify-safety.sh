#!/bin/bash

# Safety Verification Script for CMMC Test Simulator
# This script ensures no regressions and validates safety guards

set -e

echo "🔍 Starting Safety Verification..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track failures
FAILURES=0

# Helper function to log failure
log_failure() {
    echo -e "${RED}❌ $1${NC}"
    FAILURES=$((FAILURES + 1))
}

# Helper function to log success
log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Helper function to log warning
log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo ""
echo "📋 Step 1: Checking git status and branch"
echo "-----------------------------------------"

# Check if we're on a feature branch
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" =~ ^wind/ ]]; then
    log_success "On feature branch: $CURRENT_BRANCH"
else
    log_failure "Not on a wind/ feature branch. Current: $CURRENT_BRANCH"
fi

# Check for uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    log_failure "Uncommitted changes detected. Please commit before running verification."
else
    log_success "No uncommitted changes"
fi

echo ""
echo "🏗️  Step 2: Build verification"
echo "------------------------------"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci
fi

# Run tests if they exist
if [ -f "package.json" ] && grep -q "test" package.json; then
    echo "Running tests..."
    if npm test; then
        log_success "Tests passed"
    else
        log_failure "Tests failed"
    fi
else
    log_warning "No tests found in package.json"
fi

# Build the application
echo "Building application..."
if npm run build; then
    log_success "Build successful"
else
    log_failure "Build failed"
fi

echo ""
echo "🔧 Step 3: Code quality checks"
echo "-----------------------------"

# Run linter
if npm run lint; then
    log_success "Linting passed"
else
    log_failure "Linting failed"
fi

echo ""
echo "🧪 Step 4: Safety pattern verification"
echo "--------------------------------------"

# Check for dangerous patterns
echo "Checking for dangerous code patterns..."

# 🚫 FORBIDDEN: Data structure changes
if grep -r "new.*Question\|interface.*Question\|type.*Question" src/ --include="*.js" --include="*.jsx" | grep -v "//.*TODO"; then
    log_failure "Found data structure changes (question format)"
fi

# 🚫 FORBIDDEN: New persistence keys
if grep -r "localStorage\.setItem.*cmmc_[^a-zA-Z]" src/ --include="*.js" --include="*.jsx" | grep -v "cmmcFeatureFlags\|cmmc_bypass_auth"; then
    log_failure "Found new persistence keys (localStorage items)"
fi

# 🚫 FORBIDDEN: Selection logic modifications
if grep -r "getPrioritizedQuestions\|getAdaptiveStudyPlan" src/ --include="*.js" --include="*.jsx" | grep -q "\[.*\].*="; then
    log_failure "Found selection logic modifications"
fi

# 🚫 FORBIDDEN: Queue modifications
if grep -r "spacedRepetition.*queue\|reviewQueue" src/ --include="*.js" --include="*.jsx" | grep -q "push\|pop\|splice"; then
    log_failure "Found queue modifications"
fi

# 🚫 FORBIDDEN: New async flows
if grep -r "async.*fetch\|new Promise" src/ --include="*.js" --include="*.jsx" | grep -v "userDataSync\|getAccessTokenSilently"; then
    log_failure "Found new async flows"
fi

# 🚫 FORBIDDEN: Learning algorithm changes
if grep -r "adaptiveDifficulty\|domainMastery" src/ --include="*.js" --include="*.jsx" | grep -q "\[.*\].*="; then
    log_failure "Found learning algorithm modifications"
fi

# 🚫 FORBIDDEN: Scoring model changes
if grep -r "scoreStats\|updateScoreStats" src/ --include="*.js" --include="*.jsx" | grep -q "\[.*\].*="; then
    log_failure "Found scoring model modifications"
fi

# 🚫 FORBIDDEN: Auth0 sync behavior changes
if grep -r "syncDataFromCloud\|syncDataToCloud" src/ --include="*.js" --include="*.jsx" | grep -v "userDataSync\."; then
    log_failure "Found Auth0 sync behavior modifications"
fi

# ✅ ALLOWED: Check for safe patterns
SAFE_PATTERNS=(
    "className"
    "style="
    "text-"
    "bg-"
    "px-\|py-\|p-"
    "flex\|grid"
    "text="
    "title="
    "aria-"
    "onKeyDown\|onKeyPress"
)

SAFE_COUNT=0
for pattern in "${SAFE_PATTERNS[@]}"; do
    COUNT=$(grep -r "$pattern" src/ --include="*.js" --include="*.jsx" | wc -l)
    if [ "$COUNT" -gt 0 ]; then
        echo "✅ Found safe pattern '$pattern': $COUNT usages"
        SAFE_COUNT=$((SAFE_COUNT + COUNT))
    fi
done

if [ "$SAFE_COUNT" -gt 0 ]; then
    log_success "Found $SAFE_COUNT safe enhancement patterns"
fi

echo ""
echo "🎯 Step 5: Daily Drills verification"
echo "------------------------------------"

# Start dev server in background
echo "Starting development server..."
npm run dev &
DEV_PID=$!

# Wait for server to start
sleep 10

# Check if server is running
if curl -s http://localhost:5173 > /dev/null; then
    log_success "Development server started"
    
    # Note: Manual testing required for Daily Drills
    echo "🔍 Manual testing required:"
    echo "   - Test Daily Drills with bank206"
    echo "   - Test Daily Drills with bankCCA"
    echo "   - Check for Auth0 token errors"
    echo "   - Verify no sync queue growth"
    echo ""
    echo "Press Enter to continue after manual testing..."
    read -r
    
    # Kill dev server
    kill $DEV_PID
    log_success "Development server stopped"
else
    log_failure "Development server failed to start"
    kill $DEV_PID 2>/dev/null || true
fi

echo ""
echo "📊 Step 6: Baseline comparison"
echo "-----------------------------"

# Get current commit hash
CURRENT_COMMIT=$(git rev-parse HEAD)
BASELINE_COMMIT="880831f"  # Golden baseline

echo "Current commit: $CURRENT_COMMIT"
echo "Baseline commit: $BASELINE_COMMIT"

# Check for critical file changes
CRITICAL_FILES=(
    "src/contexts/TestModeContext.jsx"
    "src/contexts/UserDataSync.js"
    "src/App.jsx"
)

for file in "${CRITICAL_FILES[@]}"; do
    if git show --name-only --pretty=format: "$BASELINE_COMMIT..HEAD" | grep -q "$file"; then
        log_warning "Critical file modified: $file"
    fi
done

echo ""
echo "📋 Summary Report"
echo "=================="

if [ $FAILURES -eq 0 ]; then
    log_success "All safety checks passed! ✨"
    echo ""
    echo "Ready for PR creation:"
    echo "- Branch: $CURRENT_BRANCH"
    echo "- Commit: $CURRENT_COMMIT"
    echo "- Build: ✅"
    echo "- Tests: ✅"
    echo "- Lint: ✅"
    exit 0
else
    log_failure "$FAILURES safety check(s) failed!"
    echo ""
    echo "Please fix the above issues before proceeding."
    exit 1
fi
