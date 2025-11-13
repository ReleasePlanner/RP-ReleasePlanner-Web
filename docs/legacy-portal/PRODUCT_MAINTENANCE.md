# Product Maintenance Feature

## Overview

The Product Maintenance feature provides a comprehensive interface for managing products and their component versions. It allows users to track which versions of different component types (Web, Services, Mobile) are currently deployed and which were the previous versions.

## Features

### Product Management

- **Add Products**: Create new products with unique IDs and names
- **View Products**: Grid-based display of all products with their components
- **Edit Products**: Modify product information (in progress)
- **Delete Products**: Remove products from the system (in progress)

### Component Version Tracking

- **Component Types**: Categorize components as:

  - **Web**: Web-based applications and frontends
  - **Services**: Backend services and APIs
  - **Mobile**: Mobile applications (iOS, Android)

- **Version Management**: Track both:

  - Current Version: The actively deployed version
  - Previous Version: The version that was deployed before the current one

- **Edit Components**: Update version information for existing components
- **Delete Components**: Remove components from products
- **Add Components**: Add new components to existing products

## File Structure

```
src/features/productMaintenance/
├── index.ts                      # Barrel export for feature
├── types.ts                      # TypeScript interfaces and types
├── constants.ts                  # Configuration and constants
└── ProductMaintenancePage.tsx    # Main page component
```

## Data Structures

### ComponentType

```typescript
export const ComponentType = {
  WEB: "web",
  SERVICES: "services",
  MOBILE: "mobile",
} as const;

export type ComponentTypeValue = "web" | "services" | "mobile";
```

### ComponentVersion

```typescript
export interface ComponentVersion {
  id: string;
  type: ComponentTypeValue;
  currentVersion: string; // e.g., "1.2.0"
  previousVersion: string; // e.g., "1.1.9"
}
```

### Product

```typescript
export interface Product {
  id: string;
  name: string;
  components: ComponentVersion[];
}
```

## Component Architecture

### ProductMaintenancePage

The main component that orchestrates the entire product maintenance interface.

**State Management:**

- `products`: Array of all products
- `editingProduct`: Current product/component being edited
- `openDialog`: Controls dialog visibility
- `selectedProduct`: Currently selected product for component operations

**Key Functions:**

- `handleAddProduct()`: Creates a new product
- `handleEditComponent()`: Opens dialog to edit a component
- `handleDeleteComponent()`: Removes a component from a product
- `handleSave()`: Persists changes to state
- `handleCloseDialog()`: Closes the edit dialog

**UI Layout:**

- Header with title and description
- "Add Product" button
- Grid of product cards (1 column on mobile, 2 on medium+ screens)
- Each product card contains:
  - Product name and ID
  - Table of components with columns:
    - Component type
    - Current version (highlighted in green)
    - Previous version
    - Actions (Edit, Delete)
  - "Add Component" button
- Edit dialog for component version management

## Usage

### Accessing the Page

The Product Maintenance page is available at:

- Route: `/product-maintenance`
- Navigation: Add to left sidebar or header menu

### Basic Operations

#### Add a New Product

1. Click "Add Product" button in the header
2. Fill in product information in the dialog
3. Click "Save"

#### Add a Component to a Product

1. Open any product card
2. Click "Add Component" button in the card
3. Select component type (Web, Services, Mobile)
4. Enter current and previous version numbers
5. Click "Save"

#### Edit a Component

1. Open the product card containing the component
2. Click the Edit icon (pencil) next to the component
3. Update the version information
4. Click "Save"

#### Delete a Component

1. Open the product card containing the component
2. Click the Delete icon (trash) next to the component
3. The component is immediately removed

## Mock Data

The page includes mock data with 2 sample products:

### Release Planner

- Web Component: 2.1.0 → 2.0.5
- Services Component: 1.5.0 → 1.4.8

### Analytics Platform

- Web Component: 3.0.0 → 2.9.5
- Mobile Component: 1.2.0 → 1.1.9
- Services Component: 2.0.0 → 1.9.2

## Styling

The feature uses Material-UI (MUI) components with Tailwind CSS:

- Responsive grid layout (1 col mobile, 2 cols tablet+)
- Consistent spacing and colors
- Theme-aware colors for version highlighting
- Accessible icon buttons for actions

## TypeScript Compliance

All files follow strict TypeScript mode:

- No `any` types (except where necessary with explicit casting)
- Proper type inference and generic usage
- Type-only imports where applicable
- Full type coverage for React props and state

## Future Enhancements

- [ ] Backend API integration for persistence
- [ ] Bulk version updates across multiple components
- [ ] Version history timeline view
- [ ] Component dependency tracking
- [ ] Deployment scheduling and automation
- [ ] Integration with CI/CD pipelines
- [ ] Audit trail for version changes
- [ ] Export/import product configurations
- [ ] Search and filtering capabilities
- [ ] Component template management

## Related Files

- `src/App.tsx` - Route configuration
- `src/types.ts` - Global type definitions
- `src/constants/` - Application constants
