#!/bin/bash

# Script para verificar el deployment de Docker
# Este script verifica que todos los contenedores estén corriendo correctamente

set -e

echo "🔍 Verificando Deployment de Release Planner"
echo "=============================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar si un contenedor está corriendo
check_container() {
    local container_name=$1
    local expected_status="running"
    
    if docker ps --filter "name=$container_name" --filter "status=running" | grep -q "$container_name"; then
        echo -e "${GREEN}✓${NC} $container_name está corriendo"
        return 0
    else
        echo -e "${RED}✗${NC} $container_name NO está corriendo"
        return 1
    fi
}

# Función para verificar healthcheck de un contenedor
check_health() {
    local container_name=$1
    local health=$(docker inspect --format='{{.State.Health.Status}}' "$container_name" 2>/dev/null || echo "no-healthcheck")
    
    if [ "$health" = "healthy" ]; then
        echo -e "${GREEN}✓${NC} $container_name está saludable"
        return 0
    elif [ "$health" = "no-healthcheck" ]; then
        echo -e "${YELLOW}⚠${NC} $container_name no tiene healthcheck configurado"
        return 0
    else
        echo -e "${RED}✗${NC} $container_name health status: $health"
        return 1
    fi
}

# Función para verificar endpoint HTTP
check_endpoint() {
    local name=$1
    local url=$2
    local expected_code=$3
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$response" = "$expected_code" ]; then
        echo -e "${GREEN}✓${NC} $name responde correctamente (HTTP $response)"
        return 0
    else
        echo -e "${RED}✗${NC} $name no responde correctamente (HTTP $response, esperado $expected_code)"
        return 1
    fi
}

echo "1️⃣  Verificando contenedores base..."
echo "-----------------------------------"
check_container "release-planner-postgres" || exit 1
check_container "release-planner-redis" || exit 1
echo ""

echo "2️⃣  Verificando aplicaciones..."
echo "-------------------------------"
check_container "release-planner-api" || exit 1
check_container "release-planner-frontend" || exit 1
echo ""

echo "3️⃣  Verificando health checks..."
echo "---------------------------------"
check_health "release-planner-postgres" || exit 1
check_health "release-planner-redis" || exit 1
check_health "release-planner-api" || exit 1
check_health "release-planner-frontend" || exit 1
echo ""

echo "4️⃣  Verificando endpoints HTTP..."
echo "----------------------------------"
# Esperar un poco para que los servicios estén listos
sleep 5

# Verificar API
check_endpoint "API Health" "http://localhost:3000/api/health" "200" || echo -e "${YELLOW}⚠${NC} API podría estar iniciando..."

# Verificar Frontend
check_endpoint "Frontend" "http://localhost:5173" "200" || echo -e "${YELLOW}⚠${NC} Frontend podría estar iniciando..."

echo ""
echo "5️⃣  Información de volúmenes..."
echo "--------------------------------"
docker volume ls | grep "release-planner" || echo "No se encontraron volúmenes"
echo ""

echo "6️⃣  Uso de red..."
echo "----------------"
docker network inspect release-planner-network &>/dev/null && \
    echo -e "${GREEN}✓${NC} Red release-planner-network existe" || \
    echo -e "${RED}✗${NC} Red release-planner-network NO existe"
echo ""

echo "7️⃣  Logs recientes..."
echo "---------------------"
echo "API (últimas 10 líneas):"
docker logs --tail 10 release-planner-api 2>/dev/null || echo "No se pudieron obtener logs de API"
echo ""
echo "Frontend (últimas 5 líneas):"
docker logs --tail 5 release-planner-frontend 2>/dev/null || echo "No se pudieron obtener logs de Frontend"
echo ""

echo "=============================================="
echo -e "${GREEN}✓${NC} Verificación completada"
echo ""
echo "💡 Comandos útiles:"
echo "   - Ver logs de API:      docker logs -f release-planner-api"
echo "   - Ver logs de Frontend: docker logs -f release-planner-frontend"
echo "   - Reiniciar servicios:  docker-compose restart"
echo "   - Detener servicios:    docker-compose down"
echo "   - Ver recursos:         docker stats"
echo ""

