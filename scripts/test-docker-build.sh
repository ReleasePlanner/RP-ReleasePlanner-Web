#!/bin/bash

# Script para probar el build de las imágenes Docker sin mobile
# Verifica que las imágenes se construyan correctamente

set -e

echo "🔨 Probando Build de Imágenes Docker"
echo "====================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Función para construir y verificar imagen
build_and_verify() {
    local context=$1
    local dockerfile=$2
    local tag=$3
    local description=$4
    
    echo "📦 Construyendo: $description"
    echo "   Context: $context"
    echo "   Dockerfile: $dockerfile"
    echo "   Tag: $tag"
    echo ""
    
    if docker build -f "$dockerfile" -t "$tag" "$context"; then
        echo -e "${GREEN}✓${NC} $description construida exitosamente"
        
        # Verificar tamaño de imagen
        size=$(docker images "$tag" --format "{{.Size}}")
        echo "   Tamaño: $size"
        
        return 0
    else
        echo -e "${RED}✗${NC} Error al construir $description"
        return 1
    fi
}

echo "1️⃣  Construyendo imagen de API (producción)..."
echo "-----------------------------------------------"
build_and_verify "." "apps/api/Dockerfile" "release-planner-api:test" "API (producción)" || exit 1
echo ""

echo "2️⃣  Construyendo imagen de Portal (producción)..."
echo "---------------------------------------------------"
build_and_verify "." "apps/portal/Dockerfile" "release-planner-portal:test" "Portal (producción)" || exit 1
echo ""

echo "3️⃣  Construyendo imagen de API (desarrollo)..."
echo "------------------------------------------------"
if [ -f "apps/api/Dockerfile.dev" ]; then
    build_and_verify "." "apps/api/Dockerfile.dev" "release-planner-api:dev" "API (desarrollo)" || echo -e "${YELLOW}⚠${NC} No se pudo construir imagen de desarrollo de API"
else
    echo -e "${YELLOW}⚠${NC} Dockerfile.dev de API no encontrado"
fi
echo ""

echo "4️⃣  Construyendo imagen de Portal (desarrollo)..."
echo "---------------------------------------------------"
if [ -f "apps/portal/Dockerfile.dev" ]; then
    build_and_verify "." "apps/portal/Dockerfile.dev" "release-planner-portal:dev" "Portal (desarrollo)" || echo -e "${YELLOW}⚠${NC} No se pudo construir imagen de desarrollo de Portal"
else
    echo -e "${YELLOW}⚠${NC} Dockerfile.dev de Portal no encontrado"
fi
echo ""

echo "5️⃣  Verificando que NO existan imágenes de mobile..."
echo "------------------------------------------------------"
if docker images | grep -q "mobile"; then
    echo -e "${RED}✗${NC} Se encontraron imágenes relacionadas con mobile:"
    docker images | grep "mobile"
else
    echo -e "${GREEN}✓${NC} No se encontraron imágenes de mobile (correcto)"
fi
echo ""

echo "6️⃣  Resumen de imágenes construidas..."
echo "----------------------------------------"
docker images | grep "release-planner" || echo "No se encontraron imágenes"
echo ""

echo "=============================================="
echo -e "${GREEN}✓${NC} Build test completado"
echo ""
echo "💡 Para limpiar las imágenes de test:"
echo "   docker rmi release-planner-api:test release-planner-portal:test"
echo "   docker rmi release-planner-api:dev release-planner-portal:dev"
echo ""
echo "💡 Para iniciar los servicios con docker-compose:"
echo "   docker-compose up -d"
echo "   docker-compose -f docker-compose.dev.yml up -d  # Para desarrollo"
echo "   docker-compose -f docker-compose.prod.yml up -d # Para producción"
echo ""

