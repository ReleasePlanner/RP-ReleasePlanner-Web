#!/bin/bash
# Script de verificación de configuración para producción
# Uso: ./scripts/verify-production-config.sh

set -e

echo "🔍 Verificando configuración de producción..."
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Función para verificar variable de entorno
check_env_var() {
    local var_name=$1
    local required=${2:-true}
    
    if [ -z "${!var_name}" ]; then
        if [ "$required" = true ]; then
            echo -e "${RED}❌ Error: Variable de entorno $var_name no está definida${NC}"
            ERRORS=$((ERRORS + 1))
        else
            echo -e "${YELLOW}⚠️  Advertencia: Variable de entorno $var_name no está definida (opcional)${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
        return 1
    else
        echo -e "${GREEN}✅ $var_name está definida${NC}"
        return 0
    fi
}

# Verificar variables de entorno requeridas
echo "📋 Verificando variables de entorno requeridas..."
echo ""

check_env_var "DATABASE_PASSWORD" true
check_env_var "JWT_SECRET" true
check_env_var "JWT_REFRESH_SECRET" true
check_env_var "FRONTEND_URL" true

# Verificar variables opcionales con valores por defecto
echo ""
echo "📋 Verificando variables de entorno opcionales..."
echo ""

check_env_var "POSTGRES_USER" false
check_env_var "POSTGRES_DB" false
check_env_var "REDIS_PASSWORD" false

# Verificar longitud de JWT_SECRET
echo ""
echo "🔐 Verificando seguridad de secrets..."
echo ""

if [ ! -z "$JWT_SECRET" ]; then
    if [ ${#JWT_SECRET} -lt 32 ]; then
        echo -e "${RED}❌ Error: JWT_SECRET debe tener al menos 32 caracteres (actual: ${#JWT_SECRET})${NC}"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✅ JWT_SECRET tiene longitud suficiente (${#JWT_SECRET} caracteres)${NC}"
    fi
fi

if [ ! -z "$JWT_REFRESH_SECRET" ]; then
    if [ ${#JWT_REFRESH_SECRET} -lt 32 ]; then
        echo -e "${RED}❌ Error: JWT_REFRESH_SECRET debe tener al menos 32 caracteres (actual: ${#JWT_REFRESH_SECRET})${NC}"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✅ JWT_REFRESH_SECRET tiene longitud suficiente (${#JWT_REFRESH_SECRET} caracteres)${NC}"
    fi
fi

# Verificar que FRONTEND_URL use HTTPS en producción
echo ""
echo "🌐 Verificando configuración de URLs..."
echo ""

if [ "$NODE_ENV" = "production" ]; then
    if [[ ! "$FRONTEND_URL" =~ ^https:// ]]; then
        echo -e "${YELLOW}⚠️  Advertencia: FRONTEND_URL debería usar HTTPS en producción${NC}"
        echo -e "${YELLOW}   Valor actual: $FRONTEND_URL${NC}"
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "${GREEN}✅ FRONTEND_URL usa HTTPS${NC}"
    fi
fi

# Verificar que DATABASE_PASSWORD no sea el valor por defecto
if [ "$DATABASE_PASSWORD" = "releaseplanner123" ] || [ "$DATABASE_PASSWORD" = "demo" ]; then
    echo -e "${RED}❌ Error: DATABASE_PASSWORD no debe usar el valor por defecto${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Verificar que JWT secrets no sean valores por defecto
if [ "$JWT_SECRET" = "CHANGE_ME_IN_PRODUCTION" ] || [ "$JWT_REFRESH_SECRET" = "CHANGE_ME_IN_PRODUCTION" ]; then
    echo -e "${RED}❌ Error: JWT secrets no deben usar valores por defecto${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Resumen
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Resumen de Verificación"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Todas las verificaciones pasaron correctamente${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Verificación completada con $WARNINGS advertencia(s)${NC}"
    echo -e "${GREEN}✅ No se encontraron errores críticos${NC}"
    exit 0
else
    echo -e "${RED}❌ Verificación falló con $ERRORS error(es) y $WARNINGS advertencia(s)${NC}"
    echo ""
    echo "Por favor, corrige los errores antes de desplegar a producción."
    exit 1
fi




