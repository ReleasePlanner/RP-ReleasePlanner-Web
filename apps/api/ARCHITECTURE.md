# Arquitectura de la API - Clean Architecture

## 📐 Estructura de Capas

La API sigue **Clean Architecture** con separación clara de responsabilidades:

### 1. Domain Layer (Capa de Dominio)
**Ubicación**: `{module}/domain/`

- **Responsabilidad**: Contiene las entidades del dominio y reglas de negocio puras
- **No depende de**: Ninguna otra capa
- **Contiene**:
  - Entidades del dominio
  - Validaciones de negocio
  - Enums y tipos del dominio

**Ejemplo**:
```typescript
export class BasePhase extends BaseEntity {
  name: string;
  color: string;
  
  validate(): void {
    // Reglas de negocio puras
  }
}
```

### 2. Application Layer (Capa de Aplicación)
**Ubicación**: `{module}/application/`

- **Responsabilidad**: Contiene la lógica de casos de uso y servicios
- **Depende de**: Domain Layer
- **Contiene**:
  - Servicios de aplicación
  - DTOs (Data Transfer Objects)
  - Interfaces de repositorio

**Ejemplo**:
```typescript
@Injectable()
export class BasePhaseService {
  async create(dto: CreateBasePhaseDto): Promise<BasePhaseResponseDto> {
    // Lógica de caso de uso
  }
}
```

### 3. Infrastructure Layer (Capa de Infraestructura)
**Ubicación**: `{module}/infrastructure/`

- **Responsabilidad**: Implementación de acceso a datos
- **Depende de**: Domain Layer y Application Layer
- **Contiene**:
  - Implementaciones de repositorios
  - Acceso a base de datos (futuro)
  - Integraciones externas

**Ejemplo**:
```typescript
@Injectable()
export class BasePhaseRepository extends BaseRepository<BasePhase> {
  // Implementación específica de acceso a datos
}
```

### 4. Presentation Layer (Capa de Presentación)
**Ubicación**: `{module}/presentation/`

- **Responsabilidad**: Manejo de HTTP y entrada/salida
- **Depende de**: Application Layer
- **Contiene**:
  - Controladores HTTP
  - Validación de entrada
  - Transformación de respuestas

**Ejemplo**:
```typescript
@Controller('base-phases')
export class BasePhaseController {
  @Post()
  async create(@Body() dto: CreateBasePhaseDto) {
    // Manejo HTTP
  }
}
```

## 🔄 Flujo de Datos

```
HTTP Request
    ↓
Presentation Layer (Controller)
    ↓
Application Layer (Service)
    ↓
Domain Layer (Entity/Validation)
    ↓
Infrastructure Layer (Repository)
    ↓
Data Source (In-Memory/Database)
```

## 🎯 Principios SOLID Aplicados

### Single Responsibility Principle (SRP)
Cada clase tiene una única responsabilidad:
- **Entity**: Representa un concepto del dominio
- **Service**: Implementa casos de uso
- **Repository**: Accede a datos
- **Controller**: Maneja HTTP

### Open/Closed Principle (OCP)
- Las entidades base (`BaseEntity`, `BaseRepository`) están abiertas para extensión
- Los servicios pueden extenderse sin modificar código existente

### Liskov Substitution Principle (LSP)
- Las implementaciones de repositorio son intercambiables
- Cualquier implementación de `IRepository` puede reemplazar a otra

### Interface Segregation Principle (ISP)
- Interfaces específicas por dominio (`IBasePhaseRepository`, `IProductRepository`)
- No se fuerza a implementar métodos innecesarios

### Dependency Inversion Principle (DIP)
- Los servicios dependen de abstracciones (`IRepository`)
- Las implementaciones concretas se inyectan mediante DI

## 🏗️ Patrones de Diseño

### Repository Pattern
Abstrae el acceso a datos:
```typescript
interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(entity: T): Promise<T>;
  // ...
}
```

### DTO Pattern
Separa la estructura de datos de la entidad:
```typescript
class CreateBasePhaseDto {
  name: string;
  color: string;
}
```

### Dependency Injection
NestJS maneja la inyección de dependencias automáticamente:
```typescript
constructor(
  @Inject('IRepository')
  private readonly repository: IRepository
) {}
```

### Factory Pattern (Implícito)
Las entidades se crean mediante constructores:
```typescript
const phase = new BasePhase(name, color);
```

## 📦 Estructura de Módulos

Cada módulo sigue la misma estructura:

```
{module}/
├── domain/
│   └── {entity}.entity.ts
├── application/
│   ├── dto/
│   │   ├── create-{entity}.dto.ts
│   │   ├── update-{entity}.dto.ts
│   │   └── {entity}-response.dto.ts
│   └── {entity}.service.ts
├── infrastructure/
│   └── {entity}.repository.ts
├── presentation/
│   └── {entity}.controller.ts
└── {module}.module.ts
```

## 🔒 Validación

### Nivel 1: Domain Layer
Validación de reglas de negocio en las entidades:
```typescript
validate(): void {
  if (!this.name) {
    throw new Error('Name is required');
  }
}
```

### Nivel 2: Application Layer
Validación de DTOs con `class-validator`:
```typescript
@IsString()
@IsNotEmpty()
name: string;
```

### Nivel 3: Presentation Layer
Validación automática mediante `ValidationPipe`:
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
}));
```

## 🚨 Manejo de Errores

### Excepciones de Negocio
```typescript
throw new NotFoundException('Resource', id);
throw new ConflictException('Duplicate resource');
throw new ValidationException('Invalid data');
```

### Filtro Global
Todas las excepciones se capturan y formatean consistentemente:
```typescript
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  // Formatea todas las respuestas de error
}
```

## 🔄 Transformación de Respuestas

Todas las respuestas se transforman mediante interceptor:
```typescript
{
  data: {...},
  statusCode: 200,
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

## 📊 Ventajas de esta Arquitectura

1. **Testabilidad**: Cada capa puede testearse independientemente
2. **Mantenibilidad**: Cambios en una capa no afectan otras
3. **Escalabilidad**: Fácil agregar nuevas funcionalidades
4. **Flexibilidad**: Cambiar implementaciones sin afectar lógica de negocio
5. **Claridad**: Separación clara de responsabilidades

## 🔮 Migración a Base de Datos

Cuando se migre a una base de datos real:

1. **Crear nuevas implementaciones de repositorio**:
   ```typescript
   @Injectable()
   export class BasePhaseDatabaseRepository implements IBasePhaseRepository {
     // Implementación con TypeORM/Prisma/etc.
   }
   ```

2. **Actualizar providers en el módulo**:
   ```typescript
   {
     provide: 'IBasePhaseRepository',
     useClass: BasePhaseDatabaseRepository, // Cambiar aquí
   }
   ```

3. **Sin cambios en servicios o controladores**: La lógica de negocio permanece igual

## 📚 Referencias

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [NestJS Documentation](https://docs.nestjs.com)

