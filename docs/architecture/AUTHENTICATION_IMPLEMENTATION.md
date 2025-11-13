# Implementación de Autenticación JWT y Autorización RBAC

Este documento describe la implementación completa de autenticación JWT y autorización basada en roles (RBAC) en la API.

## Estructura Implementada

### 1. Entidad User

**Archivo:** `apps/api/src/users/domain/user.entity.ts`

- Campos principales:
  - `id`: UUID único
  - `username`: Nombre de usuario único
  - `email`: Email único
  - `password`: Contraseña hasheada con bcrypt
  - `firstName`, `lastName`: Información personal opcional
  - `role`: Rol del usuario (admin, manager, user, viewer)
  - `isActive`: Estado activo/inactivo
  - `lastLoginAt`: Último inicio de sesión
  - `refreshToken`: Token de refresco hasheado
  - `refreshTokenExpiresAt`: Expiración del refresh token

- Índices:
  - Email único
  - Username único
  - Índice en role para búsquedas rápidas

### 2. Módulo de Autenticación

**Archivo:** `apps/api/src/auth/auth.module.ts`

- Configuración JWT con variables de entorno
- Estrategias Passport (JWT y Local)
- Servicios y repositorios necesarios

### 3. Estrategias Passport

**JWT Strategy** (`apps/api/src/auth/strategies/jwt.strategy.ts`):
- Valida tokens JWT en el header `Authorization: Bearer <token>`
- Extrae información del usuario del token
- Verifica que el usuario esté activo

**Local Strategy** (`apps/api/src/auth/strategies/local.strategy.ts`):
- Valida credenciales username/password
- Usado para login

### 4. Guards

**JwtAuthGuard** (`apps/api/src/auth/guards/jwt-auth.guard.ts`):
- Protege rutas que requieren autenticación
- Respeta el decorador `@Public()` para rutas públicas
- Aplicado globalmente en `AppModule`

**RolesGuard** (`apps/api/src/auth/guards/roles.guard.ts`):
- Implementa RBAC (Role-Based Access Control)
- Verifica que el usuario tenga uno de los roles requeridos
- Usado con el decorador `@Roles()`

### 5. Decoradores

**@Public()** (`apps/api/src/auth/decorators/public.decorator.ts`):
- Marca rutas como públicas (no requieren autenticación)
- Ejemplo: `/api/auth/login`, `/api/auth/register`

**@Roles(...roles)** (`apps/api/src/auth/decorators/roles.decorator.ts`):
- Especifica roles requeridos para acceder a una ruta
- Ejemplo: `@Roles(UserRole.ADMIN, UserRole.MANAGER)`

**@CurrentUser()** (`apps/api/src/auth/decorators/current-user.decorator.ts`):
- Extrae el usuario actual del request
- Útil para obtener información del usuario autenticado

### 6. Servicio de Autenticación

**AuthService** (`apps/api/src/auth/application/auth.service.ts`):

- **login()**: Autentica usuario y genera tokens
- **register()**: Registra nuevo usuario con contraseña hasheada
- **refreshToken()**: Renueva access token usando refresh token
- **logout()**: Invalida refresh token
- **validateUser()**: Valida credenciales (username o email)

Características de seguridad:
- Contraseñas hasheadas con bcrypt (10 rounds por defecto)
- Refresh tokens hasheados antes de almacenar
- Validación de expiración de tokens
- Rate limiting en login y registro

### 7. Controlador de Autenticación

**AuthController** (`apps/api/src/auth/presentation/auth.controller.ts`):

Endpoints:
- `POST /api/auth/register` - Registro de usuario (público)
- `POST /api/auth/login` - Login (público)
- `POST /api/auth/refresh` - Refrescar token (público)
- `POST /api/auth/logout` - Logout (requiere autenticación)
- `POST /api/auth/me` - Obtener usuario actual (requiere autenticación)

Rate limiting:
- Registro: 5 intentos por minuto
- Login: 10 intentos por minuto

## Configuración

### Variables de Entorno

```env
# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Bcrypt Configuration
BCRYPT_ROUNDS=10
```

### Roles Disponibles

```typescript
enum UserRole {
  ADMIN = 'admin',      // Acceso completo
  MANAGER = 'manager',  // Gestión de recursos
  USER = 'user',        // Usuario estándar
  VIEWER = 'viewer',     // Solo lectura
}
```

## Uso en Controladores

### Proteger una ruta con autenticación

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('products')
export class ProductController {
  @Get()
  @UseGuards(JwtAuthGuard) // Requiere autenticación
  async findAll(@CurrentUser() user: CurrentUserPayload) {
    // user contiene: id, username, email, role
    return this.service.findAll();
  }
}
```

### Proteger con roles específicos

```typescript
import { Controller, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/domain/user.entity';

@Controller('products')
export class ProductController {
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER) // Solo admin y manager pueden eliminar
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
```

### Marcar ruta como pública

```typescript
import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';

@Controller('products')
export class ProductController {
  @Get('public')
  @Public() // No requiere autenticación
  async getPublicProducts() {
    return this.service.findPublic();
  }
}
```

## Migración de Base de Datos

**Archivo:** `apps/api/src/migrations/1700000000001-CreateUsersTable.ts`

Para crear la tabla de usuarios:

```bash
npm run migration:run --workspace=apps/api
```

## Flujo de Autenticación

### 1. Registro

```
POST /api/auth/register
Body: { username, email, password, firstName?, lastName?, role? }

Response: {
  accessToken: "jwt_token",
  refreshToken: "refresh_token",
  user: { id, username, email, role, firstName, lastName }
}
```

### 2. Login

```
POST /api/auth/login
Body: { username, password }

Response: {
  accessToken: "jwt_token",
  refreshToken: "refresh_token",
  user: { id, username, email, role, firstName, lastName }
}
```

### 3. Usar Access Token

```
GET /api/products
Headers: {
  Authorization: "Bearer <access_token>"
}
```

### 4. Refrescar Token

```
POST /api/auth/refresh
Body: { refreshToken: "refresh_token" }

Response: {
  accessToken: "new_jwt_token",
  refreshToken: "new_refresh_token",
  user: { ... }
}
```

### 5. Logout

```
POST /api/auth/logout
Headers: {
  Authorization: "Bearer <access_token>"
}

Response: 204 No Content
```

## Seguridad Implementada

✅ **Contraseñas hasheadas**: bcrypt con salt rounds
✅ **Tokens JWT**: Firmados y con expiración
✅ **Refresh tokens**: Hasheados antes de almacenar
✅ **Rate limiting**: En login y registro
✅ **Validación de entrada**: DTOs con class-validator
✅ **RBAC**: Control de acceso basado en roles
✅ **Guards globales**: Protección por defecto en todas las rutas
✅ **Rutas públicas**: Decorador @Public() para excepciones

## Próximos Pasos

1. **Integración Frontend**: Implementar login/logout en React
2. **Middleware de Refresh**: Auto-refresh de tokens en el frontend
3. **Permisos granulares**: Sistema de permisos más detallado
4. **2FA**: Autenticación de dos factores
5. **OAuth**: Integración con proveedores OAuth (Google, GitHub, etc.)
6. **Sesiones**: Manejo de sesiones múltiples
7. **Auditoría**: Logging de acciones de usuarios

## Ejemplo de Uso Completo

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/domain/user.entity';

@Controller('example')
export class ExampleController {
  // Ruta pública
  @Get('public')
  @Public()
  getPublic() {
    return { message: 'This is public' };
  }

  // Ruta protegida (requiere autenticación)
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  getProtected(@CurrentUser() user) {
    return { message: `Hello ${user.username}` };
  }

  // Ruta con rol específico
  @Post('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  adminOnly(@CurrentUser() user) {
    return { message: `Admin action by ${user.username}` };
  }

  // Múltiples roles permitidos
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  delete(@Param('id') id: string, @CurrentUser() user) {
    return { message: `Deleted by ${user.username}` };
  }
}
```

La autenticación JWT y autorización RBAC están completamente implementadas y listas para usar.

