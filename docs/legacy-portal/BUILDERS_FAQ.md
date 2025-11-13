# 🤔 Builders Directory - FAQ

## General Questions

### Q: Why move builders to a separate directory?

**A:** Following architectural best practices:

- **Separation of Concerns**: Constants hold values, Builders create objects
- **Clarity**: Import path reflects intent (`@/builders` = object factories)
- **Scalability**: Easy to add more builders without cluttering constants
- **Maintainability**: Dedicated location for factory/builder pattern code

### Q: Is this a breaking change?

**A:** No! Only import paths changed. All functionality remains identical.

```typescript
// Just update import path
- import { buildComponentConfig } from "@/constants";
+ import { buildComponentConfig } from "@/builders";
```

### Q: How do I know if something should be a builder vs. a constant?

**A:** Use this decision tree:

```
Is it a VALUE or ENUM?
├─ Yes → @/constants (e.g., colors, enums, labels)
└─ No ↓

Does it CREATE objects?
├─ Yes → @/builders (factories, builders, factory functions)
└─ No ↓

Is it LOGIC or UTILITY?
└─ Yes → @/utils or feature-specific utils
```

Examples:

```typescript
// CONSTANTS
export const PRIORITY_LABELS = { HIGH: "High", LOW: "Low" };
export enum ComponentStatus { ACTIVE, INACTIVE }

// BUILDERS
export function buildComponentConfig(name: string) { ... }
export function createPhaseTemplate(type: string) { ... }

// UTILS
export function parseDate(dateString: string) { ... }
```

## Technical Questions

### Q: Can I import ComponentConfig type from @/constants?

**A:** No, import it from @/builders:

```typescript
// ✅ Correct
import { buildComponentConfig, type ComponentConfig } from "@/builders";

// ❌ Wrong
import { type ComponentConfig } from "@/constants";
```

### Q: How do I add a new builder?

**A:** 3 simple steps:

**Step 1: Create the builder file**

```typescript
// src/builders/phaseBuilder.ts
export interface PhaseConfig {
  type: string;
  duration: number;
}

export function buildPhaseConfig(type: string): PhaseConfig {
  // Implementation
}
```

**Step 2: Export from index.ts**

```typescript
// src/builders/index.ts
export { buildPhaseConfig, type PhaseConfig } from "./phaseBuilder";
```

**Step 3: Use it**

```typescript
import { buildPhaseConfig } from "@/builders";

const phase = buildPhaseConfig("standard");
```

### Q: Should builders import from @/constants?

**A:** Yes! It's good practice:

```typescript
// src/builders/componentConfigBuilder.ts
import { COMPONENT_TYPE_LABELS } from "@/constants";

const COMPONENT_TYPE_MAP = {
  web: {
    label: COMPONENT_TYPE_LABELS.web, // Reuse constants
    // ...
  },
};
```

### Q: Can I cache builder results?

**A:** Yes! It's often beneficial:

```typescript
// src/builders/componentConfigBuilder.ts
const configCache = new Map<string, ComponentConfig>();

export function buildComponentConfig(name: string): ComponentConfig {
  if (configCache.has(name)) {
    return configCache.get(name)!;
  }

  const config = {
    /* build logic */
  };
  configCache.set(name, config);
  return config;
}
```

## Migration Questions

### Q: I have a file importing from @/constants that I need to update?

**A:** Find these patterns and update them:

```bash
# Find all imports from constants
grep -r "from \"@/constants\"" src/

# Then check which are builders
grep -r "buildComponentConfig\|getAvailableComponentTypes" src/

# Update those imports to use @/builders
```

### Q: How do I handle TypeScript errors during migration?

**A:** Run type checking:

```bash
# Check for missing imports
npm run build

# Or just check types
tsc --noEmit

# Fix any "Cannot find module" errors by updating import paths
```

### Q: What if other projects import from our constants?

**A:** You have two options:

**Option 1: Keep re-export in constants** (for compatibility)

```typescript
// src/constants/index.ts
export { buildComponentConfig, type ComponentConfig } from "@/builders"; // Re-export for compatibility
```

**Option 2: Update external imports** (cleaner)

```typescript
// External code updates:
- import { buildComponentConfig } from "@/constants";
+ import { buildComponentConfig } from "@/builders";
```

## Code Quality Questions

### Q: Should I test builders?

**A:** Absolutely! Builders are excellent for testing:

```typescript
// src/builders/componentConfigBuilder.test.ts
import { buildComponentConfig } from "@/builders";

describe("buildComponentConfig", () => {
  it("builds web config for portal name", () => {
    const config = buildComponentConfig("User Portal");
    expect(config.color).toBe("primary");
  });

  it("uses default for unknown component", () => {
    const config = buildComponentConfig("Unknown");
    expect(config.color).toBe("primary");
  });
});
```

### Q: How do I handle complex builder logic?

**A:** Break it into smaller functions:

```typescript
// ✅ Good: Composed builder
function buildComponentConfig(name: string): ComponentConfig {
  const type = determineComponentType(name);
  const config = COMPONENT_TYPE_MAP[type];
  return {
    name,
    icon: renderIcon(config.iconComponent),
    color: config.color,
    description: config.description,
  };
}

// Helper function
function determineComponentType(name: string): string {
  // Logic separated
}
```

### Q: Can I use builders in components?

**A:** Yes, it's a primary use case:

```typescript
// src/features/releasePlans/components/ComponentsTab/ComponentsTab.tsx
import { buildComponentConfig } from "@/builders";

function ComponentsTab() {
  return (
    <>
      {components.map((comp) => {
        const config = buildComponentConfig(comp.name);
        return <ComponentCard key={comp.id} config={config} />;
      })}
    </>
  );
}
```

## Best Practices Questions

### Q: What's the difference between a Builder and a Factory?

**A:** In this codebase:

- **Builder**: Constructs complex objects step-by-step
- **Factory**: Simple function returning an object

```typescript
// Factory (simple)
export function buildComponentConfig(name: string): ComponentConfig {
  // Single function returning object
}

// Builder (complex)
export class ComponentConfigBuilder {
  private name: string;
  private icon?: React.ReactElement;

  setName(n: string) {
    this.name = n;
    return this;
  }
  setIcon(i: React.ReactElement) {
    this.icon = i;
    return this;
  }
  build(): ComponentConfig {
    /* ... */
  }
}
```

For this codebase, we use **factory functions** (simpler, cleaner).

### Q: Should I have one builder file or multiple?

**A:** Guidelines:

- **One file per domain concept**: `componentConfigBuilder.ts`, `phaseBuilder.ts`
- **One builder per type**: Don't mix `ComponentConfig` and `PhaseConfig` builders
- **Related builders**: Can share utility functions in same file

```typescript
// ✅ Good structure:
src/builders/
├── componentConfigBuilder.ts    (one builder)
├── phaseBuilder.ts              (one builder)
└── dialogBuilder.ts             (one builder)

// ❌ Avoid:
src/builders/
└── buildersAll.ts              (multiple unrelated builders)
```

## Performance Questions

### Q: Does building configurations impact performance?

**A:** No, but you can optimize:

```typescript
// Lazy evaluation
const config = buildComponentConfig(name); // Only when needed

// Caching for repeated calls
export const cachedBuild = memoize(buildComponentConfig);

// Batching
const configs = names.map(buildComponentConfig);
```

### Q: Should I memoize builder results?

**A:** Only if called frequently with same inputs:

```typescript
// Necessary: Called for every row in large list
export function buildComponentConfig(name: string) {
  // Consider caching
}

// Not necessary: Called once during initialization
export function buildAppConfig() {
  // No caching needed
}
```

## Troubleshooting

### Q: I get "Cannot find module '@/builders'"

**A:** Verify:

1. File exists: `src/builders/index.ts`
2. Path alias configured: check `tsconfig.json` and `vite.config.ts`
3. Build successful: `npm run build`

### Q: Import shows in editor but fails at build time

**A:** Likely path alias issue:

```typescript
// Check tsconfig.json
"paths": {
  "@/*": ["./src/*"]
}

// Check vite.config.ts
resolve: {
  alias: {
    "@": fileURLToPath(new URL("./src", import.meta.url))
  }
}
```

### Q: Old import still works - did I miss something?

**A:** Might be re-exported. Check:

```typescript
// src/constants/index.ts
export { buildComponentConfig } from "@/builders"; // ← Might have this
```

This is fine for backward compatibility during migration.

## Decisions Made

### Q: Why `@/builders` instead of `@/factories`?

**A:** Terminology in codebase:

- "builders" = more generic, includes both Factory and Builder patterns
- "factories" = too specific, implies Factory pattern only

### Q: Why not in `@/utils/builders`?

**A:** Clear distinction:

- `@/utils/` = utility functions (helpers, formatters)
- `@/builders/` = domain object creation (factories, builders)

### Q: Can I rename it later?

**A:** Yes, but risky:

- Would need to update all imports
- Better to get name right first
- Current name is stable and follows conventions

## Still Have Questions?

Check these documentation files:

- `src/builders/README.md` - Architecture and guidelines
- `BUILDERS_REFACTORING_COMPLETE.md` - Complete refactoring details
- `BUILDERS_VISUAL_SUMMARY.md` - Visual architecture overview

Or check the implementation:

- `src/builders/componentConfigBuilder.ts` - Example builder
- `src/builders/index.ts` - Export pattern
