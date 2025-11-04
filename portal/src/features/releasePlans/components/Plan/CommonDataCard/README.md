# CommonDataCard Component

A well-structured tabbed card component that displays common data for a release plan using Material-UI tabs.

## Architecture

This component has been split into smaller, reusable components following React best practices:

### Components Structure

```
CommonDataCard/
├── index.ts                    # Barrel exports
├── CommonDataCard.tsx          # Main component
├── CommonDataCard.test.tsx     # Main component tests
├── TabPanel.tsx                # Reusable tab panel component
├── DataItem.tsx                # Individual data item display
├── DataItem.test.tsx           # DataItem tests
├── TabLabel.tsx                # Tab label with icon and text
├── TabLabel.test.tsx           # TabLabel tests
├── DataTabs.tsx                # Tabs navigation component
├── useTabState.ts              # Custom hook for tab state management
├── useTabState.test.tsx        # Hook tests
├── types.ts                    # TypeScript types and utilities
├── types.test.tsx              # Types and utilities tests
└── README.md                   # This documentation
```

## Components

### CommonDataCard (Main Component)

The main container component that orchestrates all the child components.

**Props:**

- `owner: string` - The owner of the release plan
- `startDate: string` - The start date of the release plan
- `endDate: string` - The end date of the release plan
- `id: string` - The unique identifier of the release plan

### TabPanel

A reusable tab panel component that handles the display logic for tab content.

**Props:**

- `children?: React.ReactNode` - The content to display
- `index: number` - The tab index
- `value: number` - The current active tab index
- `id?: string` - Optional ID prefix for accessibility

### DataItem

Displays a single data item with a label and value in a centered layout.

**Props:**

- `label: string` - The label for the data item
- `value: string` - The value to display

### TabLabel

Renders the tab label with an icon and text.

**Props:**

- `icon: string` - The emoji icon to display
- `label: string` - The text label

### DataTabs

Manages the tab navigation with full-width tabs and custom styling.

**Props:**

- `data: CommonDataItem[]` - Array of data items to create tabs for
- `value: number` - Current active tab index
- `onChange: (event: React.SyntheticEvent, newValue: number) => void` - Tab change handler
- `id?: string` - Optional ID prefix for accessibility

## Hooks

### useTabState

A custom hook that manages tab state and provides a handler for tab changes.

**Parameters:**

- `initialValue?: number` - Initial tab index (default: 0)

**Returns:**

- `activeTab: number` - Current active tab index
- `handleTabChange: (event: React.SyntheticEvent, newValue: number) => void` - Tab change handler

## Types and Utilities

### Types

- `CommonDataCardProps` - Props interface for the main component
- `CommonDataItem` - Interface for individual data items
- `TabPanelProps` - Props interface for the TabPanel component

### Constants

- `COMMON_DATA_ICONS` - Predefined icons for each data type

### Utilities

- `createCommonDataItems` - Creates the data array from component props
- `createA11yProps` - Creates accessibility props for tabs

## Usage

```tsx
import { CommonDataCard } from "./CommonDataCard";

function MyComponent() {
  return (
    <CommonDataCard
      owner="Alice Smith"
      startDate="2025-01-01"
      endDate="2025-12-31"
      id="release-2025"
    />
  );
}
```

## Features

- **Accessible**: Full keyboard navigation and screen reader support
- **Responsive**: Full-width tabs that adapt to container size
- **Modular**: Each component can be used independently if needed
- **Testable**: Comprehensive test coverage for all components
- **Type-safe**: Full TypeScript support with proper type definitions

## Best Practices Implemented

1. **Single Responsibility Principle**: Each component has a single, well-defined purpose
2. **Component Composition**: Complex functionality is built by composing simpler components
3. **Custom Hooks**: Stateful logic is extracted into reusable hooks
4. **Type Safety**: Strong typing throughout the component hierarchy
5. **Accessibility**: Proper ARIA attributes and semantic HTML
6. **Testability**: Components are designed to be easily testable
7. **Separation of Concerns**: UI logic, state management, and data transformation are separated
