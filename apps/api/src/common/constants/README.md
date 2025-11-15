# Constants Organization Guide

Este documento explica la estructura y uso de las constantes en el proyecto API.

## 📁 Estructura

Las constantes están organizadas en dos niveles:

### 1. Constantes Comunes (`common/constants/`)

Constantes compartidas entre todos los módulos:

- **`api-docs.constants.ts`**: Constantes para documentación Swagger/OpenAPI
  - `API_OPERATION_SUMMARIES`: Resúmenes de operaciones comunes
  - `API_RESPONSE_DESCRIPTIONS`: Descripciones de respuestas comunes
  - `HTTP_STATUS_CODES`: Códigos de estado HTTP
  - `API_TAGS`: Tags para agrupar endpoints
  - `API_PARAM_DESCRIPTIONS`: Descripciones de parámetros comunes
  - `API_PROPERTY_DESCRIPTIONS`: Descripciones de propiedades comunes

- **`validation.constants.ts`**: Constantes para validación
  - `VALIDATION_MESSAGES`: Funciones para generar mensajes de validación dinámicos
  - `FIELD_VALIDATION_MESSAGES`: Mensajes específicos por campo
  - `VALIDATION_RULES`: Reglas de validación (patrones, longitudes mínimas/máximas)

- **`error-codes.constants.ts`**: Códigos de error
  - `ERROR_CODES`: Códigos de error comunes
  - `FIELD_ERROR_CODES`: Códigos de error específicos por campo
  - `RESOURCE_ERROR_CODES`: Códigos de error específicos por recurso

- **`status.constants.ts`**: Valores de estado
  - `HEALTH_STATUS`: Estados para health checks
  - `HEALTH_MESSAGES`: Mensajes de health checks
  - `RESPONSE_STATUS`: Estados de respuesta

- **`messages.constants.ts`**: Mensajes de error y éxito
  - `ERROR_MESSAGES`: Funciones para generar mensajes de error dinámicos
  - `SUCCESS_MESSAGES`: Funciones para generar mensajes de éxito dinámicos
  - `ENTITY_ERROR_MESSAGES`: Mensajes específicos por entidad

### 2. Constantes por Módulo (`{module}/constants/`)

Cada módulo tiene sus propias constantes que extienden o especializan las comunes:

- **`api-docs.constants.ts`**: Documentación específica del módulo
- **`validation.constants.ts`**: Validaciones específicas del módulo
- **`index.ts`**: Exporta todas las constantes del módulo

## 🚀 Uso

### En Controladores

```typescript
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  AUTH_API_OPERATION_SUMMARIES,
  AUTH_API_RESPONSE_DESCRIPTIONS,
  AUTH_HTTP_STATUS_CODES,
} from '../constants';
import { API_TAGS } from '../../common/constants';

@ApiTags(API_TAGS.AUTH)
@Controller('auth')
export class AuthController {
  @Post('login')
  @ApiOperation({ summary: AUTH_API_OPERATION_SUMMARIES.LOGIN })
  @ApiResponse({
    status: AUTH_HTTP_STATUS_CODES.OK,
    description: AUTH_API_RESPONSE_DESCRIPTIONS.USER_LOGGED_IN,
  })
  async login() {
    // ...
  }
}
```

### En DTOs

```typescript
import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { AUTH_VALIDATION_MESSAGES } from '../../constants';
import { VALIDATION_RULES, API_PROPERTY_DESCRIPTIONS } from '../../../common/constants';

export class RegisterDto {
  @ApiProperty({
    description: API_PROPERTY_DESCRIPTIONS.NAME,
    minLength: VALIDATION_RULES.USERNAME.MIN_LENGTH,
  })
  @IsString()
  @IsNotEmpty({ message: AUTH_VALIDATION_MESSAGES.USERNAME_REQUIRED })
  @MinLength(VALIDATION_RULES.USERNAME.MIN_LENGTH, {
    message: AUTH_VALIDATION_MESSAGES.USERNAME_MIN_LENGTH,
  })
  @Matches(VALIDATION_RULES.USERNAME.PATTERN, {
    message: AUTH_VALIDATION_MESSAGES.USERNAME_PATTERN,
  })
  username: string;
}
```

### En Excepciones

```typescript
import { ERROR_CODES, ERROR_MESSAGES } from '../constants';

export class NotFoundException extends BusinessException {
  constructor(resource: string, id?: string) {
    const message = ERROR_MESSAGES.RESOURCE_NOT_FOUND(resource, id);
    super(message, HttpStatus.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND);
  }
}
```

### En Servicios

```typescript
import { HEALTH_STATUS, HEALTH_MESSAGES } from '../common/constants';

async checkCache() {
  try {
    // ...
    return {
      status: HEALTH_STATUS.OK,
      message: HEALTH_MESSAGES.CACHE_WORKING,
    };
  } catch (error) {
    return {
      status: HEALTH_STATUS.ERROR,
      message: HEALTH_MESSAGES.CACHE_ERROR,
    };
  }
}
```

## 📋 Mejores Prácticas

1. **Siempre usa constantes en lugar de strings hardcodeados**
   - ✅ `API_TAGS.AUTH`
   - ❌ `'auth'`

2. **Usa constantes comunes cuando sea posible**
   - ✅ `HTTP_STATUS_CODES.OK`
   - ❌ `200`

3. **Crea constantes específicas del módulo solo cuando sea necesario**
   - Si un mensaje es específico del módulo y no se reutiliza, créalo en el módulo
   - Si es común a varios módulos, créalo en `common/constants`

4. **Usa funciones para mensajes dinámicos**
   - ✅ `ERROR_MESSAGES.RESOURCE_NOT_FOUND(resource, id)`
   - ❌ `\`${resource} with id ${id} not found\``

5. **Mantén la consistencia**
   - Usa el mismo patrón de nombres en todos los módulos
   - Sigue la estructura establecida

## 🔄 Agregar Nuevas Constant

### Para Constantes Comunes

1. Identifica si la constante es realmente común a varios módulos
2. Agrega la constante al archivo apropiado en `common/constants/`
3. Exporta desde `common/constants/index.ts`

### Para Constantes de Módulo

1. Crea o actualiza `{module}/constants/api-docs.constants.ts` o `{module}/constants/validation.constants.ts`
2. Importa constantes comunes cuando sea posible
3. Exporta desde `{module}/constants/index.ts`

## 📝 Ejemplo Completo

```typescript
// common/constants/api-docs.constants.ts
export const API_TAGS = {
  AUTH: 'auth',
  HEALTH: 'health',
} as const;

// auth/constants/api-docs.constants.ts
import { API_OPERATION_SUMMARIES } from '../../common/constants';

export const AUTH_API_OPERATION_SUMMARIES = {
  LOGIN: API_OPERATION_SUMMARIES.LOGIN,
  REGISTER: API_OPERATION_SUMMARIES.REGISTER,
} as const;

// auth/presentation/auth.controller.ts
import { API_TAGS } from '../../common/constants';
import { AUTH_API_OPERATION_SUMMARIES } from '../constants';

@ApiTags(API_TAGS.AUTH)
@Controller('auth')
export class AuthController {
  @Post('login')
  @ApiOperation({ summary: AUTH_API_OPERATION_SUMMARIES.LOGIN })
  async login() {
    // ...
  }
}
```

## ✅ Beneficios

1. **Mantenibilidad**: Cambios centralizados
2. **Consistencia**: Mismos valores en todo el código
3. **Type Safety**: TypeScript detecta errores de tipeo
4. **Refactoring**: Fácil de renombrar y actualizar
5. **Documentación**: Las constantes sirven como documentación viva
6. **Internacionalización**: Fácil de agregar soporte multiidioma en el futuro

