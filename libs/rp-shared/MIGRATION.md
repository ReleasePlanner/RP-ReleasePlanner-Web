# Guía de Migración a @rp-release-planner/rp-shared

## Resumen

Se ha creado la librería compartida `@rp-release-planner/rp-shared` para consolidar código reutilizable en el monorepo.

## Cambios Realizados

### 1. Nueva Librería Creada

- **Ubicación**: `libs/rp-shared/`
- **Nombre del paquete**: `@rp-release-planner/rp-shared`
- **Path alias**: `@rp-release-planner/rp-shared`

### 2. Archivos Migrados

Las funciones de validación defensiva han sido movidas desde:
- `apps/api/src/common/utils/defensive-validators.ts`

A:
- `libs/rp-shared/src/validators/defensive-validators.ts` (core)
- `libs/rp-shared/src/validators/nestjs-adapters.ts` (adaptador NestJS)

### 3. Importaciones Actualizadas

Todos los servicios y repositorios del API ahora usan:

```typescript
// Antes
import { validateString } from '../../common/utils/defensive-validators';

// Después
import { validateString } from '@rp-release-planner/rp-shared';
```

## Archivos Actualizados

### Servicios
- ✅ `apps/api/src/auth/application/auth.service.ts`
- ✅ `apps/api/src/products/application/product.service.ts`
- ✅ `apps/api/src/base-phases/application/base-phase.service.ts`
- ✅ `apps/api/src/features/application/feature.service.ts`
- ✅ `apps/api/src/calendars/application/calendar.service.ts`
- ✅ `apps/api/src/it-owners/application/it-owner.service.ts`
- ✅ `apps/api/src/release-plans/application/plan.service.ts`

### Repositorios
- ✅ `apps/api/src/common/database/base.repository.ts`
- ✅ `apps/api/src/users/infrastructure/user.repository.ts`
- ✅ `apps/api/src/products/infrastructure/product.repository.ts`
- ✅ `apps/api/src/base-phases/infrastructure/base-phase.repository.ts`
- ✅ `apps/api/src/features/infrastructure/feature.repository.ts`

## Próximos Pasos

### Para Portal (React)

Puedes empezar a usar las validaciones en el frontend:

```typescript
import { validateString, validateId, ValidationError } from '@rp-release-planner/rp-shared';

function validateForm(formData: FormData) {
  try {
    validateString(formData.email, 'Email');
    validateId(formData.userId, 'User');
    return true;
  } catch (error) {
    if (error instanceof ValidationError) {
      setError(error.message);
      return false;
    }
    throw error;
  }
}
```

### Para Mobile (React Native)

Similar al Portal:

```typescript
import { validateString, validateId, ValidationError } from '@rp-release-planner/rp-shared';

function validateInput(value: string) {
  try {
    validateString(value, 'Input');
    return true;
  } catch (error) {
    if (error instanceof ValidationError) {
      Alert.alert('Error', error.message);
      return false;
    }
    throw error;
  }
}
```

## Configuración

### TypeScript

La librería está configurada en `tsconfig.base.json`:

```json
{
  "paths": {
    "@rp-release-planner/rp-shared": ["libs/rp-shared/src/index.ts"]
  }
}
```

### Nx

La librería está registrada en `nx.json` y puede ser construida con:

```bash
nx build rp-shared
```

## Notas

- El archivo original `apps/api/src/common/utils/defensive-validators.ts` puede ser eliminado después de verificar que todo funciona correctamente.
- Las validaciones en NestJS automáticamente lanzan `BadRequestException`.
- Las validaciones en React/React Native lanzan `ValidationError` genérico.

