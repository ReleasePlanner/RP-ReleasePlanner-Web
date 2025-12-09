#!/bin/bash
# Script para deploy de Frontend a S3 + CloudFront
# Ejecutar desde GitHub Actions o localmente

set -e

# Variables (configurar según tu setup)
S3_BUCKET="${S3_BUCKET:-}"
CLOUDFRONT_DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID:-}"
AWS_REGION="${AWS_REGION:-us-east-1}"
FRONTEND_DIR="${FRONTEND_DIR:-apps/portal/dist}"

# Validar variables requeridas
if [ -z "$S3_BUCKET" ]; then
    echo "❌ Error: S3_BUCKET no está configurado"
    exit 1
fi

if [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "❌ Error: CLOUDFRONT_DISTRIBUTION_ID no está configurado"
    exit 1
fi

# Verificar que existe el directorio de build
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ Error: Frontend build directory not found: $FRONTEND_DIR"
    echo "💡 Run: npm run build:portal"
    exit 1
fi

echo "🚀 Deploying Frontend to S3 + CloudFront..."

# Sync a S3 (solo archivos nuevos/modificados)
echo "📤 Uploading files to S3..."
aws s3 sync $FRONTEND_DIR s3://$S3_BUCKET \
    --region $AWS_REGION \
    --delete \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "*.html" \
    --exclude "index.html"

# Upload HTML files con cache corto
echo "📤 Uploading HTML files..."
aws s3 sync $FRONTEND_DIR s3://$S3_BUCKET \
    --region $AWS_REGION \
    --delete \
    --cache-control "public, max-age=0, must-revalidate" \
    --include "*.html"

# Invalidar cache de CloudFront
echo "🔄 Invalidating CloudFront cache..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)

echo "⏳ Waiting for CloudFront invalidation to complete..."
aws cloudfront wait invalidation-completed \
    --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
    --id $INVALIDATION_ID

echo "✅ Frontend deployed successfully!"
echo "🌐 CloudFront URL: https://$(aws cloudfront get-distribution --id $CLOUDFRONT_DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)"

