# Índice de Documentación

Este es el índice completo de toda la documentación del proyecto Release Planner.

## 📚 Documentación por Categoría

### 🏗️ Arquitectura (`architecture/`)
Documentación arquitectónica y de implementación general:

- **[IMPLEMENTATION_COMPLETE.md](./architecture/IMPLEMENTATION_COMPLETE.md)** - Resumen completo de todas las implementaciones
- **[AUTHENTICATION_COMPLETE.md](./architecture/AUTHENTICATION_COMPLETE.md)** - Implementación completa de autenticación
- **[AUTHENTICATION_IMPLEMENTATION.md](./architecture/AUTHENTICATION_IMPLEMENTATION.md)** - Detalles de implementación de autenticación
- **[FRONTEND_AUTHENTICATION_SUMMARY.md](./architecture/FRONTEND_AUTHENTICATION_SUMMARY.md)** - Resumen de autenticación frontend
- **[REDIS_CACHING_IMPLEMENTATION.md](./architecture/REDIS_CACHING_IMPLEMENTATION.md)** - Implementación de Redis para caching
- **[SECURITY_TESTS_IMPLEMENTATION.md](./architecture/SECURITY_TESTS_IMPLEMENTATION.md)** - Tests de seguridad implementados
- **[RESILIENCE_AND_MONITORING_SUMMARY.md](./architecture/RESILIENCE_AND_MONITORING_SUMMARY.md)** - Resiliencia y monitoreo
- **[OWASP_AND_OPTIMIZATION_SUMMARY.md](./architecture/OWASP_AND_OPTIMIZATION_SUMMARY.md)** - Seguridad OWASP y optimización
- **[CONTAINERIZATION_SUMMARY.md](./architecture/CONTAINERIZATION_SUMMARY.md)** - Resumen de containerización
- **[README_NX.md](./architecture/README_NX.md)** - Documentación del monorepo Nx

### 🚀 CI/CD y Despliegue (`ci-cd/`)
Documentación de integración continua y despliegue:

- **[CI_CD_SETUP.md](./ci-cd/CI_CD_SETUP.md)** - Guía completa de configuración CI/CD
- **[DEPLOYMENT_REVIEW.md](./ci-cd/DEPLOYMENT_REVIEW.md)** - Revisión de configuración de despliegue
- **[DEPLOYMENT.md](./ci-cd/DEPLOYMENT.md)** - Guía de despliegue
- **[README.DOCKER.md](./ci-cd/README.DOCKER.md)** - Documentación de Docker

### 🔧 API (`api/`)
Documentación de la API NestJS:

- **[ARCHITECTURE.md](./api/ARCHITECTURE.md)** - Arquitectura de la API
- **[DATABASE_MIGRATION.md](./api/DATABASE_MIGRATION.md)** - Guía de migración de base de datos
- **[MIGRATIONS_GUIDE.md](./api/MIGRATIONS_GUIDE.md)** - Guía de migraciones TypeORM
- **[MIGRATION_COMPLETE.md](./api/MIGRATION_COMPLETE.md)** - Resumen de migración completa
- **[MIGRATION_SETUP_COMPLETE.md](./api/MIGRATION_SETUP_COMPLETE.md)** - Setup de migraciones completo
- **[POSTGRESQL_MIGRATION_SUMMARY.md](./api/POSTGRESQL_MIGRATION_SUMMARY.md)** - Resumen de migración PostgreSQL
- **[VERIFICATION.md](./api/VERIFICATION.md)** - Verificación de la API

### 🎨 Portal (`portal/`)
Documentación del Portal React:

- **[PORTAL_ARCHITECTURE.md](./portal/PORTAL_ARCHITECTURE.md)** - Arquitectura del Portal
- **[API_INTEGRATION_GUIDE.md](./portal/API_INTEGRATION_GUIDE.md)** - Guía de integración con API
- **[FRONTEND_API_INTEGRATION.md](./portal/FRONTEND_API_INTEGRATION.md)** - Integración frontend con API
- **[FRONTEND_API_SETUP_COMPLETE.md](./portal/FRONTEND_API_SETUP_COMPLETE.md)** - Setup completo de integración frontend

### ☸️ Helm (`helm/`)
Documentación de Helm Charts:

- **[README.md](./helm/README.md)** - Documentación del Helm Chart

### 📜 Legacy Portal (`legacy-portal/`)
Documentación histórica del portal legacy (solo referencia):

- Documentación pre-migración a monorepo Nx
- Guías de desarrollo histórico
- Patrones y arquitectura legacy

> ⚠️ **Nota**: Esta documentación es histórica. La aplicación activa está en `apps/portal/`.

## 🔍 Búsqueda Rápida por Tema

### Autenticación y Seguridad
- `architecture/AUTHENTICATION_*`
- `architecture/SECURITY_*`
- `architecture/OWASP_*`

### Base de Datos
- `api/DATABASE_*`
- `api/MIGRATION_*`
- `api/POSTGRESQL_*`

### Despliegue
- `ci-cd/DEPLOYMENT_*`
- `ci-cd/CI_CD_*`
- `helm/README.md`

### Caching
- `architecture/REDIS_*`

### Resiliencia
- `architecture/RESILIENCE_*`

### Frontend
- `portal/*`

## 📖 Guías de Inicio Rápido

### Para Nuevos Desarrolladores
1. Lee `architecture/IMPLEMENTATION_COMPLETE.md` para entender el proyecto completo
2. Revisa `api/ARCHITECTURE.md` y `portal/PORTAL_ARCHITECTURE.md` para la arquitectura
3. Consulta `ci-cd/CI_CD_SETUP.md` para configurar el entorno de desarrollo

### Para DevOps
1. `ci-cd/DEPLOYMENT_REVIEW.md` - Revisión de despliegue
2. `ci-cd/CI_CD_SETUP.md` - Configuración CI/CD
3. `helm/README.md` - Despliegue con Helm

### Para Arquitectos
1. `architecture/IMPLEMENTATION_COMPLETE.md` - Visión general
2. `architecture/RESILIENCE_AND_MONITORING_SUMMARY.md` - Resiliencia
3. `architecture/OWASP_AND_OPTIMIZATION_SUMMARY.md` - Seguridad y optimización

## 📝 Notas

- Los `README.md` en subdirectorios del código fuente se mantienen en sus ubicaciones originales
- Esta documentación está organizada por temas, no por estructura de código
- Para documentación técnica específica de componentes, consulta los README.md en cada módulo

