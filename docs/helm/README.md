# Release Planner Helm Chart

Este chart de Helm despliega la aplicación completa de Release Planner, incluyendo:
- **Frontend**: Aplicación React servida con Nginx
- **Backend API**: Servicio NestJS
- **PostgreSQL**: Base de datos para persistencia de datos

## Requisitos Previos

- Kubernetes 1.19+
- Helm 3.0+
- Un controlador de Ingress instalado (por ejemplo, NGINX Ingress Controller)
- Cert-Manager (opcional, para certificados TLS automáticos)

## Instalación

### Instalación Básica

```bash
# Instalar el chart
helm install release-planner ./helm/my-app-chart

# O con un release name personalizado
helm install my-release ./helm/my-app-chart
```

### Instalación con Valores Personalizados

```bash
# Crear un archivo values-custom.yaml con tus configuraciones
helm install release-planner ./helm/my-app-chart -f values-custom.yaml
```

### Instalación con Valores desde Línea de Comandos

```bash
helm install release-planner ./helm/my-app-chart \
  --set frontend.image.tag=1.0.1 \
  --set api.image.tag=1.0.1 \
  --set postgresql.auth.password=miPasswordSegura \
  --set ingress.hosts[0].host=release-planner.midominio.com
```

## Configuración

### Valores Principales

| Parámetro | Descripción | Valor por Defecto |
|-----------|-------------|-------------------|
| `frontend.enabled` | Habilitar despliegue del frontend | `true` |
| `frontend.replicaCount` | Número de réplicas del frontend | `2` |
| `frontend.image.repository` | Repositorio de imagen del frontend | `release-planner-frontend` |
| `frontend.image.tag` | Tag de la imagen | `1.0.0` |
| `api.enabled` | Habilitar despliegue de la API | `true` |
| `api.replicaCount` | Número de réplicas de la API | `2` |
| `api.image.repository` | Repositorio de imagen de la API | `release-planner-api` |
| `api.image.tag` | Tag de la imagen | `1.0.0` |
| `postgresql.enabled` | Habilitar PostgreSQL | `true` |
| `postgresql.persistence.enabled` | Habilitar persistencia de datos | `true` |
| `postgresql.persistence.size` | Tamaño del volumen persistente | `10Gi` |
| `ingress.enabled` | Habilitar Ingress | `true` |
| `ingress.hosts[0].host` | Hostname para el Ingress | `release-planner.example.com` |

### Recursos y Límites

Por defecto, el chart configura recursos y límites para todos los componentes:

- **Frontend**: 100m CPU / 128Mi memoria (requests), 500m CPU / 256Mi memoria (limits)
- **API**: 200m CPU / 256Mi memoria (requests), 1000m CPU / 512Mi memoria (limits)
- **PostgreSQL**: 250m CPU / 512Mi memoria (requests), 2000m CPU / 2Gi memoria (limits)

### Health Checks

Todos los servicios incluyen health checks configurados:

- **Frontend**: `/health` endpoint
- **API**: `/api/health` endpoint
- **PostgreSQL**: `pg_isready` command

### Persistencia de Datos

PostgreSQL utiliza un PersistentVolumeClaim para almacenar datos. Por defecto:
- Tamaño: 10Gi
- Access Mode: ReadWriteOnce
- Storage Class: Usa la clase de almacenamiento por defecto del cluster

Para personalizar:

```yaml
postgresql:
  persistence:
    enabled: true
    size: 20Gi
    storageClass: "fast-ssd"
    accessMode: ReadWriteOnce
```

### Seguridad

#### Secrets de PostgreSQL

Las contraseñas de PostgreSQL se gestionan mediante Secrets de Kubernetes. Por defecto, se crea un Secret con el nombre `postgresql-secret`.

**IMPORTANTE**: Cambia las contraseñas por defecto en producción:

```bash
helm install release-planner ./helm/my-app-chart \
  --set secrets.postgresql.password=tuPasswordSeguro123 \
  --set secrets.postgresql.adminPassword=tuAdminPasswordSeguro123
```

O usa un sistema de gestión de secretos como:
- HashiCorp Vault
- Sealed Secrets
- External Secrets Operator

#### Service Account

El chart crea un ServiceAccount por defecto. Puedes deshabilitarlo o usar uno existente:

```yaml
serviceAccount:
  create: false
  name: "mi-service-account-existente"
```

### Ingress

El Ingress está configurado para enrutar:
- `/` → Frontend (React)
- `/api` → Backend API (NestJS)

Ejemplo de configuración:

```yaml
ingress:
  enabled: true
  className: "nginx"
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  hosts:
    - host: release-planner.example.com
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
        - release-planner.example.com
```

## Despliegue

### Construir y Publicar Imágenes Docker

Antes de desplegar, necesitas construir y publicar las imágenes Docker:

```bash
# Construir imagen del frontend
docker build -t release-planner-frontend:1.0.0 -f apps/portal/Dockerfile .

# Construir imagen de la API
docker build -t release-planner-api:1.0.0 -f apps/api/Dockerfile .

# Publicar imágenes (ejemplo con Docker Hub)
docker tag release-planner-frontend:1.0.0 tu-registry/release-planner-frontend:1.0.0
docker tag release-planner-api:1.0.0 tu-registry/release-planner-api:1.0.0
docker push tu-registry/release-planner-frontend:1.0.0
docker push tu-registry/release-planner-api:1.0.0
```

### Actualizar values.yaml con tu Registry

```yaml
global:
  imageRegistry: "tu-registry.io"

frontend:
  image:
    repository: release-planner-frontend
    tag: "1.0.0"

api:
  image:
    repository: release-planner-api
    tag: "1.0.0"
```

## Comandos Útiles

### Verificar el Despliegue

```bash
# Ver todos los recursos desplegados
kubectl get all -l app.kubernetes.io/instance=release-planner

# Ver logs del frontend
kubectl logs -l app.kubernetes.io/component=frontend

# Ver logs de la API
kubectl logs -l app.kubernetes.io/component=api

# Ver logs de PostgreSQL
kubectl logs -l app.kubernetes.io/component=postgresql
```

### Escalar Aplicación

```bash
# Escalar frontend a 3 réplicas
kubectl scale deployment release-planner-frontend --replicas=3

# Escalar API a 3 réplicas
kubectl scale deployment release-planner-api --replicas=3
```

### Actualizar la Aplicación

```bash
# Actualizar con nuevos valores
helm upgrade release-planner ./helm/my-app-chart -f values-custom.yaml

# Actualizar solo la imagen de la API
helm upgrade release-planner ./helm/my-app-chart \
  --set api.image.tag=1.0.1
```

### Rollback

```bash
# Ver historial de releases
helm history release-planner

# Hacer rollback a una versión anterior
helm rollback release-planner 1
```

## Desinstalación

```bash
helm uninstall release-planner
```

**Nota**: Esto eliminará todos los recursos excepto los PersistentVolumeClaims. Si quieres eliminar también los datos de PostgreSQL:

```bash
kubectl delete pvc -l app.kubernetes.io/instance=release-planner
```

## Troubleshooting

### Los pods no inician

```bash
# Ver eventos
kubectl get events --sort-by='.lastTimestamp'

# Describir pod
kubectl describe pod <pod-name>

# Ver logs
kubectl logs <pod-name>
```

### Problemas de conexión a la base de datos

```bash
# Verificar que PostgreSQL está corriendo
kubectl get pods -l app.kubernetes.io/component=postgresql

# Verificar el Secret
kubectl get secret postgresql-secret -o yaml

# Probar conexión desde un pod de la API
kubectl exec -it <api-pod-name> -- sh
# Dentro del pod:
# psql -h release-planner-postgresql -U releaseplanner -d releaseplanner
```

### Problemas con Ingress

```bash
# Verificar Ingress
kubectl get ingress
kubectl describe ingress release-planner

# Verificar servicios
kubectl get svc
kubectl describe svc release-planner-frontend
kubectl describe svc release-planner-api
```

## Soporte

Para más información sobre la aplicación Release Planner, consulta la documentación del proyecto.

