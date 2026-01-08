#!/bin/bash

# Baseline Protection Script
# Ensures main@880831f behavior is preserved

set -e

BASELINE_COMMIT="880831f"
PROTECTED_FILES=(
    "src/contexts/UserDataSync.js"
    "data/questions.json"
    "data/questions_170.json"
    "data/questions_cca.json"
)

echo "🛡️ Baseline Protection Check"
echo "==========================="
echo "Baseline: main@880831f"
echo ""

# Check if we're trying to modify protected files on main branch
CURRENT_BRANCH=$(git branch --show-current)

if [[ "$CURRENT_BRANCH" == "main" ]]; then
    echo "⚠️  WARNING: You are on main branch"
    
    for file in "${PROTECTED_FILES[@]}"; do
        if [[ -n $(git status --porcelain "$file" 2>/dev/null) ]]; then
            echo "🚫 BLOCKED: Cannot modify protected file on main: $file"
            echo "Please create a feature branch: git checkout -b wind/your-feature"
            exit 1
        fi
    done
fi

# Check for dangerous patterns in staged changes
if [[ -n $(git diff --cached --name-only) ]]; then
    echo "🔍 Checking staged changes for dangerous patterns..."
    
    # Check for localStorage clear operations
    if git diff --cached src/ | grep -q "localStorage\.clear\|localStorage\.removeItem.*cmmc_.*bank"; then
        echo "🚫 BLOCKED: Found localStorage bank data deletion"
        exit 1
    fi
    
    # Check for Auth0 sync modifications
    if git diff --cached src/ | grep -q "syncDataFromCloud\|syncDataToCloud" | grep -v "userDataSync\."; then
        echo "⚠️  WARNING: Auth0 sync logic modified"
        echo "Ensure this is explicitly required by the feature"
    fi
fi

echo "✅ Baseline protection checks passed"
echo ""
echo "📋 Reminder: Treat main@880831f as golden baseline"
echo "Any deviation from baseline behavior is a bug unless approved"
