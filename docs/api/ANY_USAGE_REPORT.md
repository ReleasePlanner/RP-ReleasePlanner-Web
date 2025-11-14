# Reporte de Uso de `any` en la API

Este documento lista todos los usos de `any` encontrados en la aplicación API, organizados por categoría.

**Total encontrado: 196 ocurrencias**

## 1. Entidades Domain (TypeORM Decorators)

### `apps/api/src/products/domain/product.entity.ts`
- Línea 13: `(component: any) => component.product` - Decorador `@OneToMany`
- Línea 17: `components: any[]` - Tipo de propiedad
- Línea 19: `constructor(name?: string, components?: any[])` - Parámetro del constructor
- Línea 51: `addComponent(component: any): void` - Parámetro del método
- Línea 67: `updateComponent(componentId: string, updates: Partial<any>): void` - Tipo genérico

### `apps/api/src/products/domain/component-version.entity.ts`
- Línea 27: `(product: any) => product.components` - Decorador `@ManyToOne`
- Línea 29: `product: any` - Tipo de propiedad

### `apps/api/src/calendars/domain/calendar.entity.ts`
- Línea 13: `(day: any) => day.calendar` - Decorador `@OneToMany`
- Línea 17: `days: any[]` - Tipo de propiedad
- Línea 19: `constructor(name?: string, days?: any[], description?: string)` - Parámetro del constructor
- Línea 43: `addDay(day: any): void` - Parámetro del método

### `apps/api/src/calendars/domain/calendar-day.entity.ts`
- Línea 30: `(calendar: any) => calendar.days` - Decorador `@ManyToOne`
- Línea 32: `calendar: any` - Tipo de propiedad

### `apps/api/src/release-plans/domain/plan-phase.entity.ts`
- Línea 22: `(plan: any) => plan.phases` - Decorador `@ManyToOne`
- Línea 24: `plan: any` - Tipo de propiedad

### `apps/api/src/release-plans/domain/plan-task.entity.ts`
- Línea 22: `(plan: any) => plan.tasks` - Decorador `@ManyToOne`
- Línea 24: `plan: any` - Tipo de propiedad

### `apps/api/src/release-plans/domain/plan-milestone.entity.ts`
- Línea 19: `(plan: any) => plan.milestones` - Decorador `@ManyToOne`
- Línea 21: `plan: any` - Tipo de propiedad

### `apps/api/src/release-plans/domain/plan-reference.entity.ts`
- Línea 37: `(plan: any) => plan.references` - Decorador `@ManyToOne`
- Línea 39: `plan: any` - Tipo de propiedad

### `apps/api/src/release-plans/domain/gantt-cell-data.entity.ts`
- Línea 15: `(cellData: any) => cellData.comments` - Decorador `@ManyToOne`
- Línea 17: `cellData: any` - Tipo de propiedad
- Línea 59: `(cellData: any) => cellData.files` - Decorador `@ManyToOne`
- Línea 61: `cellData: any` - Tipo de propiedad
- Línea 106: `(cellData: any) => cellData.links` - Decorador `@ManyToOne`
- Línea 108: `cellData: any` - Tipo de propiedad
- Línea 154: `(plan: any) => plan.cellData` - Decorador `@ManyToOne`
- Línea 156: `plan: any` - Tipo de propiedad

### `apps/api/src/release-plans/domain/plan.entity.ts`
- Línea 158: `addPhase(phase: any): void` - Parámetro del método

## 2. Repositorios (Type Casts para TypeORM)

### `apps/api/src/features/infrastructure/feature.repository.ts`
- Línea 33: `where: { productId } as any` - Cast para TypeORM where clause
- Línea 40: `where: { status: status as any } as any` - Cast para TypeORM where clause
- Línea 47: `where: { name } as any` - Cast para TypeORM where clause

### `apps/api/src/release-plans/infrastructure/plan.repository.ts`
- Línea 35: `where: { productId } as any` - Cast para TypeORM where clause
- Línea 41: `where: { status: status as any } as any` - Cast para TypeORM where clause
- Línea 47: `where: { owner } as any` - Cast para TypeORM where clause
- Línea 53: `where: { name } as any` - Cast para TypeORM where clause
- Línea 59: `where: { id } as any` - Cast para TypeORM where clause

## 3. Servicios (Type Casts)

### `apps/api/src/features/application/feature.service.ts`
- Línea 80: `dto as any` - Cast para método `update` del repositorio

### `apps/api/src/release-plans/application/plan.service.ts`
- Línea 94: `dto as any` - Cast para método `update` del repositorio

### `apps/api/src/release-plans/application/dto/plan-response.dto.ts`
- Línea 109: `entity.files?.map((file: any) =>` - Cast para mapeo de archivos

## 4. Cache Service

### `apps/api/src/common/cache/cache.service.ts`
- Línea 13: `private cacheManager: any` - Tipo del cache manager (no hay tipos disponibles)
- Línea 20: `(this.cacheManager as any).get(key)` - Cast para método get
- Línea 31: `value: any` - Tipo del valor a cachear
- Línea 56: `(this.cacheManager as any).store` - Cast para acceder a store
- Línea 74: `(this.cacheManager as any).reset()` - Cast para método reset

## 5. Filtros y Decoradores

### `apps/api/src/common/filters/http-exception.filter.ts`
- Línea 27: `(request as any).correlationId` - Propiedad extendida de Request
- Línea 28: `(request as any).requestId` - Propiedad extendida de Request
- Línea 79: `delete (errorResponse as any).stack` - Cast para eliminar propiedad

### `apps/api/src/common/decorators/retry.decorator.ts`
- Línea 16: `target: any` - Parámetro del decorador
- Línea 22: `...args: any[]` - Parámetros del método decorado

## 6. Auth Module

### `apps/api/src/auth/auth.module.ts`
- Línea 27: `} as any` - Cast para configuración de JwtModule

### `apps/api/src/auth/application/auth.service.ts`
- Línea 213: `payload as any` - Cast para JwtService.sign
- Línea 215: `} as any` - Cast para opciones de JwtService.sign
- Línea 217: `payload as any` - Cast para JwtService.sign
- Línea 220: `} as any` - Cast para opciones de JwtService.sign
- Línea 247: `refreshToken: null as any` - Cast para null en update
- Línea 248: `refreshTokenExpiresAt: null as any` - Cast para null en update

## 7. Tests (Aceptable - Mocking)

### Archivos de test (*.spec.ts)
- **Total en tests: ~140 ocurrencias**
- Uso de `any` en mocks, expect.any(), y casts para testing
- Estos son aceptables ya que son parte de la infraestructura de testing

## Resumen por Categoría

| Categoría | Cantidad | Prioridad de Refactorización |
|----------|----------|------------------------------|
| Entidades Domain (TypeORM) | ~30 | Media - Pueden tiparse mejor |
| Repositorios (TypeORM casts) | ~10 | Alta - Afecta type safety |
| Servicios (DTO casts) | ~3 | Alta - Afecta type safety |
| Cache Service | ~5 | Media - Depende de tipos de cache-manager |
| Filtros/Decoradores | ~5 | Baja - Propiedades extendidas |
| Auth Module | ~7 | Media - Depende de tipos de @nestjs/jwt |
| Tests | ~140 | Baja - Aceptable para testing |

## Recomendaciones

1. **Alta Prioridad**: Reemplazar casts en repositorios y servicios con tipos apropiados
2. **Media Prioridad**: Crear interfaces para relaciones de TypeORM en lugar de `any`
3. **Media Prioridad**: Tipar mejor el CacheService si hay tipos disponibles
4. **Baja Prioridad**: Los usos en tests son aceptables

