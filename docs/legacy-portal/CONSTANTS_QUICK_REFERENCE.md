# Quick Reference: Constants Usage Guide

## 🚀 Quick Start

### Import Constants

```typescript
import {
  PlanStatus,
  PLAN_STATUS_LABELS,
  Priority,
  PRIORITY_LABELS,
  GANTT_DIMENSIONS,
  ANIMATIONS,
  DEFAULT_PLAN_VALUES,
  COMMON_DATA_LABELS,
  LocalPlanStatus,
} from "@/constants";
```

### Use Status Constants

```typescript
// Instead of hardcoded strings
if (status === "planned") {
}

// Use constants
if (status === LocalPlanStatus.PLANNED) {
  const label = LOCAL_PLAN_STATUS_LABELS[status]; // Type-safe
}
```

### Use UI Labels

```typescript
// Instead of hardcoded strings
<label>Owner</label>

// Use constants
<label>{COMMON_DATA_LABELS.OWNER}</label>
```

### Use Dimensions

```typescript
// Instead of magic numbers
const width = 24; // pixels per day???

// Use constants
const width = GANTT_DIMENSIONS.PX_PER_DAY; // Clear meaning
```

## 📁 Where to Find Things

| Need                   | File               | Import                                                      |
| ---------------------- | ------------------ | ----------------------------------------------------------- |
| Status values & labels | `status.ts`        | `{ PlanStatus, PLAN_STATUS_LABELS }`                        |
| Priority levels        | `priority.ts`      | `{ Priority, PRIORITY_LABELS }`                             |
| Component types        | `component.ts`     | `{ ComponentType, COMPONENT_TYPE_LABELS }`                  |
| UI measurements        | `ui.ts`            | `{ GANTT_DIMENSIONS, ANIMATIONS }`                          |
| Default values         | `defaults.ts`      | `{ DEFAULT_PLAN_VALUES }`                                   |
| Common labels          | `labels.ts`        | `{ COMMON_DATA_LABELS }`                                    |
| Local plan status      | `planStatus.ts`    | `{ LocalPlanStatus, LOCAL_PLAN_STATUS_LABELS }`             |
| Status UI config       | `statusConfig.tsx` | `import { getStatusConfig } from "@/...utils/statusConfig"` |

## 🔄 Common Patterns

### Pattern: Status Display

```typescript
const getStatusColor = (status: LocalPlanStatusType) => {
  return LOCAL_PLAN_STATUS_COLORS[status];
};
```

### Pattern: Status Config with Material UI

```typescript
import { getStatusConfig } from "@/features/releasePlans/utils/statusConfig";
const theme = useTheme();
const config = getStatusConfig(status, theme);
return <Chip {...config} />;
```

### Pattern: Create Default Values

```typescript
const newPlan = {
  name: DEFAULT_PLAN_VALUES.NAME,
  phases: DefaultPhaseTemplates.STANDARD,
  status: LocalPlanStatus.PLANNED,
};
```

### Pattern: Format with Labels

```typescript
const labels = features.map((f) => FEATURE_STATUS_LABELS[f.status]);
```

## ✅ Checklist: Using Constants Properly

- [ ] Import from `@/constants`
- [ ] Use constant name (e.g., `LocalPlanStatus.PLANNED` not `"planned"`)
- [ ] Use label constant for display (e.g., `PLAN_STATUS_LABELS[status]`)
- [ ] Type-check status values (use enum types)
- [ ] Avoid string literals in components
- [ ] Run `npm run build` to verify
- [ ] Check for TypeScript errors (`npm run build` shows them)

## 🆘 Troubleshooting

### "Cannot find module '@/constants'"

→ Make sure vite.config.ts and tsconfig.app.json are updated (they should be)
→ Try restarting your dev server

### "Type 'string' is not assignable to type 'LocalPlanStatusType'"

→ Good! Use the enum constant instead: `LocalPlanStatus.PLANNED` not `"planned"`

### "Property doesn't exist on object"

→ Check the constant export: `PLAN_STATUS_LABELS` not `STATUS_LABELS` for plans
→ Reference `src/constants/README.md` for exact export names

### Build fails with type errors

→ Run `npm run build` to see full error
→ Check if constant exists in the right file
→ Import and use correctly

## 📚 Full Documentation

- **Detailed patterns and examples**: `src/constants/README.md`
- **What's been completed**: `CONSTANTS_REFACTORING_PROGRESS.md`
- **Session overview and decisions**: `CONSTANTS_SESSION_SUMMARY.md`
- **Code examples**: See refactored files (phaseGenerator.ts, PlanHeader.tsx)

## 🎯 Before and After Examples

### Example 1: Phase Generator

```typescript
// BEFORE
const DEFAULT_TEMPLATES = [
  { name: "Discovery" },
  { name: "Planning" },
  // ... 4 more
];

// AFTER
import { DEFAULT_PHASE_TEMPLATE } from "@/constants";
const DEFAULT_TEMPLATES = DEFAULT_PHASE_TEMPLATE;
```

### Example 2: Status Display

```typescript
// BEFORE
const getStatusLabel = (status) => {
  switch (status) {
    case "planned":
      return "Planned";
    case "in_progress":
      return "In Progress";
    case "done":
      return "Completed";
    case "paused":
      return "Paused";
  }
};

// AFTER
import { LOCAL_PLAN_STATUS_LABELS } from "@/constants";
const label = LOCAL_PLAN_STATUS_LABELS[status];
```

### Example 3: Common Labels

```typescript
// BEFORE
<label>Owner</label>
<label>Start Date</label>
<label>End Date</label>
<label>Plan ID</label>

// AFTER
import { COMMON_DATA_LABELS } from "@/constants";
<label>{COMMON_DATA_LABELS.OWNER}</label>
<label>{COMMON_DATA_LABELS.START_DATE}</label>
<label>{COMMON_DATA_LABELS.END_DATE}</label>
<label>{COMMON_DATA_LABELS.PLAN_ID}</label>
```

## 💡 Pro Tips

1. **Always use the enum constant**, not the string value

   ```typescript
   // ✅ Good
   if (status === LocalPlanStatus.PLANNED) {
   }

   // ❌ Bad
   if (status === "planned") {
   }
   ```

2. **Use labels for display**

   ```typescript
   // ✅ Good - Will update everywhere if label changes
   <Chip label={LOCAL_PLAN_STATUS_LABELS[status]} />

   // ❌ Bad - Creates duplicate strings
   <Chip label="Planned" />
   ```

3. **Import types for type safety**

   ```typescript
   import type { LocalPlanStatusType } from "@/constants";
   function processStatus(status: LocalPlanStatusType) {}
   ```

4. **Use exhaustive checking in TypeScript**

   ```typescript
   const config = getStatusConfig(status, theme);
   // TypeScript ensures all status values handled
   ```

5. **Keep related constants together**
   - Status enums with labels in same file
   - Colors with statuses in same file
   - Makes updates easier

## 🔗 Getting Help

1. Check the pattern in an existing refactored file
2. Read `src/constants/README.md` for detailed guide
3. Look at similar usage in codebase
4. Check TypeScript error messages - they're usually helpful!
5. Ask team member who did the refactoring

---

**Remember**: Constants should always be preferred over hardcoded strings. If you're about to type a string that's used more than once, check if it should be a constant!
