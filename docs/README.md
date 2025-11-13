# Documentación del Proyecto Release Planner

Este directorio contiene toda la documentación del proyecto organizada por categorías.

## 📁 Estructura de Documentación

### `/api`
Documentación relacionada con la API NestJS:
- Migraciones de base de datos
- Arquitectura de la API
- Guías de implementación

### `/portal`
Documentación relacionada con el Portal React:
- Integración con API
- Arquitectura del Portal
- Guías de implementación frontend

### `/ci-cd`
Documentación de CI/CD y despliegue:
- Configuración de GitHub Actions
- Guías de despliegue
- Configuración de Docker y Kubernetes

### `/helm`
Documentación de Helm Charts:
- Guías de instalación
- Configuración de valores
- Despliegue en Kubernetes

### `/architecture`
Documentación arquitectónica general:
- Resúmenes de implementación
- Mejores prácticas
- Guías de seguridad

### `/legacy-portal`
Documentación histórica del portal legacy (referencia):
- Documentación pre-migración a monorepo Nx
- Guías de desarrollo histórico
- Patrones y arquitectura legacy

## 📚 Documentos Principales

### Configuración y Despliegue
- `ci-cd/CI_CD_SETUP.md` - Guía completa de configuración CI/CD
- `ci-cd/DEPLOYMENT_REVIEW.md` - Revisión de configuración de despliegue
- `helm/README.md` - Documentación del Helm Chart

### Implementación
- `architecture/IMPLEMENTATION_COMPLETE.md` - Resumen completo de implementación
- `architecture/AUTHENTICATION_COMPLETE.md` - Implementación de autenticación
- `architecture/REDIS_CACHING_IMPLEMENTATION.md` - Implementación de Redis
- `architecture/SECURITY_TESTS_IMPLEMENTATION.md` - Tests de seguridad

### API
- `api/DATABASE_MIGRATION.md` - Guía de migración de base de datos
- `api/MIGRATIONS_GUIDE.md` - Guía de migraciones TypeORM
- `api/ARCHITECTURE.md` - Arquitectura de la API

### Portal
- `portal/API_INTEGRATION_GUIDE.md` - Guía de integración con API
- `portal/FRONTEND_API_INTEGRATION.md` - Integración frontend
- `portal/PORTAL_ARCHITECTURE.md` - Arquitectura del Portal

## 🔍 Búsqueda Rápida

### Por Tema
- **Autenticación**: `architecture/AUTHENTICATION_*`
- **Seguridad**: `architecture/SECURITY_*`, `architecture/OWASP_*`
- **Base de Datos**: `api/DATABASE_*`, `api/MIGRATION_*`
- **CI/CD**: `ci-cd/*`
- **Despliegue**: `ci-cd/DEPLOYMENT_*`, `helm/*`
- **Redis**: `architecture/REDIS_*`
- **Resiliencia**: `architecture/RESILIENCE_*`

## 📖 Guías de Inicio Rápido

1. **Primera vez**: Lee `architecture/IMPLEMENTATION_COMPLETE.md`
2. **Configurar CI/CD**: Sigue `ci-cd/CI_CD_SETUP.md`
3. **Desplegar**: Consulta `ci-cd/DEPLOYMENT_REVIEW.md` y `helm/README.md`
4. **Desarrollar**: Revisa `api/ARCHITECTURE.md` y `portal/PORTAL_ARCHITECTURE.md`

## 🔄 Actualización de Documentación

La documentación se actualiza automáticamente con cada cambio importante en el proyecto. Para actualizar manualmente:

1. Actualiza el archivo correspondiente en la categoría adecuada
2. Actualiza este README si agregas nuevas categorías
3. Mantén la estructura organizada por temas

## 📝 Notas

- Los `README.md` en subdirectorios del código fuente se mantienen en sus ubicaciones originales
- Esta documentación está organizada por temas, no por estructura de código
- Para documentación técnica específica de componentes, consulta los README.md en cada módulo

