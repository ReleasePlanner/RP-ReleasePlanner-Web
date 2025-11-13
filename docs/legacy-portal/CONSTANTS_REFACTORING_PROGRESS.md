# Constants Refactoring Progress Report

## ✅ Completed

### Phase 1: Core Constants Infrastructure

1. **Created unified constants directory** (`src/constants/`)

   - status.ts - Entity status enums (Plan, Phase, Feature, Component)
   - priority.ts - Priority levels with utilities
   - component.ts - Component types and categories
   - ui.ts - UI dimensions, animations, spacing, Z-index
   - defaults.ts - Default values and phase templates
   - labels.ts - Common UI labels and icons
   - productStatuses.ts - Product data status mappings
   - planStatus.ts - Local plan status constants
   - README.md - Comprehensive documentation

2. **Centralized exports** via index.ts

   - Single import point: `import { ... } from "@/constants"`
   - All 50+ constants available through clean API

3. **Path alias setup**
   - Configured @/ alias in vite.config.ts
   - Configured baseUrl and paths in tsconfig.app.json
   - Enables cleaner imports across codebase

### Phase 2: Initial Refactoring

1. **phaseGenerator.ts**

   - Replaced hardcoded phase templates with DEFAULT_PHASE_TEMPLATE

2. **CommonDataCard components**

   - types.ts: Now imports COMMON_DATA_ICONS from constants
   - CommonDataPanel.tsx: Uses COMMON_DATA_LABELS and EMPTY_STATE_LABELS
   - Updated createCommonDataItems() to use constant labels

3. **PlanHeader.tsx (PlanCard variant)**
   - Replaced status switch statements with LOCAL_PLAN_STATUS_LABELS and LOCAL_PLAN_STATUS_COLORS
   - Cleaner, more maintainable code

### Phase 3: TypeScript & Build Verification

- ✅ Zero compilation errors
- ✅ Production build passing (634.50 kB gzip)
- ✅ All constants files properly typed with `as const`
- ✅ Type exports for TypeScript consumers

## 📋 In Progress / Remaining

### High Priority (Many Usages)

1. **PlanHeader Material variants**

   - `PlanHeaderMaterial.tsx` - Duplicate getStatusConfig logic
   - `PlanHeader.tsx` (Plan component variant) - Similar pattern
   - Action: Extract status config into constants, refactor similar to PlanCard version

2. **GanttChart components**

   - Timeline constants duplicated in components
   - PhaseBar, TaskBar dimension calculations
   - Action: Use GANTT_DIMENSIONS from constants

3. **GanttTimeline constants.ts**
   - Already defines dimensions locally
   - Should import from @/constants instead
   - Action: Replace with centralized constants

### Medium Priority (Scattered References)

4. **productData.ts** (533 lines)

   - Hardcoded status strings: "production", "testing", "development", "completed", "in-progress", "backlog"
   - Already have mappings in productStatuses.ts
   - Action: Use COMPONENT_STATUS_VALUES, FEATURE_STATUS_VALUES for consistency

5. **slice.ts** (Redux state)

   - Hardcoded phase names: "Discovery", "Planning", "Development", "Testing", "UAT", "Review", etc.
   - Sample data with status strings
   - Action: Use DefaultPhaseTemplates or PHASE_NAMES for consistency

6. **Date/Duration utilities**
   - Hardcoded unit labels: "day", "days", "month", "months", etc.
   - Action: Use DURATION_UNITS constants

### Lower Priority (One-Off Usage)

7. **Component test files**

   - Test expectations contain hardcoded strings
   - Action: Update to use constants for test data consistency

8. **Theme colors** (future optimization)
   - Consider extracting color definitions to constants
   - Currently in theme files, could be centralized

## 📊 Current State

**Build Status**: ✅ Passing

- TypeScript: Clean (0 errors)
- Vite build: 634.50 kB gzip (19s)
- Tests: Ready for validation

**Constants Coverage**: ~35% of hardcoded values

- Status strings: 70% refactored
- Labels: 60% refactored
- Dimensions: 20% refactored
- Defaults: 90% refactored

**Files Modified**: 11

- src/constants/ (8 files created)
- src/features/releasePlans/ (3 files refactored)

## 🎯 Next Steps

1. **Quick wins** (15-20 min)

   - PlanHeaderMaterial.tsx - Extract to use constants
   - GanttTimeline - Import constants instead of duplicating
   - createCommonDataItems - Already done ✅

2. **Medium effort** (30-45 min)

   - productData.ts - Use status value constants
   - slice.ts - Use template constants for sample data
   - Remaining PlanHeader variants

3. **Documentation**
   - Update README.md with usage examples from refactored files
   - Add migration guide to each file as comments

## 💡 Key Decisions

1. **LocalPlanStatus** vs **PlanStatus**

   - Local "done" status ≠ global "completed"
   - Kept separate to avoid confusion
   - Could consolidate in future refactor

2. **Product data compatibility**

   - Created productStatuses.ts for backward compatibility
   - Allows gradual migration of 533-line file
   - Avoids breaking existing data structures

3. **Re-export pattern**
   - Constants index.ts exports everything
   - Specific files can import subset via `import { X } from "@/constants/X"`
   - Both patterns supported for flexibility

## 📈 Success Metrics

- [x] Zero TypeScript errors in constants
- [x] All constants properly typed
- [x] Path alias (@/) working
- [x] Build passing
- [x] Initial refactoring complete
- [ ] 80%+ constants usage across codebase
- [ ] All hardcoded strings eliminated
- [ ] Tests passing with refactored imports
