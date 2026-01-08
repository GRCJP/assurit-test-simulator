# 🎯 Exam-Focused Dashboard Layout Design

## Current Layout (Before)
```
┌─────────────────────────────────────────┐
│ Header with navigation                  │
├─────────────────────────────────────────┤
│ Welcome section with badge              │
│ Quick action tiles (4 columns)          │
│ Progress indicator                      │
│ Study plan info                         │
│ Additional quick links (4 columns)      │
└─────────────────────────────────────────┘
```

## New Layout (After)
```
┌─────────────────────────────────────────┐
│ Header with navigation                  │
├─────────────────────────────────────────┤
│ 🎯 EXAM COMMAND CENTER                  │
│ ┌─────────────────────────────────────┐ │
│ │ 🔥 15 Day Streak | 📅 32 Days Left  │ │
│ │ 📊 Exam Readiness: 78%              │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 🚀 START TODAY'S MISSION                │
│ ┌─────────────────────────────────────┐ │
│ │ [BEGIN DAILY DRILLS - 10 QUESTIONS] │ │
│ │ Complete your daily practice to     │ │
│ │ maintain streak and improve readiness│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 📈 DOMAIN PERFORMANCE                  │
│ ┌─────────────────────────────────────┐ │
│ │ Access Control ✅ 85%  [Practice]   │ │
│ │ Incident Response ⚠️ 72%  [Focus]    │ │
│ │ Risk Assessment ✅ 91%  [Review]    │ │
│ │ Security Assessment ❌ 65%  [Study]  │ │
│ │ Asset Management ✅ 88%  [Maintain]  │ │
│ │ ... (scrollable list)                │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ⏰ QUICK ACTIONS                        │
│ ┌─────────────────────────────────────┐ │
│ │ [Review Missed] [Full Practice]    │ │
│ │ [Exam Simulation] [Study Plan]      │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Design Principles

### Visual Hierarchy
1. **Urgency First**: Streak + countdown at top
2. **Primary Action**: Single clear call-to-action
3. **Performance Insights**: Domain breakdown with clear indicators
4. **Quick Access**: Secondary actions grouped together

### Color Coding
- 🟢 **Green (85%+)**: Strong performance
- 🟡 **Yellow (70-84%)**: Needs attention  
- 🔴 **Red (<70%)**: Requires focus

### Interactive Elements
- Domains are clickable to launch focused practice
- Single primary action button dominates the UI
- Progress indicators provide immediate feedback

### Data Sources (Read-Only)
- `progressStreaks.currentStreak` → Streak display
- `daysUntil(studyPlan.testDate)` → Countdown
- `getWeakDomains()` → Domain performance list
- `domainMastery.levels` → Performance percentages
- Existing navigation actions → Quick actions

## Feature Flag Control
- `examFocusedDashboard: false` (default)
- When OFF: Shows original dashboard
- When ON: Shows new exam command center
- Zero behavior changes, pure UI transformation
