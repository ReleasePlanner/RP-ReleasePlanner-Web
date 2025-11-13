# Implementación de Redis para Caching

Este documento describe la implementación de Redis para caching en la API NestJS.

## Estructura Implementada

### 1. Configuración de Redis

**Archivo:** `apps/api/src/config/redis.config.ts`

- Configuración centralizada de Redis
- Variables de entorno:
  - `REDIS_HOST`: Host de Redis (default: localhost)
  - `REDIS_PORT`: Puerto de Redis (default: 6379)
  - `REDIS_PASSWORD`: Contraseña de Redis (opcional)
  - `REDIS_DB`: Base de datos de Redis (default: 0)
  - `REDIS_TTL`: TTL por defecto en segundos (default: 3600)
  - `REDIS_MAX_CONNECTIONS`: Máximo de conexiones (default: 10)

### 2. Módulo de Cache

**Archivo:** `apps/api/src/common/cache/cache.module.ts`

- Módulo global de cache
- Configuración automática:
  - Usa Redis si está configurado
  - Fallback a cache en memoria si Redis no está disponible
  - Logging de estado de conexión

### 3. Servicio de Cache

**Archivo:** `apps/api/src/common/cache/cache.service.ts`

- **CacheService**: Servicio centralizado para operaciones de cache
  - `get<T>(key)`: Obtener valor del cache
  - `set(key, value, ttl?)`: Almacenar valor en cache
  - `del(key)`: Eliminar valor del cache
  - `delPattern(pattern)`: Eliminar múltiples keys por patrón
  - `reset()`: Limpiar todo el cache
  - `generateKey(prefix, ...parts)`: Generar keys de cache consistentes

### 4. Decoradores de Cache

**Archivo:** `apps/api/src/common/decorators/cache.decorator.ts`

- **@CacheResult(ttl, keyPrefix)**: Cachea el resultado de un método
  - `ttl`: Tiempo de vida en segundos (default: 3600)
  - `keyPrefix`: Prefijo para la key de cache

- **@InvalidateCache(...patterns)**: Invalida cache después de mutaciones
  - `patterns`: Patrones de keys a invalidar (ej: `'base-phases:*'`)

### 5. Interceptores

**CacheInvalidateInterceptor** (`apps/api/src/common/interceptors/cache-invalidate.interceptor.ts`):
- Interceptor que invalida cache después de mutaciones
- Usa el decorador `@InvalidateCache` para determinar qué invalidar

**CacheKeyInterceptor** (`apps/api/src/common/interceptors/cache-key.interceptor.ts`):
- Genera keys de cache dinámicas basadas en parámetros de request

## Uso en Controladores

### Cachear respuestas GET

```typescript
import { CacheResult } from '../common/decorators/cache.decorator';

@Get()
@CacheResult(300, 'base-phases') // Cache por 5 minutos
async findAll(): Promise<BasePhaseResponseDto[]> {
  return this.service.findAll();
}

@Get(':id')
@CacheResult(300, 'base-phase') // Cache por 5 minutos
async findById(@Param('id') id: string): Promise<BasePhaseResponseDto> {
  return this.service.findById(id);
}
```

### Invalidar cache en mutaciones

```typescript
import { InvalidateCache } from '../common/decorators/cache.decorator';

@Post()
@InvalidateCache('base-phases:*') // Invalida todo el cache de base-phases
async create(@Body() dto: CreateBasePhaseDto): Promise<BasePhaseResponseDto> {
  return this.service.create(dto);
}

@Put(':id')
@InvalidateCache('base-phases:*', 'base-phase:*') // Invalida cache relacionado
async update(@Param('id') id: string, @Body() dto: UpdateBasePhaseDto) {
  return this.service.update(id, dto);
}

@Delete(':id')
@InvalidateCache('base-phases:*', 'base-phase:*')
async delete(@Param('id') id: string): Promise<void> {
  return this.service.delete(id);
}
```

### Usar CacheService directamente

```typescript
import { CacheService } from '../common/cache/cache.service';

@Injectable()
export class MyService {
  constructor(private cacheService: CacheService) {}

  async getCachedData(id: string) {
    const cacheKey = CacheService.generateKey('my-data', id);
    
    // Try cache first
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from source
    const data = await this.fetchData(id);
    
    // Store in cache
    await this.cacheService.set(cacheKey, data, 3600); // 1 hour
    
    return data;
  }
}
```

## Estrategias de Cache

### 1. Cache-aside (Lazy Loading)

```typescript
// El servicio verifica cache primero, luego fuente de datos
async findById(id: string) {
  const cacheKey = `entity:${id}`;
  const cached = await this.cacheService.get(cacheKey);
  if (cached) return cached;
  
  const entity = await this.repository.findById(id);
  await this.cacheService.set(cacheKey, entity, 300);
  return entity;
}
```

### 2. Write-through

```typescript
// Escribir en cache y fuente de datos simultáneamente
async create(dto: CreateDto) {
  const entity = await this.repository.create(dto);
  const cacheKey = `entity:${entity.id}`;
  await this.cacheService.set(cacheKey, entity, 300);
  return entity;
}
```

### 3. Write-behind (Write-back)

```typescript
// Escribir en cache primero, luego en fuente de datos asíncronamente
// (Requiere implementación adicional)
```

## Patrones de Invalidación

### Invalidación por Patrón

```typescript
// Invalidar todas las keys que coincidan con el patrón
@InvalidateCache('products:*', 'product:*')
async updateProduct(id: string, dto: UpdateDto) {
  // Después de actualizar, se invalidan:
  // - products:*
  // - product:*
}
```

### Invalidación Selectiva

```typescript
// Invalidar solo la key específica
async updateProduct(id: string, dto: UpdateDto) {
  const product = await this.service.update(id, dto);
  await this.cacheService.del(`product:${id}`);
  return product;
}
```

## Health Check de Cache

**Endpoint:** `GET /api/health/cache`

- Prueba la conexión de cache
- Realiza operaciones de lectura/escritura
- Retorna estado del cache

## Configuración

### Variables de Entorno

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-password  # Opcional
REDIS_DB=0
REDIS_TTL=3600  # 1 hour in seconds
REDIS_MAX_CONNECTIONS=10
```

### Docker Compose (Ejemplo)

```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes

volumes:
  redis-data:
```

## Fallback a In-Memory

Si Redis no está disponible o no está configurado:
- El sistema automáticamente usa cache en memoria
- No requiere cambios en el código
- Logs indican qué tipo de cache se está usando

## Beneficios

✅ **Performance**: Respuestas más rápidas para datos frecuentemente consultados
✅ **Reducción de carga**: Menos queries a la base de datos
✅ **Escalabilidad**: Redis puede ser compartido entre múltiples instancias
✅ **Resiliencia**: Fallback automático a cache en memoria
✅ **Flexibilidad**: Fácil configuración y uso con decoradores

## Mejores Prácticas

1. **TTL apropiado**: Usar TTL cortos para datos que cambian frecuentemente
2. **Invalidación proactiva**: Invalidar cache en mutaciones
3. **Keys consistentes**: Usar `CacheService.generateKey()` para keys uniformes
4. **Monitoreo**: Verificar health check de cache regularmente
5. **Patrones de invalidación**: Usar patrones para invalidar grupos relacionados

## Ejemplo Completo

```typescript
@Controller('products')
@UseInterceptors(CacheInvalidateInterceptor)
export class ProductController {
  constructor(
    private service: ProductService,
    private cacheService: CacheService,
  ) {}

  @Get()
  @CacheResult(300, 'products') // Cache 5 minutos
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @CacheResult(600, 'product') // Cache 10 minutos
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @InvalidateCache('products:*') // Invalida lista
  async create(@Body() dto: CreateDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @InvalidateCache('products:*', 'product:*') // Invalida lista y detalle
  async update(@Param('id') id: string, @Body() dto: UpdateDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @InvalidateCache('products:*', 'product:*')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
```

## Próximos Pasos

1. **Cache distribuido**: Usar Redis para cache compartido entre instancias
2. **Cache warming**: Pre-cargar datos frecuentes al iniciar
3. **Métricas de cache**: Monitorear hit/miss rates
4. **Cache por usuario**: Cache personalizado basado en roles/permisos
5. **Cache de sesiones**: Usar Redis para almacenar sesiones de usuario

La implementación de Redis para caching está completa y lista para usar.

