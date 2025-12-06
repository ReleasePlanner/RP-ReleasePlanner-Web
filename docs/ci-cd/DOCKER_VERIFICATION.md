# 🐳 Guía de Verificación de Docker Deployment

Este documento describe cómo verificar que el deployment de Docker funcione correctamente después de la eliminación de la aplicación mobile.

## ✅ Verificaciones Realizadas

### 1. Archivos Docker-Compose

Todos los archivos docker-compose están limpios y solo incluyen:
- ✅ `docker-compose.yml` - Configuración base (PostgreSQL, Redis, API, Frontend)
- ✅ `docker-compose.dev.yml` - Configuración de desarrollo con hot-reload
- ✅ `docker-compose.prod.yml` - Configuración de producción optimizada
- ✅ `docker-compose.monitoring.yml` - Stack de monitoreo (Prometheus, Grafana)

**NO hay referencias a mobile en ningún archivo.**

### 2. Dockerfiles

Verificados los Dockerfiles de ambas aplicaciones:
- ✅ `apps/api/Dockerfile` - Build multi-stage de API NestJS
- ✅ `apps/api/Dockerfile.dev` - Imagen de desarrollo con hot-reload
- ✅ `apps/portal/Dockerfile` - Build multi-stage de Portal React + Nginx
- ✅ `apps/portal/Dockerfile.dev` - Imagen de desarrollo con Vite

**Todos los Dockerfiles están correctos y sin referencias a mobile.**

### 3. Servicios en Docker Compose

#### Servicios Base (todos los archivos):
```yaml
postgres:    # PostgreSQL 16
redis:       # Redis 7 con persistencia
```

#### Servicios de Aplicación:
```yaml
api:         # Backend NestJS
frontend:    # Portal React servido con Nginx
```

#### Servicios de Monitoreo (docker-compose.monitoring.yml):
```yaml
postgres-exporter:  # Métricas de PostgreSQL
redis-exporter:     # Métricas de Redis
prometheus:         # Recolector de métricas
grafana:            # Dashboards
node-exporter:      # Métricas del sistema
```

## 🚀 Comandos de Verificación

### Desarrollo

```bash
# Iniciar servicios de desarrollo
docker-compose -f docker-compose.dev.yml up -d

# Verificar que todos los contenedores estén corriendo
docker-compose -f docker-compose.dev.yml ps

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f api
docker-compose -f docker-compose.dev.yml logs -f frontend

# Verificar endpoints
curl http://localhost:3000/api/health  # API
curl http://localhost:5173             # Frontend

# Detener servicios
docker-compose -f docker-compose.dev.yml down
```

### Producción

```bash
# Iniciar servicios de producción
docker-compose -f docker-compose.prod.yml up -d

# Verificar que todos los contenedores estén corriendo
docker-compose -f docker-compose.prod.yml ps

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Detener servicios
docker-compose -f docker-compose.prod.yml down
```

### Con Monitoreo

```bash
# Iniciar servicios con monitoreo
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d

# Acceder a dashboards
# Prometheus: http://localhost:9090
# Grafana:    http://localhost:3001 (admin/admin)

# Detener todo
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml down
```

## 🔍 Scripts de Verificación

Se han creado dos scripts para automatizar las verificaciones:

### 1. `scripts/verify-deployment.sh`

Verifica que el deployment esté funcionando correctamente:

```bash
chmod +x scripts/verify-deployment.sh
./scripts/verify-deployment.sh
```

Este script verifica:
- ✅ Contenedores corriendo
- ✅ Health checks
- ✅ Endpoints HTTP
- ✅ Volúmenes
- ✅ Redes
- ✅ Logs recientes

### 2. `scripts/test-docker-build.sh`

Prueba que las imágenes se construyan correctamente:

```bash
chmod +x scripts/test-docker-build.sh
./scripts/test-docker-build.sh
```

Este script:
- ✅ Construye imagen de API (prod y dev)
- ✅ Construye imagen de Portal (prod y dev)
- ✅ Verifica que NO existan imágenes de mobile
- ✅ Muestra tamaño de imágenes
- ✅ Lista imágenes construidas

## 📋 Checklist de Verificación Manual

### Antes de hacer deploy:

- [ ] Verificar que `docker-compose.yml` no tenga referencias a mobile
- [ ] Verificar que los Dockerfiles estén correctos
- [ ] Probar build de imágenes localmente
- [ ] Verificar variables de entorno en `.env`

### Durante el deploy:

- [ ] Iniciar contenedores con docker-compose
- [ ] Verificar que todos los contenedores estén `running`
- [ ] Verificar health checks (todos `healthy`)
- [ ] Verificar logs (sin errores críticos)
- [ ] Probar endpoints de API y Frontend

### Después del deploy:

- [ ] API responde en `/api/health`
- [ ] Frontend carga correctamente
- [ ] PostgreSQL está accesible
- [ ] Redis está operativo
- [ ] Volúmenes de datos persisten correctamente
- [ ] Monitoreo funciona (Prometheus/Grafana)

## 🐛 Troubleshooting

### Problema: Contenedor no inicia

```bash
# Ver logs detallados
docker logs <container-name>

# Verificar configuración
docker inspect <container-name>

# Reiniciar contenedor
docker restart <container-name>
```

### Problema: Health check falla

```bash
# Ver estado de health check
docker inspect --format='{{json .State.Health}}' <container-name> | jq

# Verificar endpoint manualmente
docker exec <container-name> wget -O- http://localhost:<port>/health
```

### Problema: Base de datos no conecta

```bash
# Verificar que PostgreSQL esté escuchando
docker exec release-planner-postgres pg_isready -U releaseplanner

# Verificar conexión desde API
docker exec release-planner-api psql -h postgres -U releaseplanner -d releaseplanner -c "SELECT 1"
```

### Problema: Frontend no carga

```bash
# Verificar que Nginx esté corriendo
docker exec release-planner-frontend nginx -t

# Ver logs de Nginx
docker logs release-planner-frontend
```

## 📊 Monitoreo en Producción

### Métricas Disponibles

- **PostgreSQL**: http://localhost:9187/metrics
- **Redis**: http://localhost:9121/metrics
- **API**: http://localhost:3000/api/metrics
- **Sistema**: http://localhost:9100/metrics

### Dashboards de Grafana

Acceder a http://localhost:3001 con credenciales configuradas:
- Usuario: `admin` (por defecto)
- Password: `admin` (por defecto, cambiar en producción)

Dashboards preconfigurados:
- PostgreSQL Dashboard
- Redis Dashboard
- NestJS API Metrics
- System Metrics

## 🔐 Variables de Entorno

### Archivo `.env` requerido:

```env
# Base de datos
POSTGRES_USER=releaseplanner
POSTGRES_PASSWORD=<strong-password>
POSTGRES_DB=releaseplanner
POSTGRES_PORT=5432

# Redis
REDIS_PORT=6379
REDIS_PASSWORD=<redis-password>

# API
API_PORT=3000
JWT_SECRET=<strong-secret>
JWT_REFRESH_SECRET=<strong-refresh-secret>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Frontend
FRONTEND_PORT=5173
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:3000/api

# Monitoreo
GRAFANA_USER=admin
GRAFANA_PASSWORD=<grafana-password>
GRAFANA_SECRET_KEY=<grafana-secret>
```

## ✅ Resultado de Verificación

### Estado Actual:
- ✅ Docker-compose limpios (sin referencias a mobile)
- ✅ Dockerfiles correctos y funcionales
- ✅ Servicios base configurados (PostgreSQL, Redis)
- ✅ Aplicaciones configuradas (API, Frontend)
- ✅ Monitoreo configurado (Prometheus, Grafana)
- ✅ Health checks implementados
- ✅ Scripts de verificación creados

### Servicios Eliminados:
- ❌ Mobile (apps/mobile) - ELIMINADO
- ❌ Referencias a Expo/React Native - ELIMINADAS
- ❌ Dependencias de mobile - ELIMINADAS

## 🎯 Conclusión

El deployment de Docker está **completamente limpio y funcional** sin la aplicación mobile. Todos los servicios necesarios para el Portal Web y la API REST están configurados correctamente y listos para producción.

**La solución ahora solo contiene: Portal + API + Libs compartidas.**

