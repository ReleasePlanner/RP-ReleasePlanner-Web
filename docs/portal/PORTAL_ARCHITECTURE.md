# Portal Web - Arquitectura y Componentes

## 📋 Descripción General

El **Portal Web** es una aplicación React moderna para la gestión de planes de release, productos, features, calendarios y propietarios IT. Está construida con tecnologías modernas siguiendo principios de arquitectura limpia y diseño orientado a componentes.

---

## 🏗️ Arquitectura de Alto Nivel

### Stack Tecnológico

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **UI Framework**: Material-UI (MUI) v7
- **State Management**: Redux Toolkit
- **Server State**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Styling**:
  - Material-UI `sx` prop
  - Tailwind CSS (utility classes)
  - Emotion (CSS-in-JS)
- **Testing**: Vitest + React Testing Library
- **Monorepo**: Nx

### Estructura de Directorios

```
apps/portal/src/
├── api/                    # Configuración de API y Query Client
├── app/                    # Componentes de bienvenida Nx (temporal)
├── assets/                 # Recursos estáticos
├── builders/               # Builder patterns para configuración
├── components/             # Componentes compartidos reutilizables
├── constants/              # Constantes centralizadas
├── features/               # Módulos de features (arquitectura por dominio)
├── layouts/                # Componentes de layout
├── pages/                  # Páginas principales (rutas)
├── state/                  # Slices de Redux por dominio
├── store/                  # Configuración del store Redux
├── test/                   # Utilidades de testing
├── theme.ts                # Configuración de tema MUI
├── utils/                  # Utilidades generales
├── App.tsx                 # Componente raíz con rutas
├── RootProvider.tsx        # Provider raíz (Theme, Router)
└── main.tsx                # Punto de entrada
```

---

## 🎯 Features Principales

### 1. **Release Plans** (`features/releasePlans/`)

**Funcionalidad**: Gestión completa de planes de release con visualización tipo Gantt.

#### Componentes Principales:

- **`PlanCard`**: Componente principal que muestra un plan completo

  - Layout dividido: Panel izquierdo (tabs) + Gráfico Gantt
  - Gestión de fases, tareas, componentes, features, calendarios y referencias
  - Diálogos para edición de fases, milestones y datos de celdas

- **`GanttChart`**: Visualización tipo Gantt interactiva

  - Barras de fases arrastrables
  - Zoom y navegación temporal
  - Celdas interactivas con comentarios, archivos y enlaces
  - Marcadores de milestones
  - Soporte para múltiples calendarios

- **`PlanLeftPane`**: Panel izquierdo con tabs

  - **Common Data**: Datos generales del plan
  - **Features**: Asociación de features del producto
  - **Components**: Gestión de componentes y versiones
  - **Calendars**: Selección de calendarios
  - **References**: Referencias, documentos y notas

- **`PhasesList`**: Lista de fases del plan

  - Indicadores de color
  - Acciones: ver, editar, eliminar
  - Botón para agregar nuevas fases

- **`PhaseEditDialog`**: Diálogo de edición de fases

  - Validación de nombres únicos
  - Validación de rangos de fechas
  - Selección de color con validación de unicidad
  - Edición condicional (fases base vs. locales)

- **`AddPhaseDialog`**: Diálogo para agregar nuevas fases
  - Formulario con validaciones
  - Selección de color
  - Fechas por defecto

#### Estado Redux:

- `releasePlans`: Planes de release
- `basePhases`: Fases base del sistema

#### Tipos Principales:

```typescript
- Plan: Plan completo con metadata y tareas
- PlanMetadata: Metadatos del plan (nombre, fechas, estado, fases, etc.)
- PlanPhase: Fase del plan con fechas y color
- PlanTask: Tarea del plan
- GanttCellData: Datos de celdas (comentarios, archivos, enlaces)
- PlanReference: Referencias del plan
- PlanMilestone: Hitos del plan
```

---

### 2. **Products** (`features/product/`)

**Funcionalidad**: Mantenimiento de productos y sus componentes.

#### Componentes:

- **`ProductCard`**: Tarjeta de producto
- **`ProductEditDialog`**: Diálogo de edición/creación
- **`ProductToolbar`**: Barra de herramientas con acciones
- **`ComponentsTable`**: Tabla de componentes del producto
- **`ComponentEditDialog`**: Diálogo para editar componentes

#### Tipos:

```typescript
- Product: Producto con componentes
- ComponentVersion: Versión de componente (web, services, mobile)
```

---

### 3. **Features** (`features/feature/`)

**Funcionalidad**: Gestión de features de productos.

#### Componentes:

- **`ProductFeaturesList`**: Lista de features por producto
- **`FeaturesTable`**: Tabla de features con filtros
- **`FeatureCard`**: Tarjeta de feature
- **`FeatureEditDialog`**: Diálogo de edición
- **`FeatureToolbar`**: Barra de herramientas
- **`ProductSelector`**: Selector de producto

#### Tipos:

```typescript
- Feature: Feature individual
- ProductWithFeatures: Producto con sus features
- FeatureCategory: Categoría de feature
- FeatureStatus: Estado (planned, in-progress, completed, on-hold)
```

---

### 4. **Calendars** (`features/calendar/`)

**Funcionalidad**: Gestión de calendarios, días festivos y días especiales.

#### Componentes:

- **`CalendarDaysList`**: Lista de días del calendario
- **`CalendarDayCard`**: Tarjeta de día
- **`CalendarDayEditDialog`**: Diálogo de edición
- **`CalendarSelector`**: Selector de calendario
- **`CalendarToolbar`**: Barra de herramientas

#### Tipos:

```typescript
- Calendar: Calendario con días
- CalendarDay: Día festivo o especial
- CalendarState: Estado del módulo
```

---

### 5. **IT Owners** (`features/itOwner/`)

**Funcionalidad**: Gestión de propietarios IT.

#### Componentes:

- **`ITOwnerCard`**: Tarjeta de propietario
- **`ITOwnerEditDialog`**: Diálogo de edición

---

## 🎨 Componentes Compartidos (`components/`)

### Componentes Reutilizables:

- **`PageLayout`**: Layout base para páginas
- **`PageToolbar`**: Barra de herramientas estándar
- **`ElegantCard`**: Tarjeta con diseño elegante

---

## 📐 Layouts (`layouts/`)

### `MainLayout`

Layout principal de la aplicación con estructura responsive:

```
┌─────────────────────────────────────┐
│         HeaderMaterial              │
├──────────┬──────────────────────────┤
│          │                          │
│  Left    │      MainContent         │
│ Sidebar  │      (Outlet)            │
│          │                          │
│          │                          │
├──────────┴──────────────────────────┤
│         LayoutFooter                │
└─────────────────────────────────────┘
```

#### Componentes del Layout:

- **`HeaderMaterial`**: Header con navegación y acciones

  - Título de la aplicación
  - Botones de navegación
  - Toggle de tema (dark/light)
  - Acciones del usuario

- **`LeftSidebar`**: Sidebar izquierdo

  - Navegación principal
  - Drawer responsive (temporal en mobile, persistente en desktop)
  - Auto-cierre en mobile

- **`RightSidebar`**: Sidebar derecho

  - Contenido contextual
  - Drawer responsive

- **`MainContent`**: Contenedor principal

  - Área de contenido con scroll
  - Responsive padding

- **`LayoutFooter`**: Footer de la aplicación

---

## 📄 Páginas (`pages/`)

### Rutas Principales:

1. **`ReleasePlanner`** (`/` o `/release-planner`)

   - Vista principal con lista/grid de planes
   - Búsqueda y filtros
   - Vista expandible/colapsable
   - Lazy loading de PlanCard

2. **`PhasesMaintenancePage`** (`/phases-maintenance`)

   - Mantenimiento de fases base

3. **`ProductMaintenancePage`** (`/product-maintenance`)

   - Mantenimiento de productos

4. **`FeatureMaintenancePage`** (`/features`)

   - Mantenimiento de features

5. **`CalendarMaintenancePage`** (`/calendars`)

   - Mantenimiento de calendarios

6. **`ITOwnerMaintenancePage`** (`/it-owners`)
   - Mantenimiento de propietarios IT

---

## 🗄️ Estado Global (Redux)

### Store Structure:

```typescript
{
  ui: {
    leftSidebarOpen: boolean
    rightSidebarOpen: boolean
    darkMode: boolean
    planLeftPercentByPlanId: Record<string, number>
    planExpandedByPlanId: Record<string, boolean>
  },
  releasePlans: {
    plans: Plan[]
  },
  basePhases: {
    phases: BasePhase[]
  },
  products: {
    products: Product[]
  },
  features: {
    features: Feature[]
  },
  calendars: {
    calendars: Calendar[]
  },
  itOwners: {
    itOwners: ITOwner[]
  }
}
```

### Slices:

- **`uiSlice`**: Estado de UI (sidebars, tema, expansión de planes)
- **`releasePlansReducer`**: Planes de release
- **`basePhasesReducer`**: Fases base
- **`productsReducer`**: Productos
- **`featuresReducer`**: Features
- **`calendarsReducer`**: Calendarios
- **`itOwnersReducer`**: Propietarios IT

---

## 🎨 Sistema de Temas

### Configuración (`theme.ts`):

- **Tema Claro**: Fondo blanco, texto oscuro
- **Tema Oscuro**: Fondo oscuro (#121212), texto claro
- **Paleta Principal**: Verde Excel (#217346)
- **Paleta Secundaria**: Azul Office (#185ABD)
- **Toggle Dinámico**: Basado en estado Redux

### Uso:

```typescript
const theme = useTheme();
// Acceso a colores, espaciado, breakpoints, etc.
```

---

## 🧪 Testing

### Configuración:

- **Framework**: Vitest
- **Utilities**: React Testing Library
- **Coverage**: V8 provider

### Estructura:

- Tests unitarios junto a componentes (`*.test.tsx`)
- Tests de integración en carpetas `test/`
- Mocks en `api/mocks/`

---

## 🔧 Utilidades (`utils/`)

### Módulos Principales:

- **`logging/`**: Sistema de logging estructurado

  - Logger con niveles
  - Error boundaries
  - Decorators para logging automático
  - Monitoring

- **`dom.ts`**: Utilidades DOM
- **`number.ts`**: Utilidades numéricas

---

## 📦 Builders (`builders/`)

### Patrón Builder:

- **`componentConfigBuilder`**: Builder para configuración de componentes
- Facilita la creación de configuraciones complejas

---

## 🔌 API (`api/`)

### Configuración:

- **`queryClient.ts`**: Configuración de TanStack Query
  - Cache configuration
  - Retry logic
  - Default options

---

## 🎯 Constantes (`constants/`)

### Módulos:

- **`component.ts`**: Constantes de componentes
- **`defaults.ts`**: Valores por defecto
- **`labels.ts`**: Etiquetas de UI
- **`planStatus.ts`**: Estados de plan
- **`priority.ts`**: Prioridades
- **`productStatuses.ts`**: Estados de producto
- **`status.ts`**: Estados generales
- **`ui.ts`**: Constantes de UI

---

## 🚀 Características Destacadas

### 1. **Lazy Loading**

- `PlanCard` se carga bajo demanda cuando se expande
- Mejora el rendimiento inicial

### 2. **Responsive Design**

- Mobile-first approach
- Sidebars adaptativos (drawer en mobile, persistente en desktop)
- Grid layouts responsivos

### 3. **Validaciones Avanzadas**

- Validación de nombres únicos con debounce
- Validación de rangos de fechas
- Validación de colores únicos
- Feedback visual en tiempo real

### 4. **Edición Condicional**

- Fases base (del mantenimiento) vs. fases locales
- Restricciones de edición según tipo de fase

### 5. **Gantt Interactivo**

- Drag & drop de barras de fase
- Zoom y navegación temporal
- Celdas interactivas con datos enriquecidos
- Marcadores de milestones

### 6. **Gestión de Estado Optimizada**

- Redux Toolkit para estado global
- TanStack Query para estado del servidor
- Memoización selectiva
- Optimización de re-renders

### 7. **Accesibilidad**

- ARIA labels
- Navegación por teclado
- Focus management
- Contraste de colores

### 8. **Performance**

- Code splitting
- Lazy loading de componentes pesados
- Memoización de cálculos costosos
- Optimización de listas grandes

---

## 📝 Convenciones de Código

### Nomenclatura:

- **Componentes**: PascalCase (`PlanCard.tsx`)
- **Hooks**: camelCase con prefijo `use` (`usePlanCard.ts`)
- **Utilidades**: camelCase (`date.ts`, `dom.ts`)
- **Tipos**: PascalCase (`Plan.ts`, `PlanPhase.ts`)
- **Constantes**: UPPER_SNAKE_CASE o camelCase según contexto

### Estructura de Componentes:

```typescript
// 1. Imports
// 2. Types/Interfaces
// 3. Component
// 4. Exports
```

### Estilos:

- Preferir `sx` prop de MUI
- Tailwind para utilidades rápidas
- Emotion para estilos complejos

---

## 🔄 Flujo de Datos

```
User Action
    ↓
Component Event Handler
    ↓
Redux Action Dispatch (si es estado global)
    ↓
Reducer Update
    ↓
Component Re-render (via useSelector)
    ↓
UI Update
```

Para datos del servidor:

```
Component
    ↓
TanStack Query Hook
    ↓
API Call
    ↓
Cache Update
    ↓
Component Re-render
```

---

## 📚 Documentación Adicional

- Ver `README.md` en cada feature para detalles específicos
- Ver `docs/` en el directorio raíz para documentación completa del proyecto

---

## 🎓 Principios de Arquitectura

1. **Separación de Responsabilidades**: Cada feature es independiente
2. **Composición sobre Herencia**: Componentes pequeños y composables
3. **Single Source of Truth**: Redux para estado global
4. **Inmutabilidad**: Redux Toolkit con Immer
5. **Type Safety**: TypeScript estricto
6. **Testabilidad**: Componentes y lógica testeable
7. **Performance**: Lazy loading y memoización
8. **Accesibilidad**: Estándares WCAG
9. **Responsive**: Mobile-first design
10. **Mantenibilidad**: Código limpio y documentado

---

## 🔮 Próximas Mejoras Potenciales

- Integración con API backend (NestJS)
- Autenticación y autorización
- Persistencia de datos (localStorage/IndexedDB)
- Exportación de planes (PDF, Excel)
- Notificaciones en tiempo real
- Colaboración en tiempo real
- Historial de cambios
- Búsqueda avanzada
- Filtros complejos
- Dashboard con métricas

---

_Última actualización: 2024_
