# Builders Directory

## Overview

This directory contains **builder/factory functions** that encapsulate object creation logic.

Builders provide a clean, maintainable way to construct complex domain objects with:

- **Centralized Logic**: All creation logic in one place
- **Consistency**: Guaranteed object structure and properties
- **Type Safety**: TypeScript interfaces validate at compile time
- **Reusability**: Can be used across components and utilities
- **Testability**: Easy to unit test builder logic

## Available Builders

### `componentConfigBuilder.ts`

Factory functions for creating component configuration objects.

**Exports:**

- `buildComponentConfig(componentName: string): ComponentConfig`
- `getAvailableComponentTypes(): Record<string, ...>`
- `ComponentConfig` interface

**Usage:**

```typescript
import { buildComponentConfig, type ComponentConfig } from "@/builders";

const config = buildComponentConfig("User Portal");
// Returns: {
//   name: "User Portal",
//   icon: <WebIcon />,
//   color: "primary",
//   description: "Frontend web application or portal"
// }
```

## Architecture Pattern

```
Builder Function
    ↓
Type Map (Keywords → Config)
    ↓
Pattern Matching (Name → Type)
    ↓
Configured Object
```

## Adding New Builders

1. Create a new file: `src/builders/newBuilderName.ts`
2. Export builder functions and types
3. Add exports to `src/builders/index.ts`
4. Update component imports to use `@/builders`

Example:

```typescript
// src/builders/phaseConfigBuilder.ts
export interface PhaseConfig {
  type: string;
  duration: number;
}

export function buildPhaseConfig(phaseType: string): PhaseConfig {
  // Implementation
}
```

Then in `index.ts`:

```typescript
export { buildPhaseConfig, type PhaseConfig } from "./phaseConfigBuilder";
```

## Best Practices

✅ **DO:**

- Keep builder logic focused and single-responsibility
- Use type-safe patterns and interfaces
- Document builder behavior with JSDoc comments
- Add example usage in comments
- Test builder functions thoroughly

❌ **DON'T:**

- Mix builder logic with component logic
- Create builders for simple value objects
- Use builders when a factory function would suffice
- Store complex state in builders (keep them stateless)

## Integration with Constants

Builders can use constants for configuration:

```typescript
import { COMPONENT_TYPE_LABELS } from "@/constants";

// Builders use constants to avoid duplication
```

## Testing

Builders are easy to test in isolation:

```typescript
import { buildComponentConfig } from "@/builders";

describe("buildComponentConfig", () => {
  it("builds web component config for portal name", () => {
    const config = buildComponentConfig("User Portal");
    expect(config.color).toBe("primary");
    expect(config.description).toContain("Frontend");
  });
});
```
