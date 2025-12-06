#!/bin/bash

# Script de prueba rápida de Docker Compose
# Levanta los servicios, verifica que funcionen y los detiene

set -e

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧪 Prueba Rápida de Docker Compose${NC}"
echo "====================================="
echo ""

# Función para limpiar al salir
cleanup() {
    echo ""
    echo -e "${YELLOW}🧹 Limpiando...${NC}"
    docker-compose down -v 2>/dev/null || true
    docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
}

trap cleanup EXIT

# Verificar que docker-compose esté instalado
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗ docker-compose no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} docker-compose encontrado"
echo ""

# Modo de prueba: dev o prod
MODE="${1:-dev}"

if [ "$MODE" = "prod" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    echo -e "${BLUE}📦 Probando configuración de PRODUCCIÓN${NC}"
elif [ "$MODE" = "monitoring" ]; then
    COMPOSE_FILE="docker-compose.yml -f docker-compose.monitoring.yml"
    echo -e "${BLUE}📊 Probando configuración con MONITOREO${NC}"
else
    COMPOSE_FILE="docker-compose.dev.yml"
    echo -e "${BLUE}🔧 Probando configuración de DESARROLLO${NC}"
fi

echo ""

# Validar archivos docker-compose
echo "1️⃣  Validando archivos de configuración..."
echo "-------------------------------------------"
if [ "$MODE" = "monitoring" ]; then
    docker-compose -f docker-compose.yml config > /dev/null && \
    docker-compose -f docker-compose.monitoring.yml config > /dev/null && \
    echo -e "${GREEN}✓${NC} Archivos de configuración válidos" || \
    (echo -e "${RED}✗${NC} Error en archivos de configuración" && exit 1)
else
    docker-compose -f $COMPOSE_FILE config > /dev/null && \
    echo -e "${GREEN}✓${NC} Archivos de configuración válidos" || \
    (echo -e "${RED}✗${NC} Error en archivos de configuración" && exit 1)
fi
echo ""

# Verificar que no haya referencias a mobile
echo "2️⃣  Verificando que no existan referencias a mobile..."
echo "--------------------------------------------------------"
if grep -ri "mobile" docker-compose*.yml 2>/dev/null | grep -v "^#" | grep -v "Binary"; then
    echo -e "${RED}✗${NC} Se encontraron referencias a mobile en docker-compose"
    exit 1
else
    echo -e "${GREEN}✓${NC} No se encontraron referencias a mobile"
fi
echo ""

# Levantar servicios
echo "3️⃣  Levantando servicios..."
echo "---------------------------"
if [ "$MODE" = "monitoring" ]; then
    docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d
else
    docker-compose -f $COMPOSE_FILE up -d
fi
echo ""

# Esperar a que los servicios estén listos
echo "4️⃣  Esperando a que los servicios estén listos..."
echo "---------------------------------------------------"
echo "Esperando 30 segundos..."
sleep 30

# Verificar contenedores
echo ""
echo "5️⃣  Verificando contenedores..."
echo "--------------------------------"
if [ "$MODE" = "monitoring" ]; then
    docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml ps
else
    docker-compose -f $COMPOSE_FILE ps
fi
echo ""

# Contar contenedores corriendo
if [ "$MODE" = "monitoring" ]; then
    RUNNING=$(docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml ps --filter "status=running" -q | wc -l)
    EXPECTED=9  # postgres, redis, api, frontend, prometheus, grafana, postgres-exporter, redis-exporter, node-exporter
else
    RUNNING=$(docker-compose -f $COMPOSE_FILE ps --filter "status=running" -q | wc -l)
    EXPECTED=4  # postgres, redis, api, frontend
fi

if [ $RUNNING -ge $EXPECTED ]; then
    echo -e "${GREEN}✓${NC} $RUNNING contenedores corriendo (esperados: $EXPECTED)"
else
    echo -e "${RED}✗${NC} Solo $RUNNING contenedores corriendo (esperados: $EXPECTED)"
    echo "Ver logs con: docker-compose -f $COMPOSE_FILE logs"
fi
echo ""

# Verificar endpoints (solo si no es producción o si está disponible)
if [ "$MODE" != "prod" ]; then
    echo "6️⃣  Verificando endpoints..."
    echo "-----------------------------"
    
    # API
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} API responde en http://localhost:3000/api/health"
    else
        echo -e "${YELLOW}⚠${NC} API no responde aún (puede estar iniciando)"
    fi
    
    # Frontend
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Frontend responde en http://localhost:5173"
    else
        echo -e "${YELLOW}⚠${NC} Frontend no responde aún (puede estar iniciando)"
    fi
    
    # Prometheus (si está en modo monitoring)
    if [ "$MODE" = "monitoring" ]; then
        if curl -s http://localhost:9090/-/healthy > /dev/null 2>&1; then
            echo -e "${GREEN}✓${NC} Prometheus responde en http://localhost:9090"
        else
            echo -e "${YELLOW}⚠${NC} Prometheus no responde aún"
        fi
        
        # Grafana
        if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
            echo -e "${GREEN}✓${NC} Grafana responde en http://localhost:3001"
        else
            echo -e "${YELLOW}⚠${NC} Grafana no responde aún"
        fi
    fi
    echo ""
fi

# Mostrar logs recientes
echo "7️⃣  Logs recientes (últimas 5 líneas por servicio)..."
echo "-------------------------------------------------------"
if [ "$MODE" = "monitoring" ]; then
    docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml logs --tail=5
else
    docker-compose -f $COMPOSE_FILE logs --tail=5
fi
echo ""

echo "=============================================="
echo -e "${GREEN}✓${NC} Prueba completada"
echo ""
echo "💡 Los servicios seguirán corriendo. Para detenerlos:"
if [ "$MODE" = "monitoring" ]; then
    echo "   docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml down -v"
else
    echo "   docker-compose -f $COMPOSE_FILE down -v"
fi
echo ""
echo "💡 Para ver logs en tiempo real:"
if [ "$MODE" = "monitoring" ]; then
    echo "   docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml logs -f"
else
    echo "   docker-compose -f $COMPOSE_FILE logs -f"
fi
echo ""

# No ejecutar cleanup automáticamente para dejar los servicios corriendo
trap - EXIT

