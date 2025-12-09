# 🔍 Verificación de Configuración para Producción

Este documento verifica y analiza la configuración de Docker, docker-compose y Helm charts para asegurar que todo esté correctamente configurado para producción.

## 📋 Índice

- [Resumen Ejecutivo](#resumen-ejecutivo)
- [Verificación de Dockerfiles](#verificación-de-dockerfiles)
- [Verificación de Docker Compose](#verificación-de-docker-compose)
- [Verificación de Helm Charts](#verificación-de-helm-charts)
- [Variables de Entorno Requeridas](#variables-de-entorno-requeridas)
- [Problemas Identificados](#problemas-identificados)
- [Recomendaciones](#recomendaciones)
- [Checklist de Despliegue](#checklist-de-despliegue)

---

## 📊 Resumen Ejecutivo

### ✅ Aspectos Correctamente Configurados

1. **Multi-stage builds** en Dockerfiles de producción
2. **Health checks** implementados en todos los servicios
3. **Security headers** configurados en nginx
4. **Usuario no-root** en contenedor de API
5. **Compresión gzip** habilitada en nginx
6. **Cache de assets** configurado correctamente
7. **Dependencias entre servicios** bien definidas
8. **Persistencia de datos** con volúmenes Docker
9. **Probes de Kubernetes** configurados correctamente
10. **Secrets management** implementado en Helm

### ⚠️ Problemas Identificados

1. **docker-compose.yml** usa `NODE_ENV: development` en producción
2. **Falta variable de entorno** `RUN_MIGRATIONS` para ejecutar migraciones automáticamente
3. **Secrets hardcodeados** en `values.yaml` de Helm (deben ser externos)
4. **FRONTEND_URL** en docker-compose apunta a localhost
5. **Falta configuración** de variables de entorno para JWT en docker-compose
6. **No hay init container** para ejecutar migraciones antes de iniciar la API
7. **Falta configuración** de variables de entorno de producción en docker-compose

---

## 🐳 Verificación de Dockerfiles

### ✅ Portal Dockerfile (`apps/portal/Dockerfile`)

**Estado**: ✅ Correcto para producción

**Aspectos Positivos**:

- Multi-stage build (builder + nginx)
- Copia correcta de archivos estáticos
- Configuración de nginx incluida
- Health check configurado
- Build optimizado con `nx build portal`

**Recomendaciones**:

- ✅ Ya implementado correctamente

### ✅ API Dockerfile (`apps/api/Dockerfile`)

**Estado**: ✅ Correcto para producción

**Aspectos Positivos**:

- Multi-stage build (builder + runtime)
- Usuario no-root (`nestjs:nodejs`)
- Solo dependencias de producción (`--omit=dev`)
- Health check configurado
- Limpieza de cache de npm
- Permisos correctos (`chown`)

**Recomendaciones**:

- ✅ Ya implementado correctamente

### ⚠️ Dockerfiles de Desarrollo

**Estado**: ✅ Correctos para desarrollo

Los Dockerfiles `.dev` están correctamente configurados para desarrollo con hot-reload.

---

## 🐙 Verificación de Docker Compose

### ⚠️ `docker-compose.yml` (Producción)

**Problemas Identificados**:

1. **NODE_ENV incorrecto**:

   ```yaml
   environment:
     NODE_ENV: development # ❌ Debe ser "production"
   ```

2. **FRONTEND_URL incorrecto**:

   ```yaml
   FRONTEND_URL: http://localhost:5173 # ❌ Debe ser la URL real de producción
   ```

3. **Faltan variables de entorno críticas**:

   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `JWT_EXPIRES_IN`
   - `JWT_REFRESH_EXPIRES_IN`
   - `RUN_MIGRATIONS` (para ejecutar migraciones automáticamente)
   - `REDIS_PASSWORD` (si Redis requiere autenticación)

4. **Build args incorrectos**:
   ```yaml
   args:
     NODE_ENV: development # ❌ Debe ser "production"
   ```

### ✅ `docker-compose.dev.yml` (Desarrollo)

**Estado**: ✅ Correcto para desarrollo

No requiere cambios, está bien configurado para desarrollo.

---

## ☸️ Verificación de Helm Charts

### ✅ Configuración General

**Estado**: ✅ Bien estructurado

**Aspectos Positivos**:

- Separación correcta de servicios
- Secrets management implementado
- Health checks configurados
- Resource limits definidos
- Persistencia de datos configurada
- Ingress configurado

### ⚠️ Problemas Identificados

1. **Secrets hardcodeados en values.yaml**:

   ```yaml
   secrets:
     postgresql:
       password: "CHANGE_ME_IN_PRODUCTION" # ⚠️ Debe ser externo
     jwt:
       secret: "CHANGE_ME_IN_PRODUCTION" # ⚠️ Debe ser externo
   ```

2. **FRONTEND_URL por defecto incorrecto**:

   ```yaml
   FRONTEND_URL: "http://localhost" # ⚠️ Debe ser la URL real
   ```

3. **Falta init container para migraciones**:
   - No hay un init container que ejecute migraciones antes de iniciar la API
   - La API debería esperar a que las migraciones se completen

---

## 🔐 Variables de Entorno Requeridas

### API (Backend)

#### Requeridas (Críticas)

```bash
# Base de datos
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=releaseplanner
DATABASE_PASSWORD=<SECRET>
DATABASE_NAME=releaseplanner

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=<OPCIONAL>

# JWT
JWT_SECRET=<SECRET>
JWT_REFRESH_SECRET=<SECRET>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL (CORS)
FRONTEND_URL=https://release-planner.example.com

# Migraciones
RUN_MIGRATIONS=true  # Solo en el primer despliegue o cuando hay nuevas migraciones
```

#### Opcionales (con valores por defecto)

```bash
NODE_ENV=production
PORT=3000
RATE_LIMIT_SHORT=100
RATE_LIMIT_MEDIUM=200
RATE_LIMIT_LONG=1000
REQUEST_TIMEOUT_MS=30000
REDIS_TTL=3600
DATABASE_POOL_MAX=10
DATABASE_POOL_MIN=2
DATABASE_POOL_IDLE_TIMEOUT=30000
DATABASE_CONNECTION_TIMEOUT=2000
```

### Frontend (Portal)

#### Requeridas

```bash
NODE_ENV=production
VITE_API_URL=https://release-planner.example.com/api
```

---

## 🔧 Problemas Identificados y Soluciones

### 1. ❌ docker-compose.yml con NODE_ENV=development

**Problema**: El archivo `docker-compose.yml` está configurado para desarrollo.

**Solución**: Crear `docker-compose.prod.yml` o actualizar `docker-compose.yml`:

```yaml
# docker-compose.prod.yml
version: "3.8"

services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
      args:
        NODE_ENV: production # ✅ Corregido
    environment:
      NODE_ENV: production # ✅ Corregido
      PORT: 3000
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_USER: ${POSTGRES_USER:-releaseplanner}
      DATABASE_PASSWORD: ${POSTGRES_PASSWORD}
      DATABASE_NAME: ${POSTGRES_DB:-releaseplanner}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_DB: 0
      FRONTEND_URL: ${FRONTEND_URL:-https://release-planner.example.com} # ✅ Corregido
      JWT_SECRET: ${JWT_SECRET} # ✅ Agregado
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET} # ✅ Agregado
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN:-15m} # ✅ Agregado
      JWT_REFRESH_EXPIRES_IN: ${JWT_REFRESH_EXPIRES_IN:-7d} # ✅ Agregado
      RUN_MIGRATIONS: ${RUN_MIGRATIONS:-false} # ✅ Agregado

  frontend:
    build:
      context: .
      dockerfile: apps/portal/Dockerfile
      args:
        NODE_ENV: production # ✅ Corregido
    environment:
      NODE_ENV: production # ✅ Corregido
      VITE_API_URL: ${VITE_API_URL:-https://release-planner.example.com/api} # ✅ Corregido
```

### 2. ❌ Falta Init Container para Migraciones

**Problema**: No hay un mecanismo para ejecutar migraciones antes de iniciar la API.

**Solución**: Agregar init container en Helm chart:

```yaml
# helm/my-app-chart/templates/deployment-api.yaml
spec:
  template:
    spec:
      initContainers:
      - name: run-migrations
        image: "{{ include "my-app-chart.imageRegistry" . }}{{ .Values.api.image.repository }}:{{ .Values.api.image.tag }}"
        command: ["sh", "-c"]
        args:
          - |
            echo "Running database migrations..."
            cd /app/apps/api
            node -e "
              const { execSync } = require('child_process');
              try {
                execSync('npm run migration:run', { stdio: 'inherit' });
                console.log('Migrations completed successfully');
              } catch (error) {
                console.error('Migration failed:', error.message);
                process.exit(1);
              }
            "
        env:
        - name: DATABASE_HOST
          value: {{ include "my-app-chart.postgresql.fullname" . }}
        - name: DATABASE_PORT
          value: {{ .Values.postgresql.service.port | quote }}
        - name: DATABASE_USER
          value: {{ .Values.postgresql.auth.username | quote }}
        - name: DATABASE_NAME
          value: {{ .Values.postgresql.auth.database | quote }}
        - name: DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: {{ include "my-app-chart.postgresql.secretName" . }}
              key: postgres-password
```

### 3. ⚠️ Secrets Hardcodeados en Helm

**Problema**: Los secrets están hardcodeados en `values.yaml`.

**Solución**: Usar secretos externos o variables de entorno:

```bash
# Crear secrets en Kubernetes
kubectl create secret generic postgresql-secret \
  --from-literal=postgres-password='<SECURE_PASSWORD>'

kubectl create secret generic jwt-secret \
  --from-literal=jwt-secret='<SECURE_JWT_SECRET>' \
  --from-literal=jwt-refresh-secret='<SECURE_REFRESH_SECRET>'

# Instalar Helm chart con secrets externos
helm install release-planner ./helm/my-app-chart \
  --set secrets.postgresql.existingSecret=postgresql-secret \
  --set secrets.jwt.existingSecret=jwt-secret \
  --set api.env.FRONTEND_URL=https://release-planner.example.com
```

### 4. ⚠️ FRONTEND_URL Incorrecto

**Problema**: `FRONTEND_URL` apunta a localhost en varias configuraciones.

**Solución**: Actualizar en todos los lugares:

- `docker-compose.yml` / `docker-compose.prod.yml`
- `helm/my-app-chart/values.yaml`
- Variables de entorno del despliegue

---

## 📝 Recomendaciones Adicionales

### 1. Crear Archivo `.env.example`

Crear `apps/api/.env.example` con todas las variables requeridas:

```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=releaseplanner
DATABASE_PASSWORD=your_secure_password
DATABASE_NAME=releaseplanner

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_jwt_secret_key_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:5173

# Migrations
RUN_MIGRATIONS=false

# Optional
NODE_ENV=development
PORT=3000
RATE_LIMIT_SHORT=100
RATE_LIMIT_MEDIUM=200
RATE_LIMIT_LONG=1000
REQUEST_TIMEOUT_MS=30000
```

### 2. Agregar Script de Verificación Pre-Despliegue

Crear `scripts/verify-production-config.sh`:

```bash
#!/bin/bash
set -e

echo "🔍 Verificando configuración de producción..."

# Verificar variables de entorno requeridas
REQUIRED_VARS=(
  "DATABASE_PASSWORD"
  "JWT_SECRET"
  "JWT_REFRESH_SECRET"
  "FRONTEND_URL"
)

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Error: Variable de entorno $var no está definida"
    exit 1
  fi
done

echo "✅ Todas las variables de entorno requeridas están definidas"

# Verificar que JWT_SECRET tenga al menos 32 caracteres
if [ ${#JWT_SECRET} -lt 32 ]; then
  echo "❌ Error: JWT_SECRET debe tener al menos 32 caracteres"
  exit 1
fi

echo "✅ JWT_SECRET tiene longitud suficiente"

# Verificar que FRONTEND_URL sea HTTPS en producción
if [[ "$NODE_ENV" == "production" ]] && [[ ! "$FRONTEND_URL" =~ ^https:// ]]; then
  echo "⚠️  Advertencia: FRONTEND_URL debería usar HTTPS en producción"
fi

echo "✅ Verificación completada"
```

### 3. Agregar Health Check Endpoint en API

Verificar que el endpoint `/api/health` esté implementado correctamente.

### 4. Configurar Logging en Producción

Asegurar que los logs estén configurados para producción:

- Niveles de log apropiados
- Formato estructurado (JSON)
- Rotación de logs
- Integración con sistemas de monitoreo

### 5. Configurar Backup de Base de Datos

Implementar backups automáticos de PostgreSQL:

- Backups diarios
- Retención configurada
- Restauración probada

---

## ✅ Checklist de Despliegue a Producción

### Pre-Despliegue

- [ ] Todas las variables de entorno requeridas están definidas
- [ ] Secrets están configurados externamente (no hardcodeados)
- [ ] `FRONTEND_URL` apunta a la URL correcta de producción
- [ ] `JWT_SECRET` y `JWT_REFRESH_SECRET` tienen al menos 32 caracteres
- [ ] `DATABASE_PASSWORD` es seguro y único
- [ ] `RUN_MIGRATIONS=true` está configurado para el primer despliegue
- [ ] Health checks están funcionando correctamente
- [ ] Backups de base de datos están configurados
- [ ] Monitoreo y alertas están configurados

### Build de Imágenes

- [ ] Imágenes Docker se construyen con `NODE_ENV=production`
- [ ] Imágenes están etiquetadas con versiones específicas
- [ ] Imágenes están almacenadas en un registry seguro
- [ ] Imágenes están escaneadas para vulnerabilidades

### Despliegue

- [ ] Migraciones de base de datos se ejecutan antes de iniciar la API
- [ ] Servicios se despliegan en el orden correcto (postgres → redis → api → frontend)
- [ ] Health checks pasan antes de marcar los pods como ready
- [ ] Secrets están montados correctamente
- [ ] Volúmenes de persistencia están configurados
- [ ] Ingress está configurado con SSL/TLS

### Post-Despliegue

- [ ] API responde en `/api/health`
- [ ] Frontend carga correctamente
- [ ] CORS está configurado correctamente
- [ ] Autenticación funciona
- [ ] Logs se están generando correctamente
- [ ] Métricas de Prometheus se están recopilando
- [ ] Alertas están funcionando

---

## 📚 Archivos que Requieren Actualización

1. **`docker-compose.yml`** → Crear `docker-compose.prod.yml` o actualizar
2. **`helm/my-app-chart/values.yaml`** → Actualizar valores por defecto
3. **`helm/my-app-chart/templates/deployment-api.yaml`** → Agregar init container
4. **Crear `apps/api/.env.example`** → Template de variables de entorno
5. **Crear `scripts/verify-production-config.sh`** → Script de verificación

---

## 🚀 Comandos de Despliegue Recomendados

### Docker Compose (Producción)

```bash
# 1. Crear archivo .env con variables de producción
cp apps/api/.env.example apps/api/.env.production
# Editar apps/api/.env.production con valores reales

# 2. Cargar variables de entorno
export $(cat apps/api/.env.production | xargs)

# 3. Construir y desplegar
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# 4. Verificar logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Kubernetes/Helm (Producción)

```bash
# 1. Crear secrets
kubectl create secret generic postgresql-secret \
  --from-literal=postgres-password='<SECURE_PASSWORD>'

kubectl create secret generic jwt-secret \
  --from-literal=jwt-secret='<SECURE_JWT_SECRET>' \
  --from-literal=jwt-refresh-secret='<SECURE_REFRESH_SECRET>'

# 2. Instalar Helm chart
helm install release-planner ./helm/my-app-chart \
  --set secrets.postgresql.existingSecret=postgresql-secret \
  --set secrets.jwt.existingSecret=jwt-secret \
  --set api.env.FRONTEND_URL=https://release-planner.example.com \
  --set api.env.RUN_MIGRATIONS=true \
  --set ingress.hosts[0].host=release-planner.example.com

# 3. Verificar despliegue
kubectl get pods
kubectl logs -f deployment/release-planner-api
```

---

## 📞 Soporte

Para preguntas o problemas relacionados con el despliegue, consultar:

- [Guía de Despliegue](./DEPLOYMENT.md)
- [Setup CI/CD](./CI_CD_SETUP.md)
- [Documentación de Helm](../helm/README.md)



