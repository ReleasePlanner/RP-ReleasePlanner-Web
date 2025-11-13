# Migración a PostgreSQL con TypeORM

Este documento describe la migración de la API de NestJS desde almacenamiento en memoria (mocks) a PostgreSQL usando TypeORM.

## ✅ Cambios Implementados

### 1. Dependencias Instaladas

- `@nestjs/typeorm`: Integración de TypeORM con NestJS
- `typeorm`: ORM para TypeScript/JavaScript
- `pg`: Driver de PostgreSQL para Node.js
- `@nestjs/config`: Gestión de configuración
- `@nestjs/terminus`: Health checks y monitoreo

### 2. Configuración de Base de Datos

**Archivo**: `apps/api/src/config/database.config.ts`

- Configuración de TypeORM con PostgreSQL
- Variables de entorno para conexión
- Configuración de pool de conexiones
- Auto-sync solo en desarrollo (synchronize: false en producción)

### 3. Entidades TypeORM Convertidas

#### Entidades Base
- ✅ `BaseEntity` → `apps/api/src/common/database/base.entity.ts`
  - Usa decoradores de TypeORM
  - UUID como ID primario
  - Timestamps automáticos

#### Módulos Convertidos
- ✅ **Base Phases**: `BasePhase` entity con índices únicos
- ✅ **Products**: `Product` y `ComponentVersion` con relaciones
- ✅ **Features**: `Feature`, `FeatureCategory`, `ProductOwner` con relaciones
- ✅ **Calendars**: `Calendar` y `CalendarDay` con relaciones
- ✅ **IT Owners**: `ITOwner` entity

#### Pendientes de Conversión
- ⚠️ **Release Plans**: Entidades complejas pendientes (`Plan`, `PlanPhase`, `PlanTask`, `PlanMilestone`, `PlanReference`, `GanttCellData`)

### 4. Repositorios Actualizados

**Base Repository**: `apps/api/src/common/database/base.repository.ts`
- Implementación usando TypeORM Repository
- Métodos CRUD completos
- Métodos adicionales: `save()`, `findOne()`

**Repositorios Actualizados**:
- ✅ `BasePhaseRepository`
- ✅ `ProductRepository`
- ⚠️ Pendientes: `FeatureRepository`, `CalendarRepository`, `ITOwnerRepository`, `PlanRepository`

### 5. Módulos Actualizados

- ✅ `AppModule`: Configuración de TypeORM y ConfigModule
- ✅ `BasePhaseModule`: TypeOrmModule.forFeature([BasePhase])
- ✅ `ProductModule`: TypeOrmModule.forFeature([Product, ComponentVersion])
- ✅ `FeatureModule`: TypeOrmModule.forFeature([Feature, FeatureCategory, ProductOwner])
- ✅ `CalendarModule`: TypeOrmModule.forFeature([Calendar, CalendarDay])
- ✅ `ITOwnerModule`: TypeOrmModule.forFeature([ITOwner])

### 6. Logging y Monitoreo

**Logging Interceptor**: `apps/api/src/common/interceptors/logging.interceptor.ts`
- Logs estructurados de todas las peticiones HTTP
- Incluye método, URL, status code y duración

**Logger Service**: `apps/api/src/common/logging/logger.service.ts`
- Servicio de logging estructurado
- Métodos para logging de base de datos y errores

**Health Checks**: `apps/api/src/app/health.controller.ts`
- `/api/health`: Health check completo (DB, memoria, disco)
- `/api/health/liveness`: Liveness probe
- `/api/health/readiness`: Readiness probe (verifica DB)

### 7. Resiliencia

**Retry Decorator**: `apps/api/src/common/decorators/retry.decorator.ts`
- Decorador para reintentos automáticos
- Configurable: maxAttempts, delay, backoff

## 📋 Tareas Pendientes

### 1. Convertir Entidades de Release Plans

Las entidades de Release Plans son complejas y necesitan conversión:

- `Plan` entity con relaciones a múltiples entidades
- `PlanPhase`, `PlanTask`, `PlanMilestone`, `PlanReference`
- `GanttCellData` entity

### 2. Actualizar Repositorios Restantes

- `FeatureRepository`: Actualizar para usar TypeORM
- `CalendarRepository`: Actualizar para usar TypeORM
- `ITOwnerRepository`: Actualizar para usar TypeORM
- `PlanRepository`: Crear/actualizar para usar TypeORM

### 3. Migraciones de Base de Datos

Crear migraciones iniciales para:
- Todas las tablas
- Índices únicos
- Relaciones y foreign keys
- Datos iniciales (seeds) si es necesario

### 4. Actualizar Servicios

Algunos servicios pueden necesitar ajustes para:
- Manejar relaciones de TypeORM
- Usar transacciones cuando sea necesario
- Manejar errores de base de datos específicos

### 5. Testing

- Actualizar tests unitarios para usar mocks de TypeORM
- Crear tests de integración con base de datos de prueba
- Tests de migraciones

## 🚀 Cómo Usar

### Variables de Entorno

Configurar en `.env` o variables de entorno:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=releaseplanner
DATABASE_PASSWORD=releaseplanner123
DATABASE_NAME=releaseplanner
NODE_ENV=development
```

### Desarrollo

1. Asegúrate de que PostgreSQL esté corriendo
2. La base de datos se creará automáticamente si no existe
3. En desarrollo, `synchronize: true` crea/actualiza las tablas automáticamente

### Producción

1. **IMPORTANTE**: Configurar `NODE_ENV=production` para deshabilitar `synchronize`
2. Usar migraciones de TypeORM para cambios de esquema
3. Configurar pool de conexiones según carga esperada

### Health Checks

```bash
# Health check completo
curl http://localhost:3000/api/health

# Liveness probe
curl http://localhost:3000/api/health/liveness

# Readiness probe
curl http://localhost:3000/api/health/readiness
```

## 📝 Notas Importantes

1. **Synchronize**: Solo habilitado en desarrollo. En producción, usar migraciones.

2. **UUIDs**: Todas las entidades usan UUID como ID primario.

3. **Relaciones**: Las relaciones están configuradas con `eager: false` por defecto para evitar N+1 queries. Cargar relaciones explícitamente cuando sea necesario.

4. **Validaciones**: Las validaciones de negocio se mantienen en las entidades.

5. **Logging**: Los logs están estructurados en JSON para facilitar el procesamiento.

## 🔧 Próximos Pasos

1. Completar conversión de entidades de Release Plans
2. Crear migraciones iniciales
3. Actualizar todos los repositorios
4. Agregar tests de integración
5. Documentar uso de transacciones
6. Configurar backup y recovery

