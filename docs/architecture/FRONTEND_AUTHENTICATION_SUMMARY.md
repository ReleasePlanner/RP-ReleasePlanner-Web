# Resumen de Integración de Autenticación en Frontend

Este documento describe la implementación completa de autenticación JWT en el frontend React.

## Estructura Implementada

### 1. Servicios de API

**Archivo:** `apps/portal/src/api/services/auth.service.ts`

- **authService**: Servicio centralizado para operaciones de autenticación
  - `login()`: Autentica usuario y almacena tokens
  - `register()`: Registra nuevo usuario
  - `refreshToken()`: Renueva access token
  - `logout()`: Cierra sesión y limpia almacenamiento
  - `getCurrentUser()`: Obtiene información del usuario actual
  - `getAccessToken()`, `getRefreshToken()`, `getUser()`: Getters para datos almacenados
  - `isAuthenticated()`: Verifica si hay token válido
  - `setTokens()`, `setUser()`, `clearAuth()`: Manejo de almacenamiento

### 2. Hooks de React Query

**Archivo:** `apps/portal/src/api/hooks/useAuth.ts`

- **useLogin()**: Hook para login mutation
- **useRegister()**: Hook para registro mutation
- **useLogout()**: Hook para logout mutation
- **useRefreshToken()**: Hook para refresh token mutation
- **useCurrentUser()**: Hook para obtener usuario actual (query)
- **useAuth()**: Hook principal que combina estado de autenticación

Características:
- Sincronización automática con React Query cache
- Logging de operaciones
- Manejo de errores integrado

### 3. Redux Slice

**Archivo:** `apps/portal/src/store/authSlice.ts`

- Estado de autenticación en Redux:
  - `user`: Usuario actual o null
  - `isAuthenticated`: Boolean de autenticación
  - `isLoading`: Estado de carga
- Actions: `setUser`, `setLoading`, `logout`

### 4. HTTP Client Mejorado

**Archivo:** `apps/portal/src/api/httpClient.ts` (modificado)

- **Inyección automática de tokens**: Agrega `Authorization: Bearer <token>` a todas las requests
- **Auto-refresh en 401**: Si recibe 401 Unauthorized:
  1. Intenta refrescar el token usando refresh token
  2. Reintenta la request original con el nuevo token
  3. Si el refresh falla, limpia autenticación y redirige a login

### 5. Componentes de Autenticación

**LoginForm** (`apps/portal/src/components/auth/LoginForm.tsx`):
- Formulario de login con validación
- Manejo de errores con mensajes amigables
- Link para cambiar a registro

**RegisterForm** (`apps/portal/src/components/auth/RegisterForm.tsx`):
- Formulario de registro con validación completa
- Validación de contraseña (mínimo 8 caracteres, mayúsculas, minúsculas, números)
- Confirmación de contraseña
- Manejo de errores

**AuthPage** (`apps/portal/src/components/auth/AuthPage.tsx`):
- Página combinada con tabs para login/registro
- Navegación entre formularios
- Redirección automática después de autenticación exitosa

**ProtectedRoute** (`apps/portal/src/components/auth/ProtectedRoute.tsx`):
- Componente wrapper para rutas protegidas
- Verifica autenticación antes de renderizar
- Redirige a login si no está autenticado
- Soporte para roles requeridos (RBAC)
- Loading state mientras verifica autenticación

**AuthProvider** (`apps/portal/src/components/auth/AuthProvider.tsx`):
- Inicializa estado de autenticación al cargar la app
- Sincroniza Redux y React Query
- Carga usuario desde localStorage si existe token válido

### 6. Configuración de Rutas

**Archivo:** `apps/portal/src/App.tsx` (modificado)

- Rutas públicas:
  - `/auth/login` - Página de login
  - `/auth/register` - Página de registro

- Rutas protegidas (envueltas en `ProtectedRoute`):
  - `/` - Release Planner
  - `/release-planner` - Release Planner
  - `/phases-maintenance` - Mantenimiento de fases
  - `/product-maintenance` - Mantenimiento de productos
  - `/features` - Mantenimiento de features
  - `/calendars` - Mantenimiento de calendarios
  - `/it-owners` - Mantenimiento de IT Owners

### 7. Integración en RootProvider

**Archivo:** `apps/portal/src/RootProvider.tsx` (modificado)

- `AuthProvider` envuelve la aplicación
- Inicializa autenticación al cargar

## Flujo de Autenticación

### 1. Login

```
Usuario ingresa credenciales
  ↓
useLogin() mutation
  ↓
authService.login() → API
  ↓
Tokens almacenados en localStorage
Usuario almacenado en localStorage y Redux
  ↓
Redirección a página principal
```

### 2. Request Autenticada

```
Componente hace request API
  ↓
httpClient.executeRequest()
  ↓
Obtiene accessToken de localStorage
Agrega Authorization header
  ↓
Request a API
  ↓
Si 401 Unauthorized:
  - Intenta refreshToken()
  - Reintenta request con nuevo token
  - Si falla: limpia auth y redirige a login
```

### 3. Refresh Token Automático

```
Access token expira (401)
  ↓
httpClient detecta 401
  ↓
Obtiene refreshToken de localStorage
Llama a /api/auth/refresh
  ↓
Nuevos tokens almacenados
Request original reintentada
```

### 4. Logout

```
Usuario hace logout
  ↓
useLogout() mutation
  ↓
authService.logout() → API
  ↓
Limpia localStorage
Limpia Redux state
Limpia React Query cache
  ↓
Redirección a login
```

## Almacenamiento

### LocalStorage

- `access_token`: JWT access token
- `refresh_token`: JWT refresh token
- `user`: Información del usuario (JSON)

### Redux State

```typescript
{
  auth: {
    user: User | null,
    isAuthenticated: boolean,
    isLoading: boolean
  }
}
```

### React Query Cache

- `['auth', 'user']`: Query key para usuario actual

## Uso en Componentes

### Obtener usuario actual

```typescript
import { useAuth } from '../api/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not authenticated</div>;

  return <div>Hello {user.username}</div>;
}
```

### Hacer logout

```typescript
import { useAuth } from '../api/hooks/useAuth';

function LogoutButton() {
  const { logout } = useAuth();

  return <button onClick={() => logout()}>Logout</button>;
}
```

### Proteger componente con rol

```typescript
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

## Seguridad Implementada

✅ **Tokens en localStorage**: Almacenamiento seguro de tokens
✅ **Auto-refresh**: Renovación automática de tokens expirados
✅ **Protección de rutas**: Rutas protegidas requieren autenticación
✅ **RBAC**: Control de acceso basado en roles
✅ **Limpieza en logout**: Eliminación completa de datos de autenticación
✅ **Manejo de errores**: Manejo seguro de errores de autenticación
✅ **Validación de entrada**: Validación en formularios de login/registro

## Próximos Pasos Recomendados

1. **Agregar botón de logout en header**
2. **Mostrar información del usuario en header**
3. **Implementar "Remember me"**
4. **Agregar indicador de sesión expirando**
5. **Implementar cambio de contraseña**
6. **Agregar recuperación de contraseña**
7. **Implementar verificación de email**

## Archivos Creados/Modificados

### Nuevos Archivos
- `apps/portal/src/api/services/auth.service.ts`
- `apps/portal/src/api/hooks/useAuth.ts`
- `apps/portal/src/store/authSlice.ts`
- `apps/portal/src/components/auth/LoginForm.tsx`
- `apps/portal/src/components/auth/RegisterForm.tsx`
- `apps/portal/src/components/auth/AuthPage.tsx`
- `apps/portal/src/components/auth/ProtectedRoute.tsx`
- `apps/portal/src/components/auth/AuthProvider.tsx`

### Archivos Modificados
- `apps/portal/src/api/config.ts` - Agregado endpoint AUTH y constantes de storage
- `apps/portal/src/api/httpClient.ts` - Agregada inyección de tokens y auto-refresh
- `apps/portal/src/store/store.ts` - Agregado authReducer
- `apps/portal/src/App.tsx` - Agregadas rutas de auth y protección
- `apps/portal/src/RootProvider.tsx` - Agregado AuthProvider

La autenticación está completamente integrada en el frontend y lista para usar.

