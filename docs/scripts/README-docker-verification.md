# 🔍 Scripts de Verificación de Docker

Este directorio contiene scripts automatizados para verificar el correcto funcionamiento del deployment de Docker.

## 📜 Scripts Disponibles

### 1. `verify-deployment.sh`

**Descripción:** Verifica que un deployment existente esté funcionando correctamente.

**Uso:**
```bash
chmod +x scripts/verify-deployment.sh
./scripts/verify-deployment.sh
```

**Verifica:**
- ✅ Contenedores base (PostgreSQL, Redis)
- ✅ Aplicaciones (API, Frontend)
- ✅ Health checks de todos los servicios
- ✅ Endpoints HTTP respondiendo
- ✅ Volúmenes de datos
- ✅ Redes Docker
- ✅ Logs recientes de servicios

**Cuándo usar:** Después de levantar servicios con docker-compose para verificar que todo funcione.

---

### 2. `test-docker-build.sh`

**Descripción:** Prueba que las imágenes Docker se construyan correctamente sin errores.

**Uso:**
```bash
chmod +x scripts/test-docker-build.sh
./scripts/test-docker-build.sh
```

**Verifica:**
- ✅ Build de imagen de API (producción)
- ✅ Build de imagen de Portal (producción)
- ✅ Build de imagen de API (desarrollo)
- ✅ Build de imagen de Portal (desarrollo)
- ✅ Que NO existan imágenes de mobile
- ✅ Tamaño de imágenes generadas

**Cuándo usar:** Antes de hacer push de cambios para verificar que los Dockerfiles sean correctos.

**Nota:** Crea imágenes con tag `:test` y `:dev`. Para limpiarlas:
```bash
docker rmi release-planner-api:test release-planner-portal:test
docker rmi release-planner-api:dev release-planner-portal:dev
```

---

### 3. `test-docker-compose.sh`

**Descripción:** Prueba rápida de las configuraciones docker-compose levantando servicios temporalmente.

**Uso:**
```bash
chmod +x scripts/test-docker-compose.sh

# Modo desarrollo (por defecto)
./scripts/test-docker-compose.sh

# Modo producción
./scripts/test-docker-compose.sh prod

# Modo con monitoreo
./scripts/test-docker-compose.sh monitoring
```

**Verifica:**
- ✅ Validación de archivos de configuración
- ✅ Ausencia de referencias a mobile
- ✅ Levantamiento exitoso de servicios
- ✅ Contenedores en estado running
- ✅ Endpoints respondiendo correctamente
- ✅ Logs de servicios sin errores críticos

**Cuándo usar:** Para probar rápidamente una configuración docker-compose completa.

**Nota:** Los servicios quedan corriendo al finalizar. Para detenerlos:
```bash
# Desarrollo
docker-compose -f docker-compose.dev.yml down -v

# Producción
docker-compose -f docker-compose.prod.yml down -v

# Con monitoreo
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml down -v
```

---

## 🎯 Flujo de Verificación Recomendado

### 1. Antes de Commit

```bash
# Verificar que las imágenes se construyan
./scripts/test-docker-build.sh
```

### 2. Después de Cambios en docker-compose

```bash
# Probar la configuración
./scripts/test-docker-compose.sh dev
```

### 3. Verificar Deployment Existente

```bash
# Levantar servicios
docker-compose -f docker-compose.dev.yml up -d

# Verificar que todo funcione
./scripts/verify-deployment.sh
```

### 4. Antes de Producción

```bash
# Probar build de producción
./scripts/test-docker-build.sh

# Probar configuración de producción
./scripts/test-docker-compose.sh prod

# Verificar
./scripts/verify-deployment.sh
```

---

## 📋 Interpretación de Resultados

### ✅ Símbolos de Estado

- `✓` - **Verde**: Verificación exitosa
- `✗` - **Rojo**: Verificación fallida (requiere atención)
- `⚠` - **Amarillo**: Advertencia (puede requerir atención)

### Ejemplos de Output

**Exitoso:**
```
✓ release-planner-postgres está corriendo
✓ release-planner-redis está corriendo
✓ release-planner-api está corriendo
✓ release-planner-frontend está corriendo
```

**Con Advertencias:**
```
✓ release-planner-api está corriendo
⚠ API no responde aún (puede estar iniciando)
```
*Esperar unos segundos y volver a verificar.*

**Con Errores:**
```
✗ release-planner-api NO está corriendo
```
*Ver logs con: `docker logs release-planner-api`*

---

## 🐛 Troubleshooting

### Script no tiene permisos de ejecución

```bash
chmod +x scripts/*.sh
```

### Docker no está disponible

```bash
# Verificar que Docker esté corriendo
docker ps

# Si no está corriendo, iniciarlo
# En Windows: Iniciar Docker Desktop
# En Linux: sudo systemctl start docker
```

### Puertos ya en uso

Si los scripts fallan porque los puertos ya están en uso:

```bash
# Ver qué está usando los puertos
lsof -i :3000  # API
lsof -i :5173  # Frontend
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Detener contenedores anteriores
docker-compose down
```

### Contenedores no se detienen

```bash
# Detener y remover todo forzadamente
docker-compose down -v --remove-orphans

# Si persiste, eliminar contenedores manualmente
docker rm -f $(docker ps -aq --filter "name=release-planner")
```

---

## 📚 Documentación Relacionada

- **[DOCKER_VERIFICATION.md](../docs/ci-cd/DOCKER_VERIFICATION.md)** - Guía completa de verificación
- **[MOBILE_REMOVAL_AND_DOCKER_VERIFICATION.md](../docs/ci-cd/MOBILE_REMOVAL_AND_DOCKER_VERIFICATION.md)** - Resumen de cambios
- **[README.DOCKER.md](../docs/ci-cd/README.DOCKER.md)** - Documentación de Docker
- **[DEPLOYMENT.md](../docs/ci-cd/DEPLOYMENT.md)** - Guía de despliegue

---

## 💡 Tips

### Ejecutar scripts desde cualquier directorio

```bash
# Desde la raíz del proyecto
./scripts/verify-deployment.sh

# Desde cualquier subdirectorio
cd apps/api
../../scripts/verify-deployment.sh
```

### Ver logs en tiempo real durante verificación

```bash
# En una terminal
docker-compose -f docker-compose.dev.yml logs -f

# En otra terminal
./scripts/verify-deployment.sh
```

### Verificar solo un servicio específico

```bash
# Ver logs de un servicio
docker logs -f release-planner-api

# Verificar health check
docker inspect --format='{{.State.Health.Status}}' release-planner-api

# Reiniciar solo un servicio
docker-compose -f docker-compose.dev.yml restart api
```

---

## 🔄 Actualización de Scripts

Si necesitas modificar o agregar verificaciones a los scripts:

1. Editar el script correspondiente
2. Probar los cambios localmente
3. Documentar en este README
4. Actualizar `DOCKER_VERIFICATION.md` si aplica

---

**Última actualización:** Diciembre 6, 2025  
**Scripts creados por:** Sistema de Automatización  
**Versión:** 1.0

