# Análisis de Consistencia: Entidades TypeORM vs Esquemas de Base de Datos

Este documento compara las propiedades de las entidades TypeORM con los campos de las tablas de la base de datos para identificar discrepancias en estructura, nombres y tipos de datos.

## Resumen Ejecutivo

**Total de entidades analizadas:** 18  
**Discrepancias encontradas:** 0 críticas, varias mejoras sugeridas

## Análisis Detallado por Entidad

### 1. BaseEntity (Tabla base - heredada por todas)

#### ✅ Consistente
- `id`: uuid (PK) - ✅ Coincide
- `createdAt`: TIMESTAMP - ✅ Coincide  
- `updatedAt`: TIMESTAMP - ✅ Coincide

**Nota:** Todas las entidades heredan correctamente estos campos de `BaseEntity`.

---

### 2. Product (`products`)

#### ✅ Consistente
| Propiedad Entity | Columna BD | Tipo Entity | Tipo BD | Nullable | Estado |
|-----------------|------------|-------------|---------|----------|--------|
| `id` | `id` | uuid | uuid | NO | ✅ |
| `createdAt` | `createdAt` | timestamp | TIMESTAMP | NO | ✅ |
| `updatedAt` | `updatedAt` | timestamp | TIMESTAMP | NO | ✅ |
| `name` | `name` | varchar(255) | VARCHAR(255) | NO | ✅ |

**Índices:**
- ✅ `IDX_products_name` (unique) - Coincide con `@Index(["name"], { unique: true })`

**Relaciones:**
- ✅ `components` (OneToMany) - No se almacena como columna (relación)

---

### 3. ComponentVersion (`component_versions`)

#### ✅ Consistente
| Propiedad Entity | Columna BD | Tipo Entity | Tipo BD | Nullable | Estado |
|-----------------|------------|-------------|---------|----------|--------|
| `id` | `id` | uuid | uuid | NO | ✅ |
| `createdAt` | `createdAt` | timestamp | TIMESTAMP | NO | ✅ |
| `updatedAt` | `updatedAt` | TIMESTAMP | TIMESTAMP | NO | ✅ |
| `type` | `type` | enum | ENUM | NO | ✅ |
| `currentVersion` | `currentVersion` | varchar(50) | VARCHAR(50) | NO | ✅ |
| `previousVersion` | `previousVersion` | varchar(50) | VARCHAR(50) | NO | ✅ |
| `productId` | `productId` | uuid | uuid | NO | ✅ |

**Foreign Keys:**
- ✅ `FK_component_versions_product` - Coincide con `@ManyToOne` y `onDelete: 'CASCADE'`

**Enum:**
- ✅ `component_versions_type_enum` ('web', 'services', 'mobile') - Coincide con `ComponentType`

---

### 4. BasePhase (`base_phases`)

#### ✅ Consistente
| Propiedad Entity | Columna BD | Tipo Entity | Tipo BD | Nullable | Estado |
|-----------------|------------|-------------|---------|----------|--------|
| `id` | `id` | uuid | uuid | NO | ✅ |
| `createdAt` | `createdAt` | timestamp | TIMESTAMP | NO | ✅ |
| `updatedAt` | `updatedAt` | TIMESTAMP | TIMESTAMP | NO | ✅ |
| `name` | `name` | varchar(255) | VARCHAR(255) | NO | ✅ |
| `color` | `color` | varchar(7) | VARCHAR(7) | NO | ✅ |
| `category` | `category` | varchar(100) | VARCHAR(100) | YES | ✅ |

**Índices:**
- ✅ `IDX_base_phases_name` (unique) - Coincide
- ✅ `IDX_base_phases_color` (unique) - Coincide

---

### 5. FeatureCategory (`feature_categories`)

#### ✅ Consistente
| Propiedad Entity | Columna BD | Tipo Entity | Tipo BD | Nullable | Estado |
|-----------------|------------|-------------|---------|----------|--------|
| `id` | `id` | uuid | uuid | NO | ✅ |
| `createdAt` | `createdAt` | timestamp | TIMESTAMP | NO | ✅ |
| `updatedAt` | `updatedAt` | TIMESTAMP | TIMESTAMP | NO | ✅ |
| `name` | `name` | varchar(255) | VARCHAR(255) | NO | ✅ |

**Índices:**
- ✅ `IDX_feature_categories_name` (unique) - Coincide

---

### 6. ProductOwner (`product_owners`)

#### ✅ Consistente
| Propiedad Entity | Columna BD | Tipo Entity | Tipo BD | Nullable | Estado |
|-----------------|------------|-------------|---------|----------|--------|
| `id` | `id` | uuid | uuid | NO | ✅ |
| `createdAt` | `createdAt` | timestamp | TIMESTAMP | NO | ✅ |
| `updatedAt` | `updatedAt` | TIMESTAMP | TIMESTAMP | NO | ✅ |
| `name` | `name` | varchar(255) | VARCHAR(255) | NO | ✅ |

**Índices:**
- ✅ `IDX_product_owners_name` (unique) - Coincide

---

### 7. Feature (`features`)

#### ✅ Consistente
| Propiedad Entity | Columna BD | Tipo Entity | Tipo BD | Nullable | Estado |
|-----------------|------------|-------------|---------|----------|--------|
| `id` | `id` | uuid | uuid | NO | ✅ |
| `createdAt` | `createdAt` | timestamp | TIMESTAMP | NO | ✅ |
| `updatedAt` | `updatedAt` | TIMESTAMP | TIMESTAMP | NO | ✅ |
| `name` | `name` | varchar(255) | VARCHAR(255) | NO | ✅ |
| `description` | `description` | text | TEXT | NO | ✅ |
| `categoryId` | `categoryId` | uuid | uuid | NO | ✅ |
| `status` | `status` | enum | ENUM | NO (default: 'planned') | ✅ |
| `createdById` | `createdById` | uuid | uuid | NO | ✅ |
| `technicalDescription` | `technicalDescription` | text | TEXT | NO | ✅ |
| `businessDescription` | `businessDescription` | TEXT | TEXT | NO | ✅ |
| `productId` | `productId` | uuid | uuid | NO | ✅ |

**Foreign Keys:**
- ✅ `FK_features_category` - Coincide con `@ManyToOne(FeatureCategory)`
- ✅ `FK_features_createdBy` - Coincide con `@ManyToOne(ProductOwner)`

**Índices:**
- ✅ `IDX_features_productId` - Coincide con `@Index()`

**Enum:**
- ✅ `features_status_enum` ('planned', 'in-progress', 'completed', 'on-hold') - Coincide con `FeatureStatus`

---

### 8. Calendar (`calendars`)

#### ✅ Consistente
| Propiedad Entity | Columna BD | Tipo Entity | Tipo BD | Nullable | Estado |
|-----------------|------------|-------------|---------|----------|--------|
| `id` | `id` | uuid | uuid | NO | ✅ |
| `createdAt` | `createdAt` | timestamp | TIMESTAMP | NO | ✅ |
| `updatedAt` | `updatedAt` | TIMESTAMP | TIMESTAMP | NO | ✅ |
| `name` | `name` | varchar(255) | VARCHAR(255) | NO | ✅ |
| `description` | `description` | text | TEXT | YES | ✅ |

**Índices:**
- ✅ `IDX_calendars_name` (unique) - Coincide

---

### 9. CalendarDay (`calendar_days`)

#### ✅ Consistente
| Propiedad Entity | Columna BD | Tipo Entity | Tipo BD | Nullable | Estado |
|-----------------|------------|-------------|---------|----------|--------|
| `id` | `id` | uuid | uuid | NO | ✅ |
| `createdAt` | `createdAt` | timestamp | TIMESTAMP | NO | ✅ |
| `updatedAt` | `updatedAt` | TIMESTAMP | TIMESTAMP | NO | ✅ |
| `name` | `name` | varchar(255) | VARCHAR(255) | NO | ✅ |
| `date` | `date` | date | DATE | NO | ✅ |
| `type` | `type` | enum | ENUM | NO | ✅ |
| `description` | `description` | text | TEXT | YES | ✅ |
| `recurring` | `recurring` | boolean | BOOLEAN | NO (default: false) | ✅ |
| `calendarId` | `calendarId` | uuid | uuid | NO | ✅ |

**Foreign Keys:**
- ✅ `FK_calendar_days_calendar` - Coincide con `@ManyToOne` y `onDelete: 'CASCADE'`

**Índices:**
- ✅ `IDX_calendar_days_calendarId_date` - Coincide con `@Index(['calendarId', 'date'])`

**Enum:**
- ✅ `calendar_days_type_enum` ('holiday', 'special') - Coincide con `CalendarDayType`

---

### 10. ITOwner (`it_owners`)

#### ✅ Consistente
| Propiedad Entity | Columna BD | Tipo Entity | Tipo BD | Nullable | Estado |
|-----------------|------------|-------------|---------|----------|--------|
| `id` | `id` | uuid | uuid | NO | ✅ |
| `createdAt` | `createdAt` | timestamp | TIMESTAMP | NO | ✅ |
| `updatedAt` | `updatedAt` | TIMESTAMP | TIMESTAMP | NO | ✅ |
| `name` | `name` | varchar(255) | VARCHAR(255) | NO | ✅ |

**Índices:**
- ✅ `IDX_it_owners_name` (unique) - Coincide

---

### 11. Plan (`plans`)

#### ✅ Consistente
| Propiedad Entity | Columna BD | Tipo Entity | Tipo BD | Nullable | Estado |
|-----------------|------------|-------------|---------|----------|--------|
| `id` | `id` | uuid | uuid | NO | ✅ |
| `createdAt` | `createdAt` | timestamp | TIMESTAMP | NO | ✅ |
| `updatedAt` | `updatedAt` | TIMESTAMP | TIMESTAMP | NO | ✅ |
| `name` | `name` | varchar(255) | VARCHAR(255) | NO | ✅ |
| `owner` | `owner` | varchar(255) | VARCHAR(255) | NO | ✅ |
| `startDate` | `startDate` | date | DATE | NO | ✅ |
| `endDate` | `endDate` | DATE | DATE | NO | ✅ |
| `status` | `status` | enum | ENUM | NO (default: 'planned') | ✅ |
| `description` | `description` | text | TEXT | YES | ✅ |
| `productId` | `productId` | uuid | uuid | YES | ✅ |
| `itOwner` | `itOwner` | uuid | uuid | YES | ✅ |
| `featureIds` | `featureIds` | jsonb | jsonb | NO (default: '[]') | ✅ |
| `components` | `components` | jsonb | jsonb | NO (default: '[]') | ✅ |
| `calendarIds` | `calendarIds` | jsonb | jsonb | NO (default: '[]') | ✅ |

**Índices:**
- ✅ `IDX_plans_name` - Coincide con `@Index(['name'])`
- ✅ `IDX_plans_productId` - Coincide con `@Index(['productId'])`
- ✅ `IDX_plans_itOwner` - Coincide con `@Index(['itOwner'])`

**Enum:**
- ✅ `plans_status_enum` ('planned', 'in_progress', 'done', 'paused') - Coincide con `PlanStatus`

---

### 12. PlanPhase (`plan_phases`)

#### ✅ Consistente
| Propiedad Entity | Columna BD | Tipo Entity | Tipo BD | Nullable | Estado |
|-----------------|------------|-------------|---------|----------|--------|
| `id` | `id` | uuid | uuid | NO | ✅ |
| `createdAt` | `createdAt` | timestamp | TIMESTAMP | NO | ✅ |
| `updatedAt` | `updatedAt` | TIMESTAMP | TIMESTAMP | NO | ✅ |
| `name` | `name` | varchar(255) | VARCHAR(255) | NO | ✅ |
| `startDate` | `startDate` | date | DATE | YES | ✅ |
| `endDate` | `endDate` | date | DATE | YES | ✅ |
| `color` | `color` | varchar(7) | VARCHAR(7) | YES | ✅ |
| `planId` | `planId` | uuid | uuid | NO | ✅ |

**Foreign Keys:**
- ✅ `FK_plan_phases_plan` - Coincide con `@ManyToOne` y `onDelete: 'CASCADE'`

**Índices:**
- ✅ `IDX_plan_phases_planId` - Coincide con `@Index(['planId'])`

---

### 13. PlanTask (`plan_tasks`)

#### ✅ Consistente
| Propiedad Entity | Columna BD | Tipo Entity | Tipo BD | Nullable | Estado |
|-----------------|------------|-------------|---------|----------|--------|
| `id` | `id` | uuid | uuid | NO | ✅ |
| `createdAt` | `createdAt` | timestamp | TIMESTAMP | NO | ✅ |
| `updatedAt` | `updatedAt` | TIMESTAMP | TIMESTAMP | NO | ✅ |
| `title` | `title` | varchar(255) | VARCHAR(255) | NO | ✅ |
| `startDate` | `startDate` | date | DATE | NO | ✅ |
| `endDate` | `endDate` | date | DATE | NO | ✅ |
| `color` | `color` | varchar(7) | VARCHAR(7) | YES | ✅ |
| `planId` | `planId` | uuid | uuid | NO | ✅ |

**Foreign Keys:**
- ✅ `FK_plan_tasks_plan` - Coincide con `@ManyToOne` y `onDelete: 'CASCADE'`

**Índices:**
- ✅ `IDX_plan_tasks_planId` - Coincide con `@Index(['planId'])`

---

### 14. PlanMilestone (`plan_milestones`)

#### ✅ Consistente
| Propiedad Entity | Columna BD | Tipo Entity | Tipo BD | Nullable | Estado |
|-----------------|------------|-------------|---------|----------|--------|
| `id` | `id` | uuid | uuid | NO | ✅ |
| `createdAt` | `createdAt` | timestamp | TIMESTAMP | NO | ✅ |
| `updatedAt` | `updatedAt` | TIMESTAMP | TIMESTAMP | NO | ✅ |
| `date` | `date` | date | DATE | NO | ✅ |
| `name` | `name` | varchar(255) | VARCHAR(255) | NO | ✅ |
| `description` | `description` | text | TEXT | YES | ✅ |
| `planId` | `planId` | uuid | uuid | NO | ✅ |

**Foreign Keys:**
- ✅ `FK_plan_milestones_plan` - Coincide con `@ManyToOne` y `onDelete: 'CASCADE'`

**Índices:**
- ✅ `IDX_plan_milestones_planId` - Coincide con `@Index(['planId'])`

---

### 15. PlanReference (`plan_references`)

#### ✅ Consistente
| Propiedad Entity | Columna BD | Tipo Entity | Tipo BD | Nullable | Estado |
|-----------------|------------|-------------|---------|----------|--------|
| `id` | `id` | uuid | uuid | NO | ✅ |
| `createdAt` | `createdAt` | timestamp | TIMESTAMP | NO | ✅ |
| `updatedAt` | `updatedAt` | TIMESTAMP | TIMESTAMP | NO | ✅ |
| `type` | `type` | enum | ENUM | NO | ✅ |
| `title` | `title` | varchar(255) | VARCHAR(255) | NO | ✅ |
| `url` | `url` | text | TEXT | YES | ✅ |
| `description` | `description` | text | TEXT | YES | ✅ |
| `date` | `date` | date | DATE | YES | ✅ |
| `phaseId` | `phaseId` | uuid | uuid | YES | ✅ |
| `planId` | `planId` | uuid | uuid | NO | ✅ |

**Foreign Keys:**
- ✅ `FK_plan_references_plan` - Coincide con `@ManyToOne` y `onDelete: 'CASCADE'`

**Índices:**
- ✅ `IDX_plan_references_planId` - Coincide con `@Index(['planId'])`

**Enum:**
- ✅ `plan_references_type_enum` ('link', 'document', 'note', 'comment', 'file', 'milestone') - Coincide con `PlanReferenceType`

---

### 16. GanttCellData (`gantt_cell_data`)

#### ✅ Consistente
| Propiedad Entity | Columna BD | Tipo Entity | Tipo BD | Nullable | Estado |
|-----------------|------------|-------------|---------|----------|--------|
| `id` | `id` | uuid | uuid | NO | ✅ |
| `createdAt` | `createdAt` | timestamp | TIMESTAMP | NO | ✅ |
| `updatedAt` | `updatedAt` | TIMESTAMP | TIMESTAMP | NO | ✅ |
| `phaseId` | `phaseId` | uuid | uuid | YES | ✅ |
| `date` | `date` | date | DATE | NO | ✅ |
| `isMilestone` | `isMilestone` | boolean | BOOLEAN | NO (default: false) | ✅ |
| `milestoneColor` | `milestoneColor` | varchar(7) | VARCHAR(7) | YES | ✅ |
| `planId` | `planId` | uuid | uuid | NO | ✅ |

**Foreign Keys:**
- ✅ `FK_gantt_cell_data_plan` - Coincide con `@ManyToOne` y `onDelete: 'CASCADE'`

**Índices:**
- ✅ `IDX_gantt_cell_data_planId_date` - Coincide con `@Index(['planId', 'date'])`

---

### 17. GanttCellComment (`gantt_cell_comments`)

#### ✅ Consistente
| Propiedad Entity | Columna BD | Tipo Entity | Tipo BD | Nullable | Estado |
|-----------------|------------|-------------|---------|----------|--------|
| `id` | `id` | uuid | uuid | NO | ✅ |
| `createdAt` | `createdAt` | timestamp | TIMESTAMP | NO | ✅ |
| `updatedAt` | `updatedAt` | TIMESTAMP | TIMESTAMP | NO | ✅ |
| `text` | `text` | text | TEXT | NO | ✅ |
| `author` | `author` | varchar(255) | VARCHAR(255) | NO | ✅ |
| `cellDataId` | `cellDataId` | uuid | uuid | NO | ✅ |

**Foreign Keys:**
- ✅ `FK_gantt_cell_comments_cellData` - Coincide con `@ManyToOne` y `onDelete: 'CASCADE'`

---

### 18. GanttCellFile (`gantt_cell_files`)

#### ✅ Consistente
| Propiedad Entity | Columna BD | Tipo Entity | Tipo BD | Nullable | Estado |
|-----------------|------------|-------------|---------|----------|--------|
| `id` | `id` | uuid | uuid | NO | ✅ |
| `createdAt` | `createdAt` | timestamp | TIMESTAMP | NO | ✅ |
| `updatedAt` | `updatedAt` | TIMESTAMP | TIMESTAMP | NO | ✅ |
| `name` | `name` | varchar(255) | VARCHAR(255) | NO | ✅ |
| `url` | `url` | text | TEXT | NO | ✅ |
| `size` | `size` | bigint | BIGINT | YES | ✅ |
| `mimeType` | `mimeType` | varchar(100) | VARCHAR(100) | YES | ✅ |
| `cellDataId` | `cellDataId` | uuid | uuid | NO | ✅ |

**Foreign Keys:**
- ✅ `FK_gantt_cell_files_cellData` - Coincide con `@ManyToOne` y `onDelete: 'CASCADE'`

---

### 19. GanttCellLink (`gantt_cell_links`)

#### ✅ Consistente
| Propiedad Entity | Columna BD | Tipo Entity | Tipo BD | Nullable | Estado |
|-----------------|------------|-------------|---------|----------|--------|
| `id` | `id` | uuid | uuid | NO | ✅ |
| `createdAt` | `createdAt` | timestamp | TIMESTAMP | NO | ✅ |
| `updatedAt` | `updatedAt` | TIMESTAMP | TIMESTAMP | NO | ✅ |
| `title` | `title` | varchar(255) | VARCHAR(255) | NO | ✅ |
| `url` | `url` | text | TEXT | NO | ✅ |
| `description` | `description` | text | TEXT | YES | ✅ |
| `cellDataId` | `cellDataId` | uuid | uuid | NO | ✅ |

**Foreign Keys:**
- ✅ `FK_gantt_cell_links_cellData` - Coincide con `@ManyToOne` y `onDelete: 'CASCADE'`

---

### 20. User (`users`)

#### ✅ Consistente
| Propiedad Entity | Columna BD | Tipo Entity | Tipo BD | Nullable | Estado |
|-----------------|------------|-------------|---------|----------|--------|
| `id` | `id` | uuid | uuid | NO | ✅ |
| `createdAt` | `createdAt` | timestamp | TIMESTAMP | NO | ✅ |
| `updatedAt` | `updatedAt` | TIMESTAMP | TIMESTAMP | NO | ✅ |
| `username` | `username` | varchar(100) | VARCHAR(100) | NO | ✅ |
| `email` | `email` | varchar(255) | VARCHAR(255) | NO | ✅ |
| `password` | `password` | varchar(255) | VARCHAR(255) | NO | ✅ |
| `firstName` | `firstName` | varchar(100) | VARCHAR(100) | YES | ✅ |
| `lastName` | `lastName` | varchar(100) | VARCHAR(100) | YES | ✅ |
| `role` | `role` | enum | ENUM | NO (default: 'user') | ✅ |
| `isActive` | `isActive` | boolean | BOOLEAN | NO (default: true) | ✅ |
| `lastLoginAt` | `lastLoginAt` | timestamp | TIMESTAMP | YES | ✅ |
| `refreshToken` | `refreshToken` | varchar(255) | VARCHAR(255) | YES | ✅ |
| `refreshTokenExpiresAt` | `refreshTokenExpiresAt` | timestamp | TIMESTAMP | YES | ✅ |

**Índices:**
- ✅ `IDX_USERS_EMAIL` (unique) - Coincide con `@Index(['email'], { unique: true })`
- ✅ `IDX_USERS_USERNAME` (unique) - Coincide con `@Index(['username'], { unique: true })`
- ✅ `IDX_USERS_ROLE` - Existe en BD pero no está declarado en la entidad (no crítico)

**Enum:**
- ✅ Enum de roles ('admin', 'manager', 'user', 'viewer') - Coincide con `UserRole`

---

## Observaciones y Recomendaciones

### ✅ Aspectos Positivos

1. **Consistencia general excelente**: Todas las entidades están correctamente mapeadas a sus tablas correspondientes.
2. **Nombres de columnas**: Coinciden perfectamente entre entidades y base de datos (camelCase en código, camelCase en BD).
3. **Tipos de datos**: Los tipos TypeORM mapean correctamente a los tipos PostgreSQL.
4. **Foreign Keys**: Todas las relaciones están correctamente definidas con `@ManyToOne` y `@OneToMany`.
5. **Índices**: Los índices declarados en las entidades coinciden con los de la base de datos.
6. **Enums**: Todos los enums están correctamente definidos y coinciden con los tipos ENUM de PostgreSQL.

### 📝 Mejoras Sugeridas (No Críticas)

1. **Índice faltante en User:**
   - La BD tiene `IDX_USERS_ROLE` pero la entidad no lo declara explícitamente.
   - **Recomendación**: Agregar `@Index(['role'])` en `User` entity si se necesita indexar por rol.

2. **Triggers de updatedAt:**
   - La migración crea triggers para actualizar `updatedAt` automáticamente.
   - Las entidades usan `@UpdateDateColumn` que también maneja esto.
   - **Estado**: Ambos enfoques funcionan, pero hay redundancia. TypeORM manejará esto automáticamente.

3. **Tipos de fecha:**
   - Algunas entidades usan `string` para campos `date` (ej: `startDate: string`).
   - La BD usa tipo `DATE`.
   - **Estado**: Esto es correcto ya que TypeORM convierte automáticamente entre `DATE` de PostgreSQL y `string` en TypeScript para campos de fecha.

### ⚠️ Posibles Problemas Futuros

1. **Nombres de columnas con camelCase:**
   - PostgreSQL por defecto convierte nombres a lowercase, pero las migraciones usan comillas dobles para preservar camelCase.
   - **Estado**: Correcto, pero requiere atención al escribir queries SQL manuales.

2. **Campos JSONB:**
   - `Plan` tiene campos `featureIds`, `components`, `calendarIds` como `jsonb`.
   - Las entidades los tipan correctamente como arrays.
   - **Estado**: Correcto, TypeORM maneja la serialización/deserialización automáticamente.

## Conclusión

**✅ Las entidades TypeORM están perfectamente alineadas con los esquemas de base de datos.**

No se encontraron discrepancias críticas. La estructura, nombres de columnas, tipos de datos, relaciones e índices coinciden correctamente entre las entidades y las migraciones de base de datos.

El código está bien estructurado y sigue las mejores prácticas de TypeORM y PostgreSQL.

