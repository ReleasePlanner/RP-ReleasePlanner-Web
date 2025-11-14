# Monitoreo con Prometheus y Grafana

Este directorio contiene la configuración completa de monitoreo para el proyecto Release Planner usando Prometheus y Grafana.

## 📊 Stack de Monitoreo

- **Prometheus**: Recolector y almacén de métricas
- **Grafana**: Visualización de métricas y dashboards
- **PostgreSQL Exporter**: Exporta métricas de PostgreSQL
- **Redis Exporter**: Exporta métricas de Redis
- **Node Exporter**: Métricas del sistema

## 🚀 Inicio Rápido

### Desarrollo Local

```bash
# Iniciar servicios principales + monitoreo
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d

# Ver logs
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml logs -f
```

### Acceso a Herramientas

- **Grafana**: http://localhost:3001
  - Usuario: `admin` (por defecto)
  - Contraseña: `admin` (por defecto, cambiar en producción)
- **Prometheus**: http://localhost:9090
- **API Metrics**: http://localhost:3000/api/metrics
- **PostgreSQL Exporter**: http://localhost:9187/metrics
- **Redis Exporter**: http://localhost:9121/metrics
- **Node Exporter**: http://localhost:9100/metrics

## 📁 Estructura

```
monitoring/
├── prometheus/
│   ├── prometheus.yml      # Configuración de Prometheus
│   └── alerts.yml          # Reglas de alertas
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/    # Configuración de datasources
│   │   └── dashboards/     # Configuración de dashboards
│   └── dashboards/         # Dashboards JSON
│       ├── api-overview.json
│       ├── postgresql-overview.json
│       └── system-overview.json
└── README.md               # Este archivo
```

## 🔧 Configuración

### Variables de Entorno

```env
# Grafana
GRAFANA_USER=admin
GRAFANA_PASSWORD=admin
GRAFANA_SECRET_KEY=changeme

# PostgreSQL (para exporter)
POSTGRES_USER=releaseplanner
POSTGRES_PASSWORD=releaseplanner123
POSTGRES_DB=releaseplanner
```

### Prometheus Targets

Prometheus está configurado para recolectar métricas de:

1. **API** (`api:3000/api/metrics`)
   - Métricas HTTP (requests, duration, errors)
   - Métricas de Node.js (memory, CPU, event loop)
   - Métricas personalizadas de la aplicación

2. **PostgreSQL** (`postgres-exporter:9187`)
   - Conexiones activas
   - Tamaño de base de datos
   - Transacciones por segundo
   - Performance de queries

3. **Redis** (`redis-exporter:9121`)
   - Uso de memoria
   - Comandos por segundo
   - Clientes conectados
   - Hit/miss ratio

4. **Sistema** (`node-exporter:9100`)
   - CPU usage
   - Memory usage
   - Disk usage
   - Network traffic

## 📈 Dashboards

### API Overview
- Request rate por método y ruta
- Tiempo de respuesta (percentiles)
- Tasa de errores (4xx, 5xx)
- Estado de la API

### PostgreSQL Overview
- Conexiones activas
- Tamaño de base de datos
- Transacciones por segundo
- Performance de queries

### System Overview
- CPU usage
- Memory usage
- Disk usage
- Network traffic

## 🚨 Alertas

Las alertas están configuradas en `prometheus/alerts.yml`:

- **API Down**: API no responde
- **API High Response Time**: Tiempo de respuesta > 2s
- **API High Error Rate**: Tasa de errores > 10%
- **PostgreSQL Down**: PostgreSQL no responde
- **PostgreSQL High Connections**: > 80 conexiones
- **PostgreSQL High Disk Usage**: Base de datos > 50GB
- **Redis Down**: Redis no responde
- **Redis High Memory**: Uso de memoria > 90%
- **High CPU/Memory/Disk**: Uso del sistema > 80-85%

## 🔍 Métricas Disponibles

### API Metrics

- `http_requests_total`: Total de requests HTTP
- `http_request_duration_seconds`: Duración de requests
- `nodejs_heap_size_total_bytes`: Tamaño del heap
- `nodejs_heap_size_used_bytes`: Memoria usada del heap
- `nodejs_eventloop_lag_seconds`: Lag del event loop

### PostgreSQL Metrics

- `pg_stat_database_numbackends`: Conexiones activas
- `pg_database_size_bytes`: Tamaño de la base de datos
- `pg_stat_database_xact_commit`: Transacciones commit
- `pg_stat_database_xact_rollback`: Transacciones rollback
- `pg_stat_database_tup_*`: Operaciones de tuplas

### Redis Metrics

- `redis_memory_used_bytes`: Memoria usada
- `redis_memory_max_bytes`: Memoria máxima
- `redis_commands_processed_total`: Comandos procesados
- `redis_connected_clients`: Clientes conectados
- `redis_keyspace_hits_total`: Cache hits
- `redis_keyspace_misses_total`: Cache misses

## 🛠️ Troubleshooting

### Prometheus no recolecta métricas

1. Verificar que los servicios estén corriendo:
   ```bash
   docker-compose ps
   ```

2. Verificar conectividad:
   ```bash
   curl http://localhost:3000/api/metrics
   curl http://localhost:9187/metrics
   ```

3. Verificar logs de Prometheus:
   ```bash
   docker-compose logs prometheus
   ```

### Grafana no muestra datos

1. Verificar que Prometheus esté configurado como datasource
2. Verificar que los dashboards estén cargados
3. Verificar la configuración de time range en Grafana

### PostgreSQL Exporter no funciona

1. Verificar credenciales de PostgreSQL
2. Verificar conectividad desde el exporter:
   ```bash
   docker exec release-planner-postgres-exporter wget -qO- http://localhost:9187/metrics
   ```

## 📚 Recursos

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [PostgreSQL Exporter](https://github.com/prometheus-community/postgres_exporter)
- [Redis Exporter](https://github.com/oliver006/redis_exporter)
- [Node Exporter](https://github.com/prometheus/node_exporter)

