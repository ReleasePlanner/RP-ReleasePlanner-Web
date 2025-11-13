# GitHub Actions CI/CD Workflows

Este directorio contiene los workflows de GitHub Actions para CI/CD del proyecto Release Planner.

## Workflows Disponibles

### 1. CI - API (`ci-api.yml`)
Ejecuta tests y build de la API cuando hay cambios en `apps/api/`.

**Triggers:**
- Push a `main` o `develop` con cambios en API
- Pull requests a `main` o `develop` con cambios en API

**Jobs:**
- `test`: Ejecuta linter y tests con PostgreSQL y Redis
- `build`: Construye la aplicación y guarda artefactos

### 2. CI - Portal (`ci-portal.yml`)
Ejecuta tests y build del Portal cuando hay cambios en `apps/portal/`.

**Triggers:**
- Push a `main` o `develop` con cambios en Portal
- Pull requests a `main` o `develop` con cambios en Portal

**Jobs:**
- `test`: Ejecuta linter y tests
- `build`: Construye la aplicación y guarda artefactos

### 3. CI - All (`ci-all.yml`)
Ejecuta tests y build de todas las aplicaciones.

**Triggers:**
- Push a `main` o `develop`
- Pull requests a `main` o `develop`

**Jobs:**
- `test-api`: Tests de API
- `test-portal`: Tests de Portal
- `lint`: Linter de todas las aplicaciones
- `build`: Build de todas las aplicaciones

### 4. PR Checks (`pr-checks.yml`)
Ejecuta checks inteligentes solo para archivos cambiados en PRs.

**Triggers:**
- Pull requests abiertos, sincronizados o reabiertos

**Características:**
- Detecta automáticamente qué aplicaciones cambiaron
- Solo ejecuta tests para aplicaciones modificadas
- Optimiza tiempo de ejecución

### 5. CD - Deploy (`cd-deploy.yml`)
Despliega automáticamente cuando se hace merge a `main`.

**Triggers:**
- Push a `main` (ignora cambios en `.md` y `.gitignore`)

**Jobs:**
- `build-and-push`: Construye y publica imágenes Docker a GitHub Container Registry
- `deploy-staging`: Despliega a staging cuando hay push a `develop`
- `deploy-production`: Despliega a producción cuando hay push a `main`

### 6. CD - Simple Deploy (`cd-simple.yml`)
Despliegue simple vía SSH (alternativa sin Kubernetes).

**Triggers:**
- Cuando el workflow "CI - All" completa exitosamente
- Solo en branch `main`

**Características:**
- Descarga artefactos de build
- Despliega vía SSH
- Personalizable para diferentes servidores

## Configuración Requerida

### Secrets de GitHub

Configura estos secrets en tu repositorio (Settings → Secrets and variables → Actions):

#### Para CI (Opcional)
- `VITE_API_URL`: URL de la API para build del portal (default: `http://localhost:3000/api`)

#### Para CD con Kubernetes
- `KUBECONFIG_STAGING`: Configuración de Kubernetes para staging
- `KUBECONFIG_PRODUCTION`: Configuración de Kubernetes para producción
- `KUBERNETES_ENABLED`: `true` para habilitar despliegue con Kubernetes

#### Para CD Simple (SSH)
- `SSH_PRIVATE_KEY`: Clave privada SSH para acceso al servidor
- `DEPLOY_HOST`: Host del servidor de despliegue
- `DEPLOY_USER`: Usuario SSH para despliegue
- `DOCKER_COMPOSE_ENABLED`: `true` para habilitar despliegue con Docker Compose

#### Para Container Registry
- `GITHUB_TOKEN`: Se configura automáticamente, no requiere acción manual

### Variables de Entorno

Las siguientes variables se configuran automáticamente en los workflows:

**Para Tests:**
- `DATABASE_HOST`: localhost
- `DATABASE_PORT`: 5432
- `DATABASE_USER`: releaseplanner
- `DATABASE_PASSWORD`: releaseplanner123
- `DATABASE_NAME`: releaseplanner_test
- `REDIS_HOST`: localhost
- `REDIS_PORT`: 6379
- `JWT_SECRET`: test-secret-key-for-ci
- `JWT_REFRESH_SECRET`: test-refresh-secret-key-for-ci
- `NODE_ENV`: test

## Uso

### Desarrollo Normal

1. **Crear una rama:**
   ```bash
   git checkout -b feature/mi-feature
   ```

2. **Hacer cambios y commits:**
   ```bash
   git add .
   git commit -m "feat: nueva funcionalidad"
   ```

3. **Push y crear PR:**
   ```bash
   git push origin feature/mi-feature
   ```

4. **Los workflows se ejecutan automáticamente:**
   - `PR Checks` detecta cambios y ejecuta tests relevantes
   - `CI - API` o `CI - Portal` se ejecutan según cambios

5. **Merge a main:**
   - `CI - All` ejecuta todos los tests
   - `CD - Deploy` despliega automáticamente

### Despliegue Manual

Si necesitas desplegar manualmente:

1. **Ir a Actions en GitHub**
2. **Seleccionar el workflow "CD - Deploy"**
3. **Click en "Run workflow"**
4. **Seleccionar branch y ejecutar**

## Optimizaciones

### Caché de Dependencias
- Los workflows usan caché de npm para acelerar instalaciones
- Caché de Docker Buildx para builds más rápidos

### Ejecución Condicional
- Los workflows solo se ejecutan cuando hay cambios relevantes
- `PR Checks` solo ejecuta tests para aplicaciones modificadas

### Paralelización
- Tests de API y Portal se ejecutan en paralelo
- Builds se ejecutan después de tests exitosos

## Monitoreo

### Badges de Estado

Puedes agregar badges a tu README:

```markdown
![CI - API](https://github.com/USERNAME/REPO/workflows/CI%20-%20API/badge.svg)
![CI - Portal](https://github.com/USERNAME/REPO/workflows/CI%20-%20Portal/badge.svg)
![CI - All](https://github.com/USERNAME/REPO/workflows/CI%20-%20All/badge.svg)
```

### Notificaciones

Los workflows pueden configurarse para enviar notificaciones:
- Slack
- Email
- Discord
- Microsoft Teams

## Troubleshooting

### Tests Fallan
1. Verificar que los servicios (PostgreSQL, Redis) estén corriendo
2. Verificar variables de entorno
3. Revisar logs en GitHub Actions

### Build Fallan
1. Verificar que todas las dependencias estén instaladas
2. Verificar que no haya errores de TypeScript
3. Revisar logs de build

### Deploy Fallan
1. Verificar que los secrets estén configurados
2. Verificar acceso a Kubernetes/SSH
3. Revisar permisos de GitHub Actions

## Personalización

### Agregar Nuevos Entornos

Edita `cd-deploy.yml` y agrega un nuevo job:

```yaml
deploy-dev:
  name: Deploy to Development
  runs-on: ubuntu-latest
  needs: build-and-push
  if: github.ref == 'refs/heads/develop'
  environment:
    name: development
    url: ${{ secrets.DEV_URL }}
  steps:
    # ... tus pasos de despliegue
```

### Agregar Notificaciones

Agrega un step al final de los workflows:

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployment completed'
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Mejores Prácticas

1. **Siempre revisa los tests antes de merge**
2. **Usa branches descriptivos**
3. **Mantén los workflows simples y enfocados**
4. **Documenta cambios en workflows**
5. **Revisa logs cuando algo falle**
6. **Usa environments para diferentes entornos**
7. **Protege branches principales con branch protection**

## Recursos

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Buildx](https://docs.docker.com/buildx/)
- [Helm Documentation](https://helm.sh/docs/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

