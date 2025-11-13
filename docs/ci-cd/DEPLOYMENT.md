# Guía de Despliegue - Release Planner

Esta guía proporciona instrucciones completas para desplegar la aplicación Release Planner usando Docker, Docker Compose y Kubernetes con Helm.

## Tabla de Contenidos

1. [Docker y Docker Compose](#docker-y-docker-compose)
2. [Kubernetes con Helm](#kubernetes-con-helm)
3. [Estructura de Archivos](#estructura-de-archivos)
4. [Configuración de Producción](#configuración-de-producción)

## Docker y Docker Compose

### Desarrollo Local

#### Opción 1: Desarrollo con Hot-Reload (Recomendado)

```bash
# Copiar archivo de ejemplo de variables de entorno
cp .env.example .env

# Iniciar todos los servicios con hot-reload
docker-compose -f docker-compose.dev.yml up

# O en segundo plano
docker-compose -f docker-compose.dev.yml up -d
```

**Características:**
- Hot-reload automático para React (Vite)
- Hot-reload automático para NestJS (webpack watch)
- Volúmenes montados para código fuente
- PostgreSQL con persistencia de datos

#### Opción 2: Desarrollo Estándar

```bash
# Iniciar todos los servicios
docker-compose up

# O en segundo plano
docker-compose up -d
```

### Construcción de Imágenes

```bash
# Construir todas las imágenes
docker-compose build

# Construir imagen específica
docker-compose build api
docker-compose build frontend

# Construir sin cache
docker-compose build --no-cache
```

### Comandos Útiles

```bash
# Ver logs
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f postgres

# Reiniciar servicio
docker-compose restart api

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (¡elimina datos de PostgreSQL!)
docker-compose down -v
```

Para más detalles, consulta [README.DOCKER.md](./README.DOCKER.md).

## Kubernetes con Helm

### Requisitos Previos

- Kubernetes 1.19+
- Helm 3.0+
- kubectl configurado para tu cluster
- Un controlador de Ingress instalado (por ejemplo, NGINX Ingress Controller)
- Cert-Manager (opcional, para certificados TLS automáticos)

### Construcción y Publicación de Imágenes

Antes de desplegar en Kubernetes, necesitas construir y publicar las imágenes Docker:

```bash
# Construir imágenes
docker build -t release-planner-frontend:1.0.0 -f apps/portal/Dockerfile .
docker build -t release-planner-api:1.0.0 -f apps/api/Dockerfile .

# Etiquetar para tu registry
docker tag release-planner-frontend:1.0.0 tu-registry.io/release-planner-frontend:1.0.0
docker tag release-planner-api:1.0.0 tu-registry.io/release-planner-api:1.0.0

# Publicar imágenes
docker push tu-registry.io/release-planner-frontend:1.0.0
docker push tu-registry.io/release-planner-api:1.0.0
```

### Instalación Básica

```bash
# Instalar el chart
helm install release-planner ./helm/my-app-chart

# Verificar el despliegue
kubectl get pods -l app.kubernetes.io/instance=release-planner
```

### Instalación con Configuración Personalizada

Crea un archivo `values-production.yaml`:

```yaml
global:
  imageRegistry: "tu-registry.io"

frontend:
  image:
    repository: release-planner-frontend
    tag: "1.0.0"
  replicaCount: 3

api:
  image:
    repository: release-planner-api
    tag: "1.0.0"
  replicaCount: 3

postgresql:
  persistence:
    size: 20Gi

ingress:
  enabled: true
  hosts:
    - host: release-planner.tudominio.com
      paths:
        - path: /
          pathType: Prefix
          service: frontend
        - path: /api
          pathType: Prefix
          service: api
  tls:
    - secretName: release-planner-tls
      hosts:
        - release-planner.tudominio.com

secrets:
  postgresql:
    password: "tu-password-seguro-aqui"
    adminPassword: "tu-admin-password-seguro-aqui"
```

Instalar con valores personalizados:

```bash
helm install release-planner ./helm/my-app-chart -f values-production.yaml
```

### Actualización

```bash
# Actualizar con nuevos valores
helm upgrade release-planner ./helm/my-app-chart -f values-production.yaml

# Actualizar solo la imagen de la API
helm upgrade release-planner ./helm/my-app-chart \
  --set api.image.tag=1.0.1
```

### Desinstalación

```bash
# Desinstalar el release
helm uninstall release-planner

# Eliminar también los PersistentVolumeClaims (¡elimina datos de PostgreSQL!)
kubectl delete pvc -l app.kubernetes.io/instance=release-planner
```

Para más detalles, consulta [helm/my-app-chart/README.md](./helm/my-app-chart/README.md).

## Estructura de Archivos

```
.
├── apps/
│   ├── portal/
│   │   ├── Dockerfile              # Producción: Multi-stage (Node.js + Nginx)
│   │   ├── Dockerfile.dev          # Desarrollo: Hot-reload
│   │   └── nginx.conf              # Configuración de Nginx
│   └── api/
│       ├── Dockerfile              # Producción: Multi-stage optimizado
│       └── Dockerfile.dev          # Desarrollo: Hot-reload
├── helm/
│   └── my-app-chart/
│       ├── Chart.yaml              # Metadata del chart
│       ├── values.yaml             # Valores por defecto
│       ├── templates/              # Manifiestos de Kubernetes
│       │   ├── deployment-frontend.yaml
│       │   ├── deployment-api.yaml
│       │   ├── statefulset-postgresql.yaml
│       │   ├── service-frontend.yaml
│       │   ├── service-api.yaml
│       │   ├── service-postgresql.yaml
│       │   ├── ingress.yaml
│       │   ├── secret-postgresql.yaml
│       │   ├── pvc-postgresql.yaml
│       │   ├── serviceaccount.yaml
│       │   ├── _helpers.tpl        # Helpers de Helm
│       │   └── NOTES.txt           # Notas post-instalación
│       ├── README.md               # Documentación del chart
│       └── .helmignore
├── docker-compose.yml              # Docker Compose para desarrollo estándar
├── docker-compose.dev.yml          # Docker Compose para desarrollo con hot-reload
├── .dockerignore                   # Archivos a ignorar en builds Docker
├── .env.example                    # Ejemplo de variables de entorno
├── README.DOCKER.md                # Documentación de Docker
└── DEPLOYMENT.md                   # Esta guía
```

## Configuración de Producción

### Variables de Entorno Críticas

Asegúrate de configurar estas variables en producción:

1. **PostgreSQL:**
   - Usa contraseñas seguras y únicas
   - Considera usar un sistema de gestión de secretos (Vault, Sealed Secrets, etc.)

2. **API:**
   - `DATABASE_HOST`: Hostname del servicio PostgreSQL
   - `DATABASE_PASSWORD`: Contraseña de PostgreSQL (desde Secret)
   - `FRONTEND_URL`: URL pública del frontend

3. **Frontend:**
   - `VITE_API_URL`: URL pública de la API

### Recursos y Límites

Ajusta los recursos según tus necesidades:

```yaml
frontend:
  resources:
    requests:
      cpu: 200m
      memory: 256Mi
    limits:
      cpu: 1000m
      memory: 512Mi

api:
  resources:
    requests:
      cpu: 500m
      memory: 512Mi
    limits:
      cpu: 2000m
      memory: 1Gi

postgresql:
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 4000m
      memory: 4Gi
```

### Persistencia de Datos

PostgreSQL utiliza PersistentVolumeClaims para almacenar datos. Configura según tu infraestructura:

```yaml
postgresql:
  persistence:
    enabled: true
    size: 50Gi
    storageClass: "fast-ssd"  # Ajusta según tu cluster
    accessMode: ReadWriteOnce
```

### Seguridad

1. **Secrets:**
   - Nunca commits contraseñas en el repositorio
   - Usa sistemas de gestión de secretos en producción
   - Rota las contraseñas regularmente

2. **Network Policies:**
   - Considera implementar Network Policies para aislar servicios
   - Limita el acceso a PostgreSQL solo desde la API

3. **TLS/HTTPS:**
   - Configura certificados TLS para el Ingress
   - Usa Cert-Manager para certificados automáticos

4. **Image Security:**
   - Escanea las imágenes en busca de vulnerabilidades
   - Usa imágenes base actualizadas regularmente

### Monitoreo y Logging

Considera implementar:

1. **Monitoring:**
   - Prometheus + Grafana para métricas
   - Alertas para recursos críticos

2. **Logging:**
   - Centraliza logs con ELK Stack o Loki
   - Implementa rotación de logs

3. **Health Checks:**
   - Todos los servicios incluyen health checks configurados
   - Configura alertas basadas en health checks

## Troubleshooting

### Problemas Comunes

1. **Los pods no inician:**
   ```bash
   kubectl describe pod <pod-name>
   kubectl logs <pod-name>
   ```

2. **Problemas de conexión a la base de datos:**
   ```bash
   kubectl get svc postgresql
   kubectl exec -it <api-pod> -- env | grep DATABASE
   ```

3. **Problemas con Ingress:**
   ```bash
   kubectl describe ingress release-planner
   kubectl get ingress
   ```

Para más detalles de troubleshooting, consulta los README específicos:
- [README.DOCKER.md](./README.DOCKER.md) - Troubleshooting de Docker
- [helm/my-app-chart/README.md](./helm/my-app-chart/README.md) - Troubleshooting de Kubernetes

## Próximos Pasos

1. Configura CI/CD para builds y despliegues automáticos
2. Implementa monitoreo y alertas
3. Configura backups automáticos de PostgreSQL
4. Implementa estrategias de despliegue (blue-green, canary)
5. Configura autoscaling basado en métricas

