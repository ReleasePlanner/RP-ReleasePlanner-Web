# Guía de Docker y Docker Compose

Esta guía explica cómo usar Docker y Docker Compose para desarrollar y ejecutar la aplicación Release Planner.

## Requisitos Previos

- Docker Desktop (Windows/Mac) o Docker Engine + Docker Compose (Linux)
- Git

## Estructura de Dockerfiles

### Frontend (React)

- **`apps/portal/Dockerfile`**: Dockerfile de producción con multi-stage build (Node.js + Nginx)
- **`apps/portal/Dockerfile.dev`**: Dockerfile de desarrollo con hot-reload
- **`apps/portal/nginx.conf`**: Configuración de Nginx para producción

### Backend (NestJS)

- **`apps/api/Dockerfile`**: Dockerfile de producción con multi-stage build optimizado
- **`apps/api/Dockerfile.dev`**: Dockerfile de desarrollo con hot-reload

## Desarrollo Local con Docker Compose

### Opción 1: Desarrollo con Hot-Reload (Recomendado)

Usa `docker-compose.dev.yml` para desarrollo con hot-reload completo:

```bash
# Iniciar todos los servicios
docker-compose -f docker-compose.dev.yml up

# Iniciar en segundo plano
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Detener servicios
docker-compose -f docker-compose.dev.yml down
```

**Características:**
- Hot-reload para React (Vite)
- Hot-reload para NestJS (webpack watch)
- Volúmenes montados para código fuente
- PostgreSQL con persistencia de datos

### Opción 2: Desarrollo Estándar

Usa `docker-compose.yml` para un entorno más cercano a producción:

```bash
# Iniciar todos los servicios
docker-compose up

# Iniciar en segundo plano
docker-compose up -d

# Ver logs de un servicio específico
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f postgres

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (¡CUIDADO: elimina datos de PostgreSQL!)
docker-compose down -v
```

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto para configurar variables:

```env
# PostgreSQL
POSTGRES_USER=releaseplanner
POSTGRES_PASSWORD=releaseplanner123
POSTGRES_DB=releaseplanner
POSTGRES_PORT=5432

# API
API_PORT=3000

# Frontend
FRONTEND_PORT=5173
```

## Construcción de Imágenes

### Construir Imágenes Individuales

```bash
# Frontend (producción)
docker build -t release-planner-frontend:1.0.0 -f apps/portal/Dockerfile .

# Backend (producción)
docker build -t release-planner-api:1.0.0 -f apps/api/Dockerfile .

# Frontend (desarrollo)
docker build -t release-planner-frontend:dev -f apps/portal/Dockerfile.dev .

# Backend (desarrollo)
docker build -t release-planner-api:dev -f apps/api/Dockerfile.dev .
```

### Construir con Docker Compose

```bash
# Construir todas las imágenes
docker-compose build

# Construir una imagen específica
docker-compose build api
docker-compose build frontend

# Reconstruir sin cache
docker-compose build --no-cache
```

## Comandos Útiles

### Ver Estado de los Contenedores

```bash
# Ver contenedores corriendo
docker-compose ps

# Ver todos los contenedores (incluyendo detenidos)
docker-compose ps -a
```

### Acceder a los Contenedores

```bash
# Acceder al contenedor de la API
docker-compose exec api sh

# Acceder al contenedor de PostgreSQL
docker-compose exec postgres psql -U releaseplanner -d releaseplanner

# Acceder al contenedor del frontend
docker-compose exec frontend sh
```

### Ver Logs

```bash
# Todos los logs
docker-compose logs

# Logs de un servicio específico
docker-compose logs api
docker-compose logs frontend
docker-compose logs postgres

# Seguir logs en tiempo real
docker-compose logs -f api

# Últimas 100 líneas
docker-compose logs --tail=100 api
```

### Reiniciar Servicios

```bash
# Reiniciar un servicio específico
docker-compose restart api

# Reiniciar todos los servicios
docker-compose restart
```

### Limpiar Recursos

```bash
# Detener y eliminar contenedores
docker-compose down

# Detener, eliminar contenedores y volúmenes
docker-compose down -v

# Eliminar imágenes no utilizadas
docker image prune

# Eliminar todo (contenedores, imágenes, volúmenes, redes)
docker system prune -a --volumes
```

## Solución de Problemas

### Los contenedores no inician

1. Verifica los logs:
   ```bash
   docker-compose logs
   ```

2. Verifica que los puertos no estén en uso:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   netstat -ano | findstr :5173
   netstat -ano | findstr :5432
   
   # Linux/Mac
   lsof -i :3000
   lsof -i :5173
   lsof -i :5432
   ```

3. Reconstruye las imágenes:
   ```bash
   docker-compose build --no-cache
   ```

### Problemas de conexión a PostgreSQL

1. Verifica que PostgreSQL esté corriendo:
   ```bash
   docker-compose ps postgres
   ```

2. Verifica los logs:
   ```bash
   docker-compose logs postgres
   ```

3. Prueba la conexión:
   ```bash
   docker-compose exec postgres pg_isready -U releaseplanner
   ```

### Hot-reload no funciona

1. Verifica que estés usando `docker-compose.dev.yml`:
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

2. Verifica que los volúmenes estén montados correctamente:
   ```bash
   docker-compose exec api ls -la /app/apps/api/src
   docker-compose exec frontend ls -la /app/apps/portal/src
   ```

3. Verifica los permisos de archivos (especialmente en Windows):
   - Asegúrate de que Docker Desktop tenga acceso a los directorios compartidos
   - En Windows, verifica la configuración de "File sharing" en Docker Desktop

### Problemas de permisos en Linux

Si tienes problemas de permisos al montar volúmenes en Linux:

```bash
# Cambiar propietario de los archivos
sudo chown -R $USER:$USER .

# O usar el usuario root en docker-compose (no recomendado para producción)
```

## Producción

Para producción, usa los Dockerfiles de producción y considera:

1. **Variables de entorno seguras**: Usa secrets management
2. **Imágenes optimizadas**: Las imágenes de producción son multi-stage y más pequeñas
3. **Health checks**: Todos los servicios incluyen health checks
4. **Persistencia**: PostgreSQL usa volúmenes nombrados para persistencia
5. **Redes**: Servicios aislados en una red Docker dedicada

## Próximos Pasos

- Consulta `README.KUBERNETES.md` para despliegue en Kubernetes
- Revisa la documentación de Helm en `helm/my-app-chart/README.md`

