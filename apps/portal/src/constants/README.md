# Constants Organization

This directory contains centralized, type-safe constants for the Release Planner application. All hardcoded values, enums, and configuration values are defined here to promote maintainability, consistency, and single-source-of-truth principles.

## Structure

### `index.ts`

Central export hub. Import all constants from this file:

```typescript
import {
  PlanStatus,
  PHASE_STATUS_LABELS,
  Priority,
  BREAKPOINTS,
  GANTT_DIMENSIONS,
  DEFAULT_PHASE_TEMPLATE,
} from "@/constants";
```

### `status.ts`

**Entity Status Definitions**

Enums and labels for all entity types:

- **PlanStatus**: `planned`, `in-progress`, `completed`, `blocked`, `on-hold`
- **PhaseStatus**: `backlog`, `planned`, `in-progress`, `testing`, `completed`, `blocked`, `cancelled`
- **FeatureStatus**: `backlog`, `planned`, `in-progress`, `testing`, `completed`, `blocked`
- **ComponentStatus**: `development`, `testing`, `production`, `deprecated`

Each status type has:

1. An enum (e.g., `PlanStatus`)
2. A typed label map (e.g., `PLAN_STATUS_LABELS`)
3. A TypeScript type (e.g., `PlanStatusType`)

**Usage:**

```typescript
import { PlanStatus, PLAN_STATUS_LABELS } from "@/constants";

const status = PlanStatus.COMPLETED;
const label = PLAN_STATUS_LABELS[status]; // "Completed"
```

### `priority.ts`

**Priority Levels**

- Enum: `Priority` (low, medium, high, critical)
- Labels: `PRIORITY_LABELS`
- Ordering: `PRIORITY_ORDER` (for sorting)
- Utility: `sortByPriority(items, priorityField)`

**Usage:**

```typescript
import { Priority, sortByPriority } from "@/constants";

const features = [...];
const sorted = sortByPriority(features, "priority");
```

### `component.ts`

**Component Types and Categories**

- **ComponentType**: web, mobile, service, library, database, infrastructure
- **ComponentCategory**: ui, backend, integration, security, infrastructure, devops, data, testing

Each has corresponding label mappings for UI display.

**Usage:**

```typescript
import { ComponentType, COMPONENT_TYPE_LABELS } from "@/constants";

const type = ComponentType.WEB;
const label = COMPONENT_TYPE_LABELS[type]; // "Web Application"
```

### `ui.ts`

**UI/UX Constants**

- **GANTT_DIMENSIONS**: Pixel measurements for Gantt chart rendering

  - `PX_PER_DAY`: 24px
  - `TRACK_HEIGHT`: 28px
  - `TIMELINE_HEIGHT`: 76px
  - `LABEL_WIDTH`: 200px

- **TIMELINE_DIMENSIONS**: Row heights for timeline views

  - Months, weeks, days rows
  - Computed total height getter

- **Z_INDEX**: Layering hierarchy

  - Base (0) → Overlay (10) → Tooltip (20) → Modal (30) → Dropdown (40) → Notification (50)

- **ANIMATIONS**: Duration presets (ms)

  - INSTANT (0), FAST (150), NORMAL (250), SLOW (350), VERY_SLOW (500)

- **BREAKPOINTS**: Responsive design breakpoints (px)

  - XS (0), SM (640), MD (768), LG (1024), XL (1280), XXL (1536)

- **SPACING**: Spacing scale (4px increments)

  - XS (4px) through XXL (48px)

- **UI_LABELS**: Common UI text labels

  - Form labels: "Owner", "Duration", "Start Date", "End Date", etc.

- **EMPTY_MESSAGES**: Empty state messages
  - Generic and context-specific messages

**Usage:**

```typescript
import { GANTT_DIMENSIONS, ANIMATIONS, BREAKPOINTS } from "@/constants";

const dayWidth = GANTT_DIMENSIONS.PX_PER_DAY;
const transitionDuration = ANIMATIONS.NORMAL;
const isDesktop = window.innerWidth >= BREAKPOINTS.LG;
```

### `defaults.ts`

**Default Values and Templates**

- **DefaultPhaseTemplates**: Pre-configured phase sets

  - STANDARD, AGILE, WATERFALL, SIMPLE
  - Each is an array of phase template objects

- **DEFAULT_PLAN_VALUES**: Default plan properties

  - Name, owner, description, status, date range

- **DEFAULT_COMPONENT_VALUES**: Default component properties

  - Type, status, version

- **DEFAULT_FEATURE_VALUES**: Default feature properties
  - Priority, status, estimated hours, category

**Usage:**

```typescript
import { DefaultPhaseTemplates, DEFAULT_PLAN_VALUES } from "@/constants";

const newPlan = {
  name: DEFAULT_PLAN_VALUES.NAME,
  phases: DefaultPhaseTemplates.AGILE,
};
```

## Type Safety

All constants use TypeScript `as const` for compile-time type inference. This provides:

1. **Exhaustive type checks**: TypeScript ensures you handle all cases
2. **Autocomplete**: IDEs provide full autocomplete for enum values
3. **No runtime overhead**: Constants compile to plain objects
4. **Literal types**: Values are narrowly typed, not just strings

**Example:**

```typescript
import { PlanStatus, type PlanStatusType } from "@/constants";

// TypeScript knows statusValue is "planned" | "in-progress" | "completed" | "blocked" | "on-hold"
function updateStatus(value: PlanStatusType) {
  // Exhaustive switch
  switch (value) {
    case PlanStatus.PLANNED:
    case PlanStatus.IN_PROGRESS:
    case PlanStatus.COMPLETED:
    case PlanStatus.BLOCKED:
    case PlanStatus.ON_HOLD:
    // TypeScript is satisfied
  }
}
```

## Migration Guide

When refactoring hardcoded values to use constants:

1. **Identify** hardcoded strings/numbers in your component
2. **Find** the appropriate constant file
3. **Import** the constant and type
4. **Replace** inline values

**Before:**

```typescript
const status = "in-progress";
const label = "In Progress";
const width = 24;
```

**After:**

```typescript
import {
  PhaseStatus,
  PHASE_STATUS_LABELS,
  GANTT_DIMENSIONS,
} from "@/constants";

const status = PhaseStatus.IN_PROGRESS;
const label = PHASE_STATUS_LABELS[status];
const width = GANTT_DIMENSIONS.PX_PER_DAY;
```

## Adding New Constants

1. Choose the appropriate file based on domain:

   - Status values → `status.ts`
   - Priority/ordering → `priority.ts`
   - Component metadata → `component.ts`
   - UI measurements/styling → `ui.ts`
   - Default values/templates → `defaults.ts`
   - New category? → Create new file

2. Use `as const` for type safety:

   ```typescript
   export const MyConstants = {
     VALUE1: "value1",
     VALUE2: "value2",
   } as const;
   ```

3. Create corresponding type export:

   ```typescript
   export type MyConstantsType = (typeof MyConstants)[keyof typeof MyConstants];
   ```

4. Create label map if UI display is needed:

   ```typescript
   export const MY_LABELS: Record<MyConstantsType, string> = {
     [MyConstants.VALUE1]: "Display Text",
   };
   ```

5. Export from `index.ts`

## Best Practices

- ✅ Use constants instead of magic strings/numbers
- ✅ Group related constants together
- ✅ Use `as const` for type safety
- ✅ Create label maps for user-facing text
- ✅ Document non-obvious values
- ✅ Use descriptive constant names (UPPERCASE_WITH_UNDERSCORES)
- ❌ Don't hardcode values directly in components
- ❌ Don't create constants in multiple places
- ❌ Don't mix concerns (e.g., API endpoints with UI labels)

## Examples

### Displaying Status Badges

```typescript
import { PHASE_STATUS_LABELS } from "@/constants";

function StatusBadge({ status }) {
  return <span>{PHASE_STATUS_LABELS[status]}</span>;
}
```

### Responsive Gantt Layout

```typescript
import { BREAKPOINTS, GANTT_DIMENSIONS } from "@/constants";

function GanttChart() {
  const isSmallScreen = window.innerWidth < BREAKPOINTS.MD;
  const trackHeight = isSmallScreen ? 20 : GANTT_DIMENSIONS.TRACK_HEIGHT;
  // ...
}
```

### Phase Template Selection

```typescript
import { DefaultPhaseTemplates } from "@/constants";

function PhaseTemplateSelector() {
  return (
    <select>
      <option value={DefaultPhaseTemplates.STANDARD}>Standard Process</option>
      <option value={DefaultPhaseTemplates.AGILE}>Agile Sprint</option>
      <option value={DefaultPhaseTemplates.WATERFALL}>Waterfall</option>
    </select>
  );
}
```

### Animated Transitions

```typescript
import { ANIMATIONS } from "@/constants";

const style = {
  transition: `all ${ANIMATIONS.NORMAL}ms ease-in-out`,
};
```
