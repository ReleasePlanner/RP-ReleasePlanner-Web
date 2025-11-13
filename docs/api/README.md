# Release Planner API

API REST construida con NestJS siguiendo Clean Architecture, SOLID principles y mejores prácticas.

## 🏗️ Arquitectura

La API sigue **Clean Architecture** con separación clara de capas:

```
apps/api/src/
├── common/                    # Código compartido
│   ├── base/                  # Clases base (Entity, Repository)
│   ├── exceptions/            # Excepciones de negocio
│   ├── filters/               # Filtros globales
│   ├── interceptors/          # Interceptores
│   └── interfaces/            # Interfaces compartidas
├── {module}/                  # Módulos de dominio
│   ├── domain/                # Capa de dominio (entidades)
│   ├── application/           # Capa de aplicación (servicios, DTOs)
│   ├── infrastructure/        # Capa de infraestructura (repositorios)
│   └── presentation/          # Capa de presentación (controladores)
└── app/                       # Módulo principal
```

## 📦 Módulos

### 1. Base Phases (`/api/base-phases`)
Gestión de fases base del sistema.

**Endpoints:**
- `GET /api/base-phases` - Listar todas las fases base
- `GET /api/base-phases/:id` - Obtener fase base por ID
- `POST /api/base-phases` - Crear nueva fase base
- `PUT /api/base-phases/:id` - Actualizar fase base
- `DELETE /api/base-phases/:id` - Eliminar fase base

**Reglas de Negocio:**
- El nombre de la fase debe ser único
- El color de la fase debe ser único
- El color debe ser un formato hex válido

### 2. Products (`/api/products`)
Gestión de productos y sus componentes.

**Endpoints:**
- `GET /api/products` - Listar todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

**Reglas de Negocio:**
- El nombre del producto debe ser único
- Cada tipo de componente (web, services, mobile) solo puede aparecer una vez por producto

### 3. Features (`/api/features`)
Gestión de features de productos.

**Endpoints:**
- `GET /api/features` - Listar todas las features
- `GET /api/features?productId=xxx` - Listar features por producto
- `GET /api/features/:id` - Obtener feature por ID
- `POST /api/features` - Crear nueva feature
- `PUT /api/features/:id` - Actualizar feature
- `DELETE /api/features/:id` - Eliminar feature

**Reglas de Negocio:**
- El nombre de la feature debe ser único
- La feature debe estar asociada a un producto válido

### 4. Calendars (`/api/calendars`)
Gestión de calendarios, días festivos y días especiales.

**Endpoints:**
- `GET /api/calendars` - Listar todos los calendarios
- `GET /api/calendars/:id` - Obtener calendario por ID
- `POST /api/calendars` - Crear nuevo calendario
- `PUT /api/calendars/:id` - Actualizar calendario
- `DELETE /api/calendars/:id` - Eliminar calendario

**Reglas de Negocio:**
- El nombre del calendario debe ser único
- Las fechas deben estar en formato YYYY-MM-DD

### 5. IT Owners (`/api/it-owners`)
Gestión de propietarios IT.

**Endpoints:**
- `GET /api/it-owners` - Listar todos los propietarios IT
- `GET /api/it-owners/:id` - Obtener propietario IT por ID
- `POST /api/it-owners` - Crear nuevo propietario IT
- `PUT /api/it-owners/:id` - Actualizar propietario IT
- `DELETE /api/it-owners/:id` - Eliminar propietario IT

**Reglas de Negocio:**
- El nombre del propietario IT debe ser único

### 6. Release Plans (`/api/plans`)
Gestión de planes de release (módulo principal).

**Endpoints:**
- `GET /api/plans` - Listar todos los planes
- `GET /api/plans/:id` - Obtener plan por ID
- `POST /api/plans` - Crear nuevo plan
- `PUT /api/plans/:id` - Actualizar plan
- `DELETE /api/plans/:id` - Eliminar plan

**Reglas de Negocio:**
- El nombre del plan debe ser único
- La fecha de inicio debe ser anterior o igual a la fecha de fin
- Las fases deben tener fechas válidas
- Las tareas deben tener fechas válidas

## 🔧 Principios Aplicados

### SOLID
- **S**ingle Responsibility: Cada clase tiene una única responsabilidad
- **O**pen/Closed: Abierto para extensión, cerrado para modificación
- **L**iskov Substitution: Las implementaciones son intercambiables
- **I**nterface Segregation: Interfaces específicas y pequeñas
- **D**ependency Inversion: Dependencias hacia abstracciones

### Clean Architecture
- **Domain Layer**: Entidades y reglas de negocio puras
- **Application Layer**: Casos de uso y servicios
- **Infrastructure Layer**: Acceso a datos
- **Presentation Layer**: Controladores HTTP

### Design Patterns
- **Repository Pattern**: Abstracción del acceso a datos
- **DTO Pattern**: Transferencia de datos
- **Dependency Injection**: Inversión de control
- **Factory Pattern**: Creación de entidades

### Clean Code
- Nombres descriptivos
- Funciones pequeñas y enfocadas
- Comentarios solo cuando son necesarios
- Validación en múltiples capas

### YAGNI (You Aren't Gonna Need It)
- Solo se implementa lo necesario
- Sin sobre-ingeniería
- Código simple y directo

### DRY (Don't Repeat Yourself)
- Clases base reutilizables
- Utilidades compartidas
- Código común extraído

## 🚀 Ejecución

```bash
# Desarrollo
npm run dev:api
# o
nx serve api

# Build
nx build api

# Tests
nx test api
```

## 📝 Validación

La API utiliza `class-validator` para validación automática de DTOs:

- Validación de tipos
- Validación de formatos (fechas, emails, etc.)
- Validación de requeridos
- Validación de enums

## 🔒 Manejo de Errores

- Excepciones de negocio personalizadas
- Filtro global de excepciones HTTP
- Respuestas consistentes
- Logging estructurado

## 📊 Respuestas

Todas las respuestas siguen un formato consistente:

```json
{
  "data": {...},
  "statusCode": 200,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔄 Próximos Pasos

- [ ] Integración con base de datos (PostgreSQL)
- [ ] Autenticación y autorización (JWT)
- [ ] Documentación API (Swagger/OpenAPI)
- [ ] Tests unitarios y de integración
- [ ] Caching (Redis)
- [ ] Rate limiting
- [ ] Logging estructurado avanzado
- [ ] Health checks
- [ ] Métricas y monitoring

## 📚 Documentación Adicional

- [NestJS Documentation](https://docs.nestjs.com)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

