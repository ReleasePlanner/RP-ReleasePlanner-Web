# @rp-release-planner/rp-shared

Librería compartida para código reutilizable en el monorepo Release Planner.

## Descripción

Esta librería consolida utilidades comunes y validaciones defensivas que pueden ser utilizadas en múltiples aplicaciones del monorepo (API, Portal Web, Mobile).

## Características

- ✅ **Validaciones defensivas**: Funciones de validación para inputs, IDs, objetos, arrays, fechas, etc.
- ✅ **Framework-agnostic**: Funciones core que funcionan en cualquier contexto
- ✅ **Adaptadores específicos**: Adaptadores para NestJS que lanzan excepciones específicas del framework
- ✅ **Type-safe**: Completamente tipado con TypeScript
- ✅ **Reutilizable**: Puede ser usado en API (NestJS), Portal (React) y Mobile (React Native)

## Instalación

La librería está disponible automáticamente en el monorepo a través de Nx. No requiere instalación adicional.

## Uso

### En API (NestJS)

```typescript
import {
  validateString,
  validateId,
  validateObject,
  validateArray,
  validateDateString,
  validatePassword,
} from '@rp-release-planner/rp-shared';

// Las funciones automáticamente lanzan BadRequestException de NestJS
async createUser(dto: CreateUserDto) {
  validateObject(dto, 'CreateUserDto');
  validateString(dto.username, 'Username');
  validateId(dto.id, 'User');
  // ...
}
```

### En Portal (React)

```typescript
import {
  validateString,
  validateId,
  validateObject,
  ValidationError,
} from '@rp-release-planner/rp-shared';

// Las funciones lanzan ValidationError genérico
function handleSubmit(formData: FormData) {
  try {
    validateString(formData.email, 'Email');
    validateObject(formData, 'FormData');
    // ...
  } catch (error) {
    if (error instanceof ValidationError) {
      // Manejar error de validación
      console.error(error.message);
    }
  }
}
```

### En Mobile (React Native)

```typescript
import {
  validateString,
  validateId,
  validateObject,
  ValidationError,
} from '@rp-release-planner/rp-shared';

// Mismo comportamiento que en React
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

## API

### Validadores Core

#### `validateString(value, fieldName)`
Valida que un string no sea null, undefined o vacío.

#### `validateId(id, resourceName?)`
Valida que un ID sea un string válido (no null, undefined o vacío).

#### `validateObject(obj, objectName)`
Valida que un objeto no sea null o undefined.

#### `validateArray(arr, arrayName)`
Valida que un valor sea un array (puede estar vacío).

#### `validateNumber(value, fieldName)`
Valida que un número sea válido (no null, undefined o NaN).

#### `validateDateString(dateString, fieldName)`
Valida que un string sea una fecha válida.

#### `validatePassword(password)`
Valida que una contraseña no esté vacía.

#### `validateEmailFormat(email)`
Valida el formato básico de un email.

#### `validateRange(value, min, max, fieldName)`
Valida que un número esté dentro de un rango.

### Utilidades

#### `safeTrim(value)`
Recorta un string de forma segura, retornando string vacío si es null/undefined.

#### `isNotEmpty(value)`
Verifica si un string no está vacío después de recortar.

### Tipos

#### `ValidationError`
Clase de error personalizada para errores de validación.

## Estructura

```
libs/rp-shared/
├── src/
│   ├── validators/
│   │   ├── defensive-validators.ts    # Validadores core (framework-agnostic)
│   │   └── nestjs-adapters.ts         # Adaptadores para NestJS
│   └── index.ts                       # Exportaciones principales
├── package.json
├── tsconfig.json
└── README.md
```

## Migración desde `defensive-validators`

Si estás migrando código que usa `defensive-validators` local:

**Antes:**
```typescript
import { validateString } from '../../common/utils/defensive-validators';
```

**Después:**
```typescript
import { validateString } from '@rp-release-planner/rp-shared';
```

## Beneficios

1. **Consolidación**: Código reutilizable en un solo lugar
2. **Mantenibilidad**: Cambios en un solo lugar se reflejan en todas las aplicaciones
3. **Consistencia**: Mismo comportamiento de validación en todo el monorepo
4. **Type-safety**: Tipos compartidos y consistentes
5. **Testing**: Tests centralizados para validaciones comunes

## Desarrollo

Para agregar nuevas validaciones:

1. Agregar la función core en `src/validators/defensive-validators.ts`
2. Agregar el adaptador NestJS en `src/validators/nestjs-adapters.ts` si es necesario
3. Exportar desde `src/index.ts`
4. Actualizar esta documentación

## Licencia

Privado - Uso interno del proyecto Release Planner.
