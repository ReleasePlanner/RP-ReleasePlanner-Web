# GanttChart - Clean Architecture Refactoring

## Overview

This directory contains the refactored GanttChart component following Clean Architecture principles. The original 660-line monolithic component has been broken down into focused, reusable components.

## Architecture

### Business Logic - Hook Layer

- **`useGanttChart.ts`**: Centralizes all business logic, calculations, and state management
  - Date range calculations (yearStart, yearEnd, totalDays)
  - Auto-scroll to today functionality
  - Drag and drop integration
  - Theme and styling constants

### Presentation - Component Layer

- **`GanttChartRefactored.tsx`**: Main orchestrator component

  - Composes specialized sub-components
  - Handles layout structure
  - Delegates business logic to hook

- **`GanttGrid.tsx`**: Background elements

  - Weekend shading
  - Phase lanes
  - Grid lines
  - Today marker

- **`GanttPhases.tsx`**: Phase visualization
  - Phase bars rendering
  - Segment calculation (excluding weekends)
  - Drag and drop interactions
  - Tooltips and interactions

## Design Patterns Applied

### Single Responsibility Principle (SRP)

- Each component has one clear responsibility
- GanttGrid: Background visualization only
- GanttPhases: Phase rendering only
- useGanttChart: Business logic only

### Composition over Inheritance

- Components are composed rather than extended
- Flexible and reusable architecture
- Easy to test individual components

### DRY (Don't Repeat Yourself)

- Shared calculations in useGanttChart hook
- Reusable components across different views
- Constants centralized in global constants file

### Clean Architecture

- Business logic separated from UI
- Dependencies point inward
- Easy to test and maintain

## Usage

```tsx
import { GanttChart } from "./GanttChart";

function MyComponent({ plan }) {
  return (
    <GanttChart
      startDate={plan.startDate}
      endDate={plan.endDate}
      tasks={plan.tasks}
      phases={plan.phases}
      onPhaseRangeChange={handlePhaseChange}
      onAddPhase={handleAddPhase}
      onEditPhase={handleEditPhase}
      hideMainCalendar={true}
    />
  );
}
```

## Migration Notes

- Original `GanttChart.tsx` (660 lines) → Modular architecture
- Business logic moved to `useGanttChart` hook
- UI components separated by concern
- Backward compatible exports maintained
- Full calendar mode to be implemented in future iteration

## Benefits

1. **Maintainability**: Smaller, focused components
2. **Testability**: Individual components can be tested in isolation
3. **Reusability**: Components can be used in different contexts
4. **Readability**: Clear separation of concerns
5. **Extensibility**: Easy to add new features without affecting existing code
