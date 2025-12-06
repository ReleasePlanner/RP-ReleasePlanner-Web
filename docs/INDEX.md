# 📚 Índice de Documentación

> **Navegación completa** de toda la documentación del proyecto Release Planner.
>
> 💡 **Tip**: Usa `Ctrl+F` (o `Cmd+F` en Mac) para buscar rápidamente por palabras clave.

**📖 [Volver al README Principal](../README.md)**

---

Este es el índice completo de toda la documentación del proyecto Release Planner, organizada por categorías temáticas para facilitar la navegación y búsqueda.

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
- **[DOCKER_VERIFICATION.md](./ci-cd/DOCKER_VERIFICATION.md)** - Guía de verificación de Docker deployment
- **[DOCKER_VERIFICATION_SUMMARY.md](./ci-cd/DOCKER_VERIFICATION_SUMMARY.md)** - Resumen visual de verificación de Docker
- **[MOBILE_REMOVAL_AND_DOCKER_VERIFICATION.md](./ci-cd/MOBILE_REMOVAL_AND_DOCKER_VERIFICATION.md)** - Resumen de eliminación de mobile y verificación
- **[MONITORING_SETUP.md](./ci-cd/MONITORING_SETUP.md)** - Setup de monitoreo
- **[MONITORING_README.md](./ci-cd/MONITORING_README.md)** - Documentación de monitoreo
- **[JEST_VSCODE_SETUP.md](./ci-cd/JEST_VSCODE_SETUP.md)** - Configuración de Jest y VSCode

### 🔧 API (`api/`)
Documentación de la API NestJS:

- **[README.md](./api/README.md)** - Guía principal de la API
- **[ARCHITECTURE.md](./api/ARCHITECTURE.md)** - Arquitectura de la API
- **[DATABASE_MIGRATION.md](./api/DATABASE_MIGRATION.md)** - Guía de migración de base de datos
- **[MIGRATIONS_GUIDE.md](./api/MIGRATIONS_GUIDE.md)** - Guía de migraciones TypeORM
- **[MIGRATION_COMPLETE.md](./api/MIGRATION_COMPLETE.md)** - Resumen de migración completa
- **[MIGRATION_SETUP_COMPLETE.md](./api/MIGRATION_SETUP_COMPLETE.md)** - Setup de migraciones completo
- **[POSTGRESQL_MIGRATION_SUMMARY.md](./api/POSTGRESQL_MIGRATION_SUMMARY.md)** - Resumen de migración PostgreSQL
- **[VERIFICATION.md](./api/VERIFICATION.md)** - Verificación de la API
- **[COVERAGE_PROGRESS.md](./api/COVERAGE_PROGRESS.md)** - Progreso de cobertura de tests
- **[ENTITY_DATABASE_COMPARISON.md](./api/ENTITY_DATABASE_COMPARISON.md)** - Comparación de entidades con base de datos
- **[ANY_USAGE_REPORT.md](./api/ANY_USAGE_REPORT.md)** - Reporte de uso de tipos `any`

### 🎨 Portal (`portal/`)
Documentación del Portal React:

- **[PORTAL_ARCHITECTURE.md](./portal/PORTAL_ARCHITECTURE.md)** - Arquitectura del Portal
- **[API_INTEGRATION_GUIDE.md](./portal/API_INTEGRATION_GUIDE.md)** - Guía de integración con API
- **[FRONTEND_API_INTEGRATION.md](./portal/FRONTEND_API_INTEGRATION.md)** - Integración frontend con API
- **[FRONTEND_API_SETUP_COMPLETE.md](./portal/FRONTEND_API_SETUP_COMPLETE.md)** - Setup completo de integración frontend
- **[TESTING_SUMMARY.md](./portal/TESTING_SUMMARY.md)** - Resumen de tests del Portal

### 📦 Apps (`apps/`)
Documentación técnica específica de aplicaciones:

#### Portal (`apps/portal/`)
- **[builders-README.md](./apps/portal/builders-README.md)** - Patrón Builder
- **[constants-README.md](./apps/portal/constants-README.md)** - Sistema de constantes
- **[gantt-chart-README.md](./apps/portal/gantt-chart-README.md)** - Componente Gantt Chart
- **[gantt-timeline-README.md](./apps/portal/gantt-timeline-README.md)** - Componente Timeline
- **[phase-README.md](./apps/portal/phase-README.md)** - Componente de fases
- **[timeline-README.md](./apps/portal/timeline-README.md)** - Timeline optimizado
- **[logging-README.md](./apps/portal/logging-README.md)** - Sistema de logging
- **[logging-implementation-summary.md](./apps/portal/logging-implementation-summary.md)** - Implementación de logging
- **[logging-usage.md](./apps/portal/logging-usage.md)** - Uso del sistema de logging
- **[release-plans-refactoring-summary.md](./apps/portal/release-plans-refactoring-summary.md)** - Refactorización de Release Plans

#### API (`apps/api/`)
- **[constants-README.md](./apps/api/constants-README.md)** - Constantes de la API
- **[migrations-README.md](./apps/api/migrations-README.md)** - Migraciones de la API

### 📄 Documentación General (`root/`)
Análisis, optimizaciones y documentación general del proyecto:

- **[AGENTS.md](./root/AGENTS.md)** - Guías para trabajar con Nx y agentes
- **[ANALISIS_OPTIMIZACION_RELEASE_PLANNER.md](./root/ANALISIS_OPTIMIZACION_RELEASE_PLANNER.md)** - Análisis de optimización
- **[ANALISIS_REFACTORIZACION_RELEASE_PLAN.md](./root/ANALISIS_REFACTORIZACION_RELEASE_PLAN.md)** - Análisis de refactorización
- **[ANALISIS_REFACTORIZACION_TIMELINE.md](./root/ANALISIS_REFACTORIZACION_TIMELINE.md)** - Análisis de refactorización del Timeline
- **[DEBUG_RESCHEDULE.md](./root/DEBUG_RESCHEDULE.md)** - Debug de reschedules
- **[IMPLEMENTACION_TIMELINE_OPTIMIZADO.md](./root/IMPLEMENTACION_TIMELINE_OPTIMIZADO.md)** - Implementación del Timeline optimizado
- **[OPTIMIZACIONES_ADICIONALES_PROPUESTAS.md](./root/OPTIMIZACIONES_ADICIONALES_PROPUESTAS.md)** - Optimizaciones adicionales propuestas
- **[OPTIMIZACIONES_APLICADAS_GANTTCHART.md](./root/OPTIMIZACIONES_APLICADAS_GANTTCHART.md)** - Optimizaciones aplicadas al Gantt Chart
- **[OPTIMIZACIONES_AVANZADAS_IMPLEMENTADAS.md](./root/OPTIMIZACIONES_AVANZADAS_IMPLEMENTADAS.md)** - Optimizaciones avanzadas implementadas
- **[OPTIMIZACIONES_FINALES_IMPLEMENTADAS.md](./root/OPTIMIZACIONES_FINALES_IMPLEMENTADAS.md)** - Optimizaciones finales implementadas
- **[PROGRESS_BAR_IMPLEMENTACION.md](./root/PROGRESS_BAR_IMPLEMENTACION.md)** - Implementación de la barra de progreso
- **[PROPUESTA_REFACTORIZACION_TIMELINE.md](./root/PROPUESTA_REFACTORIZACION_TIMELINE.md)** - Propuesta de refactorización del Timeline
- **[RESCHEDULE_ATOMICO_IMPLEMENTACION.md](./root/RESCHEDULE_ATOMICO_IMPLEMENTACION.md)** - Implementación de reschedules atómicos
- **[RESUMEN_COMPLETO_OPTIMIZACIONES.md](./root/RESUMEN_COMPLETO_OPTIMIZACIONES.md)** - Resumen completo de optimizaciones
- **[RESUMEN_OPTIMIZACIONES_FINALES.md](./root/RESUMEN_OPTIMIZACIONES_FINALES.md)** - Resumen de optimizaciones finales
- **[VERIFICACION_RESCHEDULES.md](./root/VERIFICACION_RESCHEDULES.md)** - Verificación de reschedules

### 📚 Librerías (`libs/`)
Documentación de librerías compartidas:

- **[rp-shared-README.md](./libs/rp-shared-README.md)** - Librería compartida principal
- **[rp-shared-CHANGELOG.md](./libs/rp-shared-CHANGELOG.md)** - Historial de cambios
- **[rp-shared-MIGRATION.md](./libs/rp-shared-MIGRATION.md)** - Guía de migración
- **[shared-types-README.md](./libs/shared-types-README.md)** - Tipos TypeScript compartidos
- **[shared-utils-README.md](./libs/shared-utils-README.md)** - Utilidades compartidas
- **[api-common-README.md](./libs/api-common-README.md)** - Módulos comunes de NestJS

### 🛠️ Scripts (`scripts/`)
Documentación de scripts de utilidad:

- **[README-remove-duplicates.md](./scripts/README-remove-duplicates.md)** - Script para eliminar duplicados
- **[README-docker-verification.md](./scripts/README-docker-verification.md)** - Documentación de scripts de verificación de Docker

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
- `ci-cd/DOCKER_*`
- `helm/README.md`

### Caching
- `architecture/REDIS_*`

### Resiliencia
- `architecture/RESILIENCE_*`

### Frontend
- `portal/*`

## 📖 Guías de Inicio Rápido por Rol

### 👨‍💻 Para Desarrolladores Nuevos
1. **[Arquitectura General](./architecture/IMPLEMENTATION_COMPLETE.md)** - Entender el sistema completo
2. **[Arquitectura del Portal](./portal/PORTAL_ARCHITECTURE.md)** - Estructura del frontend
3. **[Arquitectura de la API](./api/ARCHITECTURE.md)** - Estructura del backend
4. **[Setup CI/CD](./ci-cd/CI_CD_SETUP.md)** - Configurar entorno de desarrollo
5. **[Monorepo Nx](./architecture/README_NX.md)** - Comandos y estructura Nx

### 🔧 Para DevOps
1. **[Revisión de Despliegue](./ci-cd/DEPLOYMENT_REVIEW.md)** - Checklist de despliegue
2. **[Setup CI/CD](./ci-cd/CI_CD_SETUP.md)** - Configuración CI/CD
3. **[Helm Charts](./helm/README.md)** - Despliegue en Kubernetes
4. **[Docker](./ci-cd/README.DOCKER.md)** - Containerización
5. **[Monitoreo](./ci-cd/MONITORING_SETUP.md)** - Setup de monitoreo

### 🏛️ Para Arquitectos
1. **[Arquitectura General](./architecture/IMPLEMENTATION_COMPLETE.md)** - Visión completa
2. **[Resiliencia y Monitoreo](./architecture/RESILIENCE_AND_MONITORING_SUMMARY.md)** - Estrategias de resiliencia
3. **[OWASP y Optimización](./architecture/OWASP_AND_OPTIMIZATION_SUMMARY.md)** - Seguridad y optimización
4. **[Clean Architecture API](./api/ARCHITECTURE.md)** - Arquitectura limpia
5. **[Refactorización](./apps/portal/release-plans-refactoring-summary.md)** - Patrones aplicados

### 🧪 Para QA/Testing
1. **[Testing Portal](./portal/TESTING_SUMMARY.md)** - Tests del Portal
2. **[Tests de Seguridad](./architecture/SECURITY_TESTS_IMPLEMENTATION.md)** - Tests de seguridad
3. **[Coverage Progress](./api/COVERAGE_PROGRESS.md)** - Cobertura de tests
4. **[Setup Jest/VSCode](./ci-cd/JEST_VSCODE_SETUP.md)** - Configuración de testing

## 📝 Notas

- Los `README.md` en subdirectorios del código fuente se mantienen en sus ubicaciones originales
- Esta documentación está organizada por temas, no por estructura de código
- Para documentación técnica específica de componentes, consulta los README.md en cada módulo
- **📖 [Ver README Principal](../README.md)** para información general del proyecto

## 🔍 Búsqueda Rápida

### Por Tecnología
- **React**: `portal/*`, `apps/portal/*`
- **NestJS**: `api/*`, `apps/api/*`
- **PostgreSQL**: `api/DATABASE_*`, `api/MIGRATION_*`
- **Docker**: `ci-cd/README.DOCKER.md`, `architecture/CONTAINERIZATION_*`
- **Kubernetes**: `helm/*`, `ci-cd/DEPLOYMENT_*`
- **Redis**: `architecture/REDIS_*`
- **Nx**: `architecture/README_NX.md`

### Por Funcionalidad
- **Gantt Chart**: `apps/portal/gantt-*`, `apps/portal/timeline-*`
- **Autenticación**: `architecture/AUTHENTICATION_*`
- **Seguridad**: `architecture/SECURITY_*`, `architecture/OWASP_*`
- **Optimización**: `root/OPTIMIZACIONES_*`, `root/RESUMEN_*`
- **Refactorización**: `apps/portal/release-plans-refactoring-summary.md`, `root/ANALISIS_*`

### Por Tipo de Documento
- **Guías**: `*_GUIDE.md`, `*_SETUP*.md`
- **Resúmenes**: `*_SUMMARY.md`, `*_COMPLETE.md`
- **Implementaciones**: `*_IMPLEMENTATION.md`, `*_IMPLEMENTACION.md`
- **Análisis**: `ANALISIS_*`, `*_REPORT.md`

