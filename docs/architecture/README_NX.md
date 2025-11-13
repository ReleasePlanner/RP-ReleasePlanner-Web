# Release Planner - Nx Monorepo

Este proyecto ha sido migrado a un monorepo Nx, manteniendo la aplicación web existente y agregando nuevas capacidades.

## 📁 Estructura del Proyecto

```
RP-ReleasePlanner-Web/
├── apps/
│   ├── portal/          # Aplicación web React (existente, migrada)
│   └── api/             # API REST con NestJS (nueva)
├── libs/
│   ├── shared/
│   │   ├── types/       # Tipos TypeScript compartidos
│   │   └── utils/       # Utilidades compartidas (TS/JS)
│   └── api/
│       └── common/      # Módulos comunes de NestJS
└── portal/              # Código original (mantener como referencia)
```

## 🚀 Comandos Disponibles

### Desarrollo
```bash
# Ejecutar portal en modo desarrollo
nx serve portal
# o
npm run dev

# Ejecutar API en modo desarrollo
nx serve api

# Ejecutar ambos en paralelo
nx run-many --target=serve --projects=portal,api
```

### Build
```bash
# Build de todas las aplicaciones
nx build portal
nx build api

# Build de todo el monorepo
npm run build
```

### Testing
```bash
# Tests de una aplicación específica
nx test portal
nx test api

# Tests de todas las aplicaciones
npm run test

# Tests con coverage
nx test portal --coverage
```

### Linting
```bash
# Lint de una aplicación específica
nx lint portal
nx lint api

# Lint de todo el monorepo
npm run lint
```

## 📦 Aplicaciones

### Portal (apps/portal)
Aplicación web React existente migrada a Nx. Mantiene toda su funcionalidad original.

- **Tecnologías**: React, Vite, Material-UI, Redux Toolkit
- **Puerto**: 5173
- **Comando**: `nx serve portal`

### API (apps/api)
Nueva API REST construida con NestJS siguiendo las mejores prácticas.

- **Tecnologías**: NestJS, TypeScript
- **Puerto**: 3000
- **Endpoint base**: `/api`
- **Comando**: `nx serve api`

#### Características de la API:
- ✅ Validación global con `class-validator`
- ✅ CORS habilitado
- ✅ Transformación automática de DTOs
- ✅ Logging estructurado
- ✅ Health check endpoint (`/api/health`)

## 📚 Librerías

### @rp-release-planner/shared/types
Tipos TypeScript compartidos entre aplicaciones.

```typescript
import { PlanPhase, PlanStatus } from '@rp-release-planner/shared/types';
```

### @rp-release-planner/shared/utils
Utilidades compartidas (TypeScript/JavaScript puro).

```typescript
import { formatDate, calculateDuration } from '@rp-release-planner/shared/utils';
```

### @rp-release-planner/api/common
Módulos comunes de NestJS (guards, interceptors, decorators, etc.).

```typescript
import { ApiCommonModule } from '@rp-release-planner/api/common';
```

## 🔧 Configuración

### TypeScript Paths
Los paths están configurados en `tsconfig.base.json`:

```json
{
  "paths": {
    "@rp-release-planner/shared/types": ["libs/shared/types/src/index.ts"],
    "@rp-release-planner/shared/utils": ["libs/shared/utils/src/index.ts"],
    "@rp-release-planner/api/common": ["libs/api/common/src/index.ts"]
  }
}
```

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# API
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database (cuando se configure)
DATABASE_URL=postgresql://user:password@localhost:5432/release_planner
```

## 📝 Próximos Pasos

1. **Migrar tipos compartidos** a `libs/shared/types`
2. **Migrar utilidades** a `libs/shared/utils`
3. **Implementar módulos de la API**:
   - Release Plans Module
   - Phases Module
   - Products Module
   - Features Module
4. **Configurar base de datos** (PostgreSQL recomendado)
5. **Implementar autenticación** (JWT)
6. **Agregar documentación API** (Swagger/OpenAPI)

## 🛠️ Generar Nuevos Componentes

### Generar un módulo NestJS
```bash
nx g @nx/nest:module release-plans --directory=apps/api/src/release-plans
nx g @nx/nest:controller release-plans --directory=apps/api/src/release-plans
nx g @nx/nest:service release-plans --directory=apps/api/src/release-plans
```

### Generar una librería compartida
```bash
nx g @nx/js:library --name=my-library --directory=libs/shared/my-library
```

## 📖 Documentación Adicional

- [Nx Documentation](https://nx.dev)
- [NestJS Documentation](https://docs.nestjs.com)
- [React Documentation](https://react.dev)

