# 🚀 Release Planner System

> **Sistema completo de gestión de planes de release** con Portal Web, API REST e infraestructura de despliegue.

[![Nx](https://img.shields.io/badge/Nx-22.0.3-blue)](https://nx.dev)
[![React](https://img.shields.io/badge/React-19.0-blue)](https://react.dev)
[![NestJS](https://img.shields.io/badge/NestJS-11.1-red)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org)

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Inicio Rápido](#-inicio-rápido)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación Completa](#-documentación-completa)
- [Tecnologías](#-tecnologías)
- [Scripts Disponibles](#-scripts-disponibles)
- [Git Flow Workflow](#-git-flow-workflow)
- [Contribuir](#-contribuir)

---

## 🎯 Descripción General

**Release Planner** es un sistema completo para la gestión de planes de release, productos, features, calendarios y propietarios IT. El sistema está construido como un **monorepo Nx** que incluye:

- **🌐 Portal Web** (`apps/portal`): Aplicación React moderna con visualización tipo Gantt
- **🔌 API REST** (`apps/api`): Backend NestJS siguiendo Clean Architecture
- **📦 Librerías Compartidas** (`libs/`): Tipos, utilidades y módulos comunes

### Características Clave

- ✅ **Visualización Gantt Interactiva**: Gestión visual de fases y tareas con drag & drop
- ✅ **Gestión de Fases**: Creación, edición y organización de fases de release
- ✅ **Gestión de Productos**: Administración completa de productos y componentes
- ✅ **Calendarios**: Soporte para múltiples calendarios y zonas horarias
- ✅ **Autenticación y Seguridad**: Sistema completo de autenticación con JWT
- ✅ **Resiliencia**: Circuit breakers, retries y manejo de errores robusto
- ✅ **Monitoreo**: Integración con Prometheus y Grafana

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

#### Frontend (Portal)

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **UI Framework**: Material-UI (MUI) v7
- **State Management**: Redux Toolkit + TanStack Query
- **Routing**: React Router v6
- **Styling**: Material-UI `sx` prop + Tailwind CSS

#### Backend (API)

- **Framework**: NestJS 11
- **ORM**: TypeORM con PostgreSQL
- **Validación**: class-validator + class-transformer
- **Autenticación**: JWT + Guards
- **Documentación**: Swagger/OpenAPI

#### Infraestructura

- **Monorepo**: Nx 22
- **Containerización**: Docker + Docker Compose
- **Orquestación**: Kubernetes (Helm Charts)
- **CI/CD**: GitHub Actions (configurable)

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      Release Planner System                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐                         ┌──────────────┐ │
│  │ Portal Web   │◄────────────────────────┤   API REST   │ │
│  │  (React)     │                         │  (NestJS)    │ │
│  └──────────────┘                         └──────┬───────┘ │
│                                                   │         │
│                                         ┌─────────▼─────────┐
│                                         │   PostgreSQL DB   │
│                                         └───────────────────┘
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   Redis      │    │  Prometheus  │    │   Grafana    │ │
│  │  (Cache)     │    │ (Metrics)    │    │ (Dashboards) │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Docker** (opcional, para desarrollo con contenedores)
- **PostgreSQL** (si no usas Docker)

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd RP-ReleasePlanner-Web

# Instalar dependencias
npm install

# Configurar variables de entorno (ver docs/api/README.md)
cp apps/api/.env.example apps/api/.env
```

### Desarrollo

```bash
# Ejecutar Portal Web (puerto 5173)
npm run dev
# o
nx serve portal

# Ejecutar API (puerto 3000)
npm run dev:api
# o
nx serve api

# Ejecutar ambos en paralelo
npm run dev:all
```

### Build

```bash
# Build de todas las aplicaciones
npm run build

# Build específico
npm run build:portal
npm run build:api
```

### Testing

```bash
# Ejecutar todos los tests
npm run test

# Tests con coverage
npm run test:coverage

# Tests específicos
npm run test:portal
npm run test:api
```

---

## 📁 Estructura del Proyecto

```
RP-ReleasePlanner-Web/
├── apps/
│   ├── portal/          # Portal Web React
│   ├── api/             # API REST NestJS
│   └── portal-e2e/      # Tests end-to-end
├── libs/
│   ├── shared/
│   │   ├── types/       # Tipos TypeScript compartidos
│   │   └── utils/       # Utilidades compartidas
│   ├── api/
│   │   └── common/      # Módulos comunes NestJS
│   └── rp-shared/       # Validadores y utilidades compartidas
├── docs/                # 📚 Documentación completa
│   ├── api/            # Documentación de la API
│   ├── portal/         # Documentación del Portal
│   ├── architecture/   # Arquitectura y diseño
│   ├── ci-cd/         # CI/CD y despliegue
│   └── ...
├── scripts/            # Scripts de utilidad
├── helm/               # Helm charts para Kubernetes
├── monitoring/         # Configuración de monitoreo
└── docker-compose.yml  # Configuración Docker Compose
```

---

## 📚 Documentación Completa

> 📖 **Toda la documentación está organizada en el directorio [`docs/`](./docs/)**. Consulta el [Índice de Documentación](./docs/INDEX.md) para navegación completa.

### 🗺️ Navegación Rápida por Temas

#### 🏗️ Arquitectura y Diseño

- **[Arquitectura General](./docs/architecture/IMPLEMENTATION_COMPLETE.md)** - Visión completa del sistema
- **[Arquitectura del Portal](./docs/portal/PORTAL_ARCHITECTURE.md)** - Estructura y componentes del Portal Web
- **[Arquitectura de la API](./docs/api/ARCHITECTURE.md)** - Clean Architecture y estructura de la API
- **[Monorepo Nx](./docs/architecture/README_NX.md)** - Guía del monorepo y comandos Nx
- **[Refactorización Release Plans](./docs/apps/portal/release-plans-refactoring-summary.md)** - Resumen de refactorización

#### 🔌 API y Backend

- **[Guía de la API](./docs/api/README.md)** - Endpoints y funcionalidades
- **[Guía de Migraciones](./docs/api/MIGRATIONS_GUIDE.md)** - Migraciones de base de datos
- **[Migración PostgreSQL](./docs/api/POSTGRESQL_MIGRATION_SUMMARY.md)** - Resumen de migración
- **[Verificación API](./docs/api/VERIFICATION.md)** - Checklist de verificación

#### 🌐 Portal Web

- **[Arquitectura del Portal](./docs/portal/PORTAL_ARCHITECTURE.md)** - Componentes y estructura
- **[Integración con API](./docs/portal/API_INTEGRATION_GUIDE.md)** - Cómo integrar con el backend
- **[Setup Frontend](./docs/portal/FRONTEND_API_SETUP_COMPLETE.md)** - Configuración completa
- **[Componentes Gantt](./docs/apps/portal/gantt-chart-README.md)** - Documentación del Gantt Chart
- **[Timeline](./docs/apps/portal/gantt-timeline-README.md)** - Componente Timeline
- **[Logging](./docs/apps/portal/logging-README.md)** - Sistema de logging

#### 🔐 Seguridad y Autenticación

- **[Autenticación Completa](./docs/architecture/AUTHENTICATION_COMPLETE.md)** - Sistema de autenticación
- **[Implementación Auth](./docs/architecture/AUTHENTICATION_IMPLEMENTATION.md)** - Detalles técnicos
- **[Auth Frontend](./docs/architecture/FRONTEND_AUTHENTICATION_SUMMARY.md)** - Autenticación en el Portal
- **[Tests de Seguridad](./docs/architecture/SECURITY_TESTS_IMPLEMENTATION.md)** - Tests implementados
- **[OWASP y Optimización](./docs/architecture/OWASP_AND_OPTIMIZATION_SUMMARY.md)** - Seguridad y optimización

#### 🚀 CI/CD y Despliegue

- **[Setup CI/CD](./docs/ci-cd/CI_CD_SETUP.md)** - Configuración completa
- **[Guía de Despliegue](./docs/ci-cd/DEPLOYMENT.md)** - Proceso de despliegue
- **[Revisión de Despliegue](./docs/ci-cd/DEPLOYMENT_REVIEW.md)** - Checklist de despliegue
- **[Docker](./docs/ci-cd/README.DOCKER.md)** - Containerización
- **[Helm Charts](./docs/helm/README.md)** - Despliegue en Kubernetes
- **[Containerización](./docs/architecture/CONTAINERIZATION_SUMMARY.md)** - Resumen de containerización

#### 📊 Monitoreo y Resiliencia

- **[Resiliencia y Monitoreo](./docs/architecture/RESILIENCE_AND_MONITORING_SUMMARY.md)** - Estrategias implementadas
- **[Setup de Monitoreo](./docs/ci-cd/MONITORING_SETUP.md)** - Configuración Prometheus/Grafana
- **[Redis Caching](./docs/architecture/REDIS_CACHING_IMPLEMENTATION.md)** - Implementación de caché

#### 🔧 Optimizaciones y Refactorizaciones

- **[Optimizaciones Completas](./docs/root/RESUMEN_COMPLETO_OPTIMIZACIONES.md)** - Resumen de optimizaciones
- **[Optimizaciones Avanzadas](./docs/root/OPTIMIZACIONES_AVANZADAS_IMPLEMENTADAS.md)** - Optimizaciones avanzadas
- **[Optimizaciones Finales](./docs/root/OPTIMIZACIONES_FINALES_IMPLEMENTADAS.md)** - Últimas optimizaciones
- **[Análisis Release Planner](./docs/root/ANALISIS_OPTIMIZACION_RELEASE_PLANNER.md)** - Análisis de optimización
- **[Refactorización Timeline](./docs/root/PROPUESTA_REFACTORIZACION_TIMELINE.md)** - Propuesta de refactorización
- **[Implementación Timeline](./docs/root/IMPLEMENTACION_TIMELINE_OPTIMIZADO.md)** - Timeline optimizado

#### 🗄️ Base de Datos

- **[Migración de Base de Datos](./docs/api/DATABASE_MIGRATION.md)** - Guía completa
- **[Comparación Entidades](./docs/api/ENTITY_DATABASE_COMPARISON.md)** - Comparación de entidades
- **[Reschedules](./docs/root/RESCHEDULE_ATOMICO_IMPLEMENTACION.md)** - Implementación de reschedules
- **[Verificación Reschedules](./docs/root/VERIFICACION_RESCHEDULES.md)** - Verificación

#### 📦 Librerías Compartidas

- **[rp-shared](./docs/libs/rp-shared-README.md)** - Librería compartida principal
- **[Changelog rp-shared](./docs/libs/rp-shared-CHANGELOG.md)** - Historial de cambios
- **[Migración rp-shared](./docs/libs/rp-shared-MIGRATION.md)** - Guía de migración
- **[Tipos Compartidos](./docs/libs/shared-types-README.md)** - Tipos TypeScript compartidos
- **[Utilidades Compartidas](./docs/libs/shared-utils-README.md)** - Utilidades compartidas
- **[API Common](./docs/libs/api-common-README.md)** - Módulos comunes de NestJS

#### 🛠️ Desarrollo y Testing

- **[Setup Jest/VSCode](./docs/ci-cd/JEST_VSCODE_SETUP.md)** - Configuración de testing
- **[Testing Portal](./docs/portal/TESTING_SUMMARY.md)** - Resumen de tests
- **[Coverage Progress](./docs/api/COVERAGE_PROGRESS.md)** - Progreso de cobertura

#### 📝 Documentación Técnica Específica

- **[Builders](./docs/apps/portal/builders-README.md)** - Patrón Builder
- **[Constantes](./docs/apps/portal/constants-README.md)** - Sistema de constantes
- **[Fases](./docs/apps/portal/phase-README.md)** - Componente de fases
- **[Logging Implementation](./docs/apps/portal/logging-implementation-summary.md)** - Implementación de logging
- **[Logging Usage](./docs/apps/portal/logging-usage.md)** - Uso del sistema de logging
- **[Migrations API](./docs/apps/api/migrations-README.md)** - Migraciones de la API
- **[Constants API](./docs/apps/api/constants-README.md)** - Constantes de la API

### 📖 Guías de Inicio Rápido por Rol

#### 👨‍💻 Para Desarrolladores Nuevos

1. **[Arquitectura General](./docs/architecture/IMPLEMENTATION_COMPLETE.md)** - Entender el sistema completo
2. **[Arquitectura del Portal](./docs/portal/PORTAL_ARCHITECTURE.md)** - Estructura del frontend
3. **[Arquitectura de la API](./docs/api/ARCHITECTURE.md)** - Estructura del backend
4. **[Setup CI/CD](./docs/ci-cd/CI_CD_SETUP.md)** - Configurar entorno de desarrollo
5. **[Monorepo Nx](./docs/architecture/README_NX.md)** - Comandos y estructura Nx

#### 🔧 Para DevOps

1. **[Revisión de Despliegue](./docs/ci-cd/DEPLOYMENT_REVIEW.md)** - Checklist de despliegue
2. **[Setup CI/CD](./docs/ci-cd/CI_CD_SETUP.md)** - Configuración CI/CD
3. **[Helm Charts](./docs/helm/README.md)** - Despliegue en Kubernetes
4. **[Docker](./docs/ci-cd/README.DOCKER.md)** - Containerización
5. **[Monitoreo](./docs/ci-cd/MONITORING_SETUP.md)** - Setup de monitoreo

#### 🏛️ Para Arquitectos

1. **[Arquitectura General](./docs/architecture/IMPLEMENTATION_COMPLETE.md)** - Visión completa
2. **[Resiliencia y Monitoreo](./docs/architecture/RESILIENCE_AND_MONITORING_SUMMARY.md)** - Estrategias de resiliencia
3. **[OWASP y Optimización](./docs/architecture/OWASP_AND_OPTIMIZATION_SUMMARY.md)** - Seguridad y optimización
4. **[Clean Architecture API](./docs/api/ARCHITECTURE.md)** - Arquitectura limpia
5. **[Refactorización](./docs/apps/portal/release-plans-refactoring-summary.md)** - Patrones aplicados

#### 🧪 Para QA/Testing

1. **[Testing Portal](./docs/portal/TESTING_SUMMARY.md)** - Tests del Portal
2. **[Tests de Seguridad](./docs/architecture/SECURITY_TESTS_IMPLEMENTATION.md)** - Tests de seguridad
3. **[Coverage Progress](./docs/api/COVERAGE_PROGRESS.md)** - Cobertura de tests
4. **[Setup Jest/VSCode](./docs/ci-cd/JEST_VSCODE_SETUP.md)** - Configuración de testing

---

## 🛠️ Tecnologías

### Frontend

- **React** 19 - Biblioteca UI
- **TypeScript** 5.9 - Lenguaje tipado
- **Vite** 7 - Build tool
- **Material-UI** 7 - Componentes UI
- **Redux Toolkit** - Gestión de estado
- **TanStack Query** - Server state management
- **React Router** 6 - Routing
- **Tailwind CSS** - Utility-first CSS

### Backend

- **NestJS** 11 - Framework Node.js
- **TypeORM** - ORM
- **PostgreSQL** - Base de datos
- **class-validator** - Validación
- **JWT** - Autenticación
- **Swagger** - Documentación API

### Infraestructura

- **Nx** 22 - Monorepo tool
- **Docker** - Containerización
- **Kubernetes** - Orquestación
- **Helm** - Gestión de charts
- **Prometheus** - Métricas
- **Grafana** - Dashboards
- **Redis** - Caché

---

## 📜 Scripts Disponibles

### Desarrollo

```bash
npm run dev              # Ejecutar Portal Web
npm run dev:api          # Ejecutar API
npm run dev:all          # Ejecutar Portal y API en paralelo
```

### Build

```bash
npm run build            # Build de todas las aplicaciones
npm run build:portal     # Build del Portal
npm run build:api        # Build de la API
```

### Testing

```bash
npm run test             # Ejecutar todos los tests
npm run test:coverage    # Tests con coverage
npm run test:portal     # Tests del Portal
npm run test:api         # Tests de la API
```

### Linting y Formato

```bash
npm run lint             # Lint de todas las aplicaciones
npm run lint:portal     # Lint del Portal
npm run lint:api         # Lint de la API
npm run format           # Formatear código
npm run format:check     # Verificar formato
```

### Nx Específicos

```bash
nx graph                # Visualizar grafo de dependencias
nx affected:test        # Tests de archivos afectados
nx affected:build       # Build de archivos afectados
nx affected:lint        # Lint de archivos afectados
```

---

## 🌿 Git Flow Workflow

Este repositorio sigue el modelo de branching **Git Flow**.

### Ramas Principales

- **`main`**: Rama de producción
- **`develop`**: Rama de integración

### Prefijos de Ramas

- **`feature/`**: Nuevas funcionalidades
- **`release/`**: Preparación de releases
- **`hotfix/`**: Correcciones urgentes
- **`support/`**: Soporte

### Uso Diario

```bash
# Iniciar una feature
git flow feature start <nombre>

# Publicar una feature (compartir en origin)
git flow feature publish <nombre>

# Finalizar una feature (merge a develop)
git flow feature finish <nombre>
```

### Releases

```bash
# Iniciar un release desde develop
git flow release start <version>

# Estabilizar en la rama release/<version>
# (docs, version, fixes)

# Finalizar un release (merge a main y develop, tag)
git flow release finish <version>
```

### Hotfixes

```bash
# Iniciar un hotfix desde main
git flow hotfix start <version>

# Finalizar un hotfix (merge a main y develop, tag)
git flow hotfix finish <version>
```

### Ejemplos de Nombres de Ramas

- Features: `feature/user-authentication`
- Releases: `release/1.2.0`
- Hotfixes: `hotfix/1.2.1`

### Notas

- Abrir pull requests desde `feature/*` y `release/*` hacia `develop`
- Abrir pull requests de hotfix hacia `main` (el finish mergea de vuelta a `develop`)

---

## 🤝 Contribuir

### Proceso de Contribución

1. **Crear una rama feature**: `git flow feature start mi-feature`
2. **Desarrollar y commitear**: Realizar cambios y commits descriptivos
3. **Publicar la feature**: `git flow feature publish mi-feature`
4. **Crear Pull Request**: Abrir PR hacia `develop`
5. **Code Review**: Esperar aprobación
6. **Merge**: Una vez aprobado, mergear a `develop`

### Estándares de Código

- **TypeScript**: Tipado estricto
- **ESLint**: Seguir reglas configuradas
- **Prettier**: Formato automático
- **Tests**: Escribir tests para nuevas funcionalidades
- **Documentación**: Actualizar documentación relevante

### Estructura de Commits

Usar commits descriptivos siguiendo [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: agregar nueva funcionalidad de exportación
fix: corregir bug en cálculo de fechas
docs: actualizar documentación de API
refactor: refactorizar componente GanttChart
test: agregar tests para PlanCard
```

---

## 📞 Soporte

Para preguntas, problemas o sugerencias:

1. **Issues**: Abrir un issue en GitHub
2. **Documentación**: Consultar [`docs/`](./docs/) y [`docs/INDEX.md`](./docs/INDEX.md)
3. **Wiki**: (si está disponible)

---

## 📄 Licencia

[Especificar licencia si aplica]

---

## 🙏 Agradecimientos

- [Mencionar tecnologías y herramientas utilizadas]
- [Créditos a contribuidores si aplica]

---

<div align="center">

**📚 [Ver Documentación Completa](./docs/INDEX.md)** | **🏗️ [Arquitectura](./docs/architecture/IMPLEMENTATION_COMPLETE.md)** | **🚀 [Inicio Rápido](#-inicio-rápido)**

</div>
