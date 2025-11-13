# Phase Maintenance Feature

## Overview

The Phase Maintenance feature provides a comprehensive interface for managing phases across all release plans in the portal. It follows the minimalist design standards established for the application.

## Components

### PhaseCard

A minimalist card component that displays phase information:

- **Location**: `src/features/releasePlans/components/Phase/PhaseCard.tsx`
- **Features**:
  - Phase name and associated plan
  - Color preview
  - Start/End dates with color-coded labels
  - Duration chip
  - Hover-activated action buttons (Edit/Delete)
  - Outlined card variant with subtle hover effects

### PhaseEditDialog

A dialog for creating and editing phases:

- **Location**: `src/features/releasePlans/components/Phase/PhaseEditDialog.tsx`
- **Features**:
  - Full CRUD operations (Create, Read, Update)
  - Form fields: Name, Start Date, End Date, Color
  - Validation: Required name, end date >= start date
  - Color picker with preview
  - Minimalist styling with clear typography

### PhaseMaintenancePage

The main page for phase management:

- **Location**: `src/pages/phaseMaintenancePage.tsx`
- **Route**: `/phases`
- **Features**:
  - View all phases across all release plans
  - Search by phase name or plan name
  - Filter by specific plan
  - Sort by name, start date, or plan
  - Toggle between grid and list views
  - Add new phases
  - Edit existing phases
  - Delete phases with confirmation

## Design Patterns

### Minimalist Design

Following the application-wide minimalist design system:

1. **Cards**: Outlined variant with `1px solid divider` border
2. **Hover States**: Subtle border color change and minimal shadow
3. **Typography**:
   - Letter spacing: `0.01em` to `0.05em`
   - Font weights: 500-600 (no bold 700)
   - Font sizes: `0.6875rem` to `1rem`
4. **Colors**: Alpha transparency for subtle effects
5. **Spacing**: Generous padding (2-3 units)
6. **Shadows**: Minimal or none, only on hover
7. **Icons**: Small (16-18px), functional only

### Component Structure

```
PhaseMaintenancePage
├── Header with title and Add button
├── Toolbar (Search, Filter, Sort, View Mode)
└── Content Grid/List
    └── PhaseCard (for each phase)
        ├── Header (name, plan, actions)
        ├── Color preview
        └── Date range (START/END labels, duration)
```

## State Management

The feature uses Redux for state management:

- **Actions**: `addPhase`, `updatePhase`, `removePhase`
- **Selectors**: Direct access to `state.releasePlans.plans`
- **State Shape**: Phases are nested within plan metadata

## User Flows

### Add Phase

1. Click "Add Phase" button
2. Dialog opens with default values
3. Enter phase name (required)
4. Set start/end dates (with validation)
5. Choose color
6. Click "Create" to save

### Edit Phase

1. Hover over phase card
2. Click Edit icon
3. Modify fields in dialog
4. Click "Save" to update

### Delete Phase

1. Hover over phase card
2. Click Delete icon
3. Confirm deletion in browser prompt

### Filter/Search

1. Use search box for text search
2. Select plan from dropdown to filter
3. Change sort option (name/date/plan)
4. Toggle grid/list view

## Integration

### Routing

- Route added to `App.tsx`: `/phases`
- Navigation link added to `LeftSidebar.tsx`

### Dependencies

- Material UI components
- Redux Toolkit for state
- React Router for navigation

## Responsive Design

- **Mobile (xs)**: Single column grid
- **Tablet (sm)**: Auto-fill columns (min 300px)
- **Desktop (lg)**: 3 columns in grid mode
- **List Mode**: Always single column

## Accessibility

- Semantic HTML structure
- ARIA labels on buttons
- Keyboard navigation support
- Focus management in dialogs
- Color contrast compliance

## Future Enhancements

Potential improvements:

- Bulk operations (multi-select)
- Phase templates
- Duplicate phase
- Export phases to CSV
- Phase timeline visualization
- Drag-and-drop reordering
- Phase dependencies

## Testing

To test the feature:

1. Navigate to `/phases` in the application
2. Verify all phases from all plans are displayed
3. Test search functionality
4. Test filtering by plan
5. Test sorting options
6. Create a new phase
7. Edit an existing phase
8. Delete a phase
9. Toggle view modes

## Notes

- Phases are always associated with a release plan
- Phase colors default to `#185ABD` (blue)
- Date validation ensures end >= start
- Empty state shown when no phases exist
- Delete requires confirmation to prevent accidents
