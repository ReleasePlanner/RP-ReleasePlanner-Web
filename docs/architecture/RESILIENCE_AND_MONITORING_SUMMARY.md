# Resumen de Mejoras de Resiliencia, Logging y Monitoreo

Este documento resume todas las mejoras implementadas para garantizar que tanto el backend (API NestJS) como el frontend (React) tengan mecanismos claros de gestión de excepciones, logging, monitoreo y resiliencia.

## Backend (NestJS API)

### 1. Manejo de Errores de Base de Datos

**Archivo:** `apps/api/src/common/exceptions/database-exception.ts`

- **DatabaseException**: Excepción personalizada para errores de base de datos
- **Mapeo de errores PostgreSQL**: Convierte códigos de error de PostgreSQL a excepciones HTTP apropiadas:
  - `23505` (Unique violation) → `409 Conflict`
  - `23503` (Foreign key violation) → `400 Bad Request`
  - `23502` (Not null violation) → `400 Bad Request`
  - `23514` (Check violation) → `400 Bad Request`
  - `08003/08006` (Connection errors) → `503 Service Unavailable`
  - `53300` (Too many connections) → `503 Service Unavailable`

**Archivo:** `apps/api/src/common/database/base.repository.ts`

- **Manejo de errores mejorado**: Todos los métodos del repositorio base ahora:
  - Capturan errores de TypeORM y los convierten a `DatabaseException`
  - Registran errores con contexto completo
  - Lanzan excepciones apropiadas (`NotFoundException`, `DatabaseException`)

### 2. Interceptores de Resiliencia

**Archivo:** `apps/api/src/common/interceptors/timeout.interceptor.ts`

- **TimeoutInterceptor**: Enforces request timeout (default: 30 segundos)
- Configurable via `REQUEST_TIMEOUT_MS` environment variable
- Lanza `RequestTimeoutException` cuando se excede el timeout

**Archivo:** `apps/api/src/common/interceptors/request-context.interceptor.ts`

- **RequestContextInterceptor**: Agrega contexto a todas las solicitudes:
  - Correlation ID (generado o recibido del header `X-Correlation-ID`)
  - Request ID (UUID único por solicitud)
  - User context (si está disponible desde auth middleware)
  - Headers de respuesta con correlation ID para trazabilidad

**Archivo:** `apps/api/src/common/interceptors/logging.interceptor.ts` (mejorado)

- **LoggingInterceptor mejorado**: Logging estructurado con:
  - Tipo de evento (`request_start`, `request_success`, `request_error`)
  - Correlation ID y Request ID
  - IP y User-Agent
  - Duración de la solicitud
  - Códigos de estado HTTP
  - Información de errores estructurada

### 3. Filtro de Excepciones Global Mejorado

**Archivo:** `apps/api/src/common/filters/http-exception.filter.ts` (mejorado)

- **HttpExceptionFilter mejorado**: Maneja todos los tipos de excepciones:
  - `DatabaseException`: Convierte errores de base de datos a respuestas HTTP apropiadas
  - `QueryFailedError`: Convierte errores de TypeORM automáticamente
  - `HttpException`: Maneja excepciones HTTP estándar
  - Errores desconocidos: Los envuelve en respuestas apropiadas
- **Seguridad**: No expone detalles internos en producción
- **Logging estructurado**: Registra todos los errores con contexto completo
- **Respuestas consistentes**: Todas las respuestas de error incluyen:
  - `statusCode`
  - `timestamp`
  - `path` y `method`
  - `correlationId` y `requestId`
  - `message` y `code` (si está disponible)

### 4. Configuración del Módulo

**Archivo:** `apps/api/src/app/app.module.ts` (actualizado)

- Interceptores registrados en orden:
  1. `RequestContextInterceptor` - Agrega contexto
  2. `TimeoutInterceptor` - Enforces timeout
  3. `TransformInterceptor` - Transforma respuestas
  4. `LoggingInterceptor` - Registra solicitudes/respuestas
- `HttpExceptionFilter` registrado globalmente

### 5. Health Checks

**Archivo:** `apps/api/src/app/health.controller.ts` (ya existente)

- Endpoints de health check usando `@nestjs/terminus`:
  - `/api/health` - Health check completo (database, memory, disk)
  - `/api/health/liveness` - Liveness probe
  - `/api/health/readiness` - Readiness probe (verifica conexión a base de datos)

## Frontend (React)

### 1. HTTP Client Mejorado

**Archivo:** `apps/portal/src/api/httpClient.ts` (completamente reescrito)

**Características implementadas:**

- **Retry automático con exponential backoff**:
  - 3 intentos por defecto (configurable)
  - Retry solo en errores retryables (5xx, network errors, timeouts)
  - No retry en errores de cliente (4xx) excepto 408 y 429
  - Delay exponencial: 1s, 2s, 4s...

- **Timeout handling**:
  - Timeout por defecto: 30 segundos (configurable)
  - Usa `AbortController` para cancelar solicitudes que exceden el timeout
  - Lanza `HttpClientError` con `isTimeout: true`

- **Detección de conexión offline**:
  - Verifica `navigator.onLine` antes de hacer solicitudes
  - Lanza error apropiado si el dispositivo está offline

- **Correlation ID support**:
  - Genera correlation ID para cada solicitud
  - Envía `X-Correlation-ID` header
  - Recibe y almacena correlation ID de la respuesta

- **Logging estructurado**:
  - Logs de inicio de solicitud (debug)
  - Logs de éxito (debug)
  - Logs de error (error)
  - Logs de retry (warn)
  - Incluye metadata completa (URL, método, correlation ID, status code, etc.)

- **Manejo de errores mejorado**:
  - `HttpClientError` extendido con:
    - `statusCode`
    - `code` (código de error del servidor)
    - `correlationId` y `requestId`
    - `isNetworkError` y `isTimeout` flags
  - Parsing mejorado de respuestas de error JSON
  - Fallback apropiado para errores no-JSON

### 2. React Query Configuration Mejorada

**Archivo:** `apps/portal/src/api/queryClient.ts` (mejorado)

**Configuración de Queries:**

- **Retry inteligente**:
  - No retry en errores 4xx excepto 408 y 429
  - Retry hasta 3 veces en errores de red o 5xx
  - Retry hasta 2 veces en errores desconocidos
  - Exponential backoff: max 30 segundos

- **Refetch on reconnect**: `refetchOnReconnect: true`

- **Error handling**: Callback `onError` que registra todos los errores con contexto

**Configuración de Mutations:**

- **Retry limitado**: Solo retry en errores de red o 5xx (máximo 2 intentos)
- **Error handling**: Callback `onError` para logging
- **Success handling**: Callback `onSuccess` para logging

### 3. Sistema de Notificaciones de Errores

**Archivo:** `apps/portal/src/utils/notifications/errorNotification.ts`

**Funciones utilitarias:**

- **`getErrorMessage(error)`**: Obtiene mensajes de error amigables al usuario:
  - Errores de red → "No hay conexión a internet..."
  - Timeouts → "La solicitud tardó demasiado tiempo..."
  - 400 → "Solicitud inválida..."
  - 401 → "No autorizado..."
  - 403 → "No tienes permisos..."
  - 404 → "Recurso no encontrado"
  - 409 → Mensaje del servidor o "Conflicto..."
  - 429 → "Demasiadas solicitudes..."
  - 500 → "Error del servidor..."
  - 502/503/504 → "El servicio no está disponible..."

- **`getErrorTitle(error)`**: Obtiene títulos apropiados según el tipo de error

- **`logError(error, context)`**: Registra errores con contexto completo

- **`getErrorDetails(error)`**: Obtiene detalles técnicos del error (correlation ID, request ID, código, etc.)

### 4. Monitor de Red

**Archivo:** `apps/portal/src/utils/network/networkMonitor.ts`

**Características:**

- **Singleton service** para monitorear estado de red
- **Event listeners** para eventos `online` y `offline`
- **API de suscripción** para componentes que necesiten reaccionar a cambios de red:
  ```typescript
  const unsubscribe = networkMonitor.subscribe({
    onOnline: () => { /* handle online */ },
    onOffline: () => { /* handle offline */ },
    onStatusChange: (status) => { /* handle status change */ }
  });
  ```
- **Logging** de cambios de estado de red

### 5. Logger Existente

**Archivo:** `apps/portal/src/utils/logging/Logger.ts` (ya existente)

- Logger estructurado con múltiples transports
- Soporte para correlation IDs
- Logging a console (dev) y localStorage
- Manejo de errores globales (unhandled rejections, global errors)

### 6. Error Boundary Existente

**Archivo:** `apps/portal/src/utils/logging/ErrorBoundary.tsx` (ya existente)

- Error boundary completo con logging
- UI de error con opciones de retry y report
- Soporte para fallback personalizado
- Logging de errores con contexto completo

## Configuración de Variables de Entorno

### Backend

```env
# Request timeout en milisegundos (default: 30000)
REQUEST_TIMEOUT_MS=30000

# Database connection timeout (default: 2000)
DATABASE_CONNECTION_TIMEOUT=2000

# Database pool settings
DATABASE_POOL_MAX=10
DATABASE_POOL_MIN=2
DATABASE_POOL_IDLE_TIMEOUT=30000
```

### Frontend

Las configuraciones están hardcodeadas con valores por defecto razonables, pero pueden ser fácilmente movidas a variables de entorno si es necesario:

- `DEFAULT_TIMEOUT`: 30000ms (30 segundos)
- `DEFAULT_RETRIES`: 3 intentos
- `DEFAULT_RETRY_DELAY`: 1000ms (1 segundo)

## Mejores Prácticas Implementadas

### Backend

1. ✅ **Manejo de errores de base de datos**: Conversión automática de errores TypeORM a excepciones HTTP apropiadas
2. ✅ **Logging estructurado**: Todos los logs incluyen correlation ID, request ID, y contexto completo
3. ✅ **Timeouts**: Prevención de solicitudes colgadas
4. ✅ **Trazabilidad**: Correlation IDs para rastrear solicitudes a través del sistema
5. ✅ **Health checks**: Endpoints para monitoreo y orquestación (Kubernetes)
6. ✅ **Seguridad**: No exposición de detalles internos en producción

### Frontend

1. ✅ **Retry automático**: Reintentos inteligentes con exponential backoff
2. ✅ **Timeout handling**: Prevención de solicitudes colgadas
3. ✅ **Offline detection**: Detección y manejo de estado offline
4. ✅ **Error handling**: Manejo consistente de errores con mensajes amigables
5. ✅ **Logging estructurado**: Logging de todas las operaciones con contexto
6. ✅ **Correlation IDs**: Soporte para trazabilidad end-to-end
7. ✅ **React Query**: Configuración optimizada para resiliencia y performance

## Próximos Pasos Recomendados

1. **Integración con servicios de monitoreo**:
   - Backend: Integrar con servicios como Prometheus, Grafana, o Datadog
   - Frontend: Integrar con servicios como Sentry, Bugsnag, o LogRocket

2. **Rate limiting**:
   - Implementar rate limiting en el backend para prevenir abuso
   - Manejar respuestas 429 apropiadamente en el frontend

3. **Circuit breaker**:
   - Implementar circuit breaker pattern para servicios externos
   - Implementar circuit breaker en el frontend para detectar cuando el backend está caído

4. **Métricas y alertas**:
   - Configurar alertas basadas en logs estructurados
   - Implementar métricas de performance (latencia, throughput, error rate)

5. **Testing**:
   - Agregar tests para manejo de errores
   - Tests de resiliencia (timeouts, network failures, etc.)

## Conclusión

Tanto el backend como el frontend ahora tienen mecanismos robustos de:
- ✅ **Gestión de excepciones**: Manejo consistente y apropiado de todos los tipos de errores
- ✅ **Logging**: Logging estructurado con contexto completo para debugging y monitoreo
- ✅ **Monitoreo**: Health checks y logging que permiten monitoreo efectivo
- ✅ **Resiliencia**: Retry logic, timeouts, offline detection, y manejo de errores de red

Estas mejoras garantizan que la aplicación sea robusta, observable y fácil de depurar en producción.

