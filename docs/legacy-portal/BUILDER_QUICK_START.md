# 🚀 Component Config Builder - Quick Reference

## Import

```typescript
import { buildComponentConfig, type ComponentConfig } from "@/constants";
```

## Usage

### Basic Usage

```typescript
const config = buildComponentConfig("User Portal");
```

### In Components

```typescript
function MyComponent() {
  const configs = components.map((comp) => buildComponentConfig(comp.name));

  return configs.map((config) => (
    <ComponentCard key={config.name} config={config} />
  ));
}
```

## Available Builder Functions

### `buildComponentConfig(componentName: string): ComponentConfig`

Constructs a ComponentConfig object from a component name.

**Parameters:**

- `componentName` (string) - Name of the component

**Returns:**

```typescript
{
  name: string;
  icon: React.ReactElement;
  color: "primary" | "secondary" | "success" | "info" | "warning";
  description: string;
}
```

**Examples:**

```typescript
buildComponentConfig("User Portal");
buildComponentConfig("Mobile App");
buildComponentConfig("API Service");
buildComponentConfig("Analytics Dashboard");
```

---

### `getAvailableComponentTypes(): Record<string, ComponentTypeConfig>`

Get all available component types for documentation or validation.

**Returns:**

```typescript
{
  web: { keywords: [...], color: "...", description: "..." },
  mobile: { ... },
  service: { ... },
  dashboard: { ... },
  gateway: { ... }
}
```

**Usage:**

```typescript
const types = getAvailableComponentTypes();

// Generate list
Object.entries(types).forEach(([type, config]) => {
  console.log(`${type}: ${config.description}`);
});
```

---

## Pattern Matching

The builder uses keyword matching to determine component type:

| Type          | Keywords      | Icon         | Color     | Description              |
| ------------- | ------------- | ------------ | --------- | ------------------------ |
| **web**       | web, portal   | WebIcon      | primary   | Frontend web application |
| **mobile**    | mobile, app   | MobileIcon   | secondary | Mobile application       |
| **service**   | service, api  | ServiceIcon  | success   | Backend service or API   |
| **dashboard** | dashboard     | PortalIcon   | info      | Dashboard interface      |
| **gateway**   | gateway       | ApiIcon      | warning   | API Gateway service      |
| **default**   | _(any other)_ | DatabaseIcon | primary   | System component         |

---

## Real-World Examples

### Example 1: Component Grid

```typescript
import { buildComponentConfig } from "@/constants";

function ComponentGrid({ components }: { components: string[] }) {
  return (
    <Grid container spacing={2}>
      {components.map((name) => {
        const config = buildComponentConfig(name);
        return (
          <Grid item xs={12} sm={6} md={4} key={name}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  {config.icon}
                  <Typography variant="h6">{config.name}</Typography>
                </Box>
                <Typography variant="body2">{config.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
```

### Example 2: Validation Dropdown

```typescript
function ComponentTypeSelector() {
  const types = getAvailableComponentTypes();

  return (
    <Select>
      {Object.entries(types).map(([type, config]) => (
        <MenuItem key={type} value={type}>
          {config.description}
        </MenuItem>
      ))}
    </Select>
  );
}
```

### Example 3: Component Status Badge

```typescript
function ComponentBadge({ componentName }: { componentName: string }) {
  const config = buildComponentConfig(componentName);

  return (
    <Chip
      icon={config.icon}
      label={config.name}
      color={config.color}
      title={config.description}
    />
  );
}
```

---

## Type Hints

The builder provides TypeScript type hints:

```typescript
import { type ComponentConfig } from "@/constants";

// Type-safe function
function handleComponent(config: ComponentConfig) {
  const { name, icon, color, description } = config;

  // All properties are type-checked
  console.log(`${name} is ${description}`);
}
```

---

## Extending the Builder

To add a new component type:

1. Open `src/constants/componentConfig.ts`
2. Add entry to `COMPONENT_TYPE_MAP`:

```typescript
const COMPONENT_TYPE_MAP = {
  // ... existing ...
  storage: {
    keywords: ["storage", "bucket", "s3"],
    iconComponent: StorageIcon,
    color: "warning",
    description: "Cloud storage or file service",
  },
};
```

3. Use immediately:

```typescript
buildComponentConfig("S3 Bucket"); // Matches "storage" type
```

---

## Performance Notes

- ✅ O(n) lookup where n = number of component types (currently ~5)
- ✅ Keywords matching is case-insensitive
- ✅ Icons are rendered lazily (on demand)
- 💡 Consider caching if called hundreds of times

---

## Common Patterns

### Filter by type

```typescript
function filterByType(components: string[], type: string) {
  return components.filter((name) => {
    const config = buildComponentConfig(name);
    return config.description.includes(type);
  });
}
```

### Group by color

```typescript
function groupByColor(components: string[]) {
  const groups: Record<string, string[]> = {};
  components.forEach((name) => {
    const config = buildComponentConfig(name);
    groups[config.color] ??= [];
    groups[config.color].push(config.name);
  });
  return groups;
}
```

### Create icon map

```typescript
function createIconMap(components: string[]) {
  return Object.fromEntries(
    components.map((name) => {
      const config = buildComponentConfig(name);
      return [name, config.icon];
    })
  );
}
```

---

## Testing

```typescript
import { describe, it, expect } from "vitest";
import { buildComponentConfig } from "@/constants";

describe("buildComponentConfig", () => {
  it("should build web config for portal components", () => {
    const config = buildComponentConfig("User Portal");
    expect(config.color).toBe("primary");
    expect(config.description).toContain("web");
  });

  it("should build mobile config for app components", () => {
    const config = buildComponentConfig("Mobile App");
    expect(config.color).toBe("secondary");
  });

  it("should build default config for unknown types", () => {
    const config = buildComponentConfig("Unknown Component");
    expect(config.color).toBe("primary");
    expect(config.description).toBe("System component");
  });

  it("should be case-insensitive", () => {
    const config1 = buildComponentConfig("USER PORTAL");
    const config2 = buildComponentConfig("user portal");
    expect(config1.color).toBe(config2.color);
  });
});
```

---

## Links

- 📚 [Full Documentation](./COMPONENT_CONFIG_BUILDER.md)
- 📋 [Constants Guide](./src/constants/README.md)
- 🔗 [Source Code](./src/constants/componentConfig.ts)
