#!/bin/bash
# Script para deploy de API a EC2
# Ejecutar desde GitHub Actions o localmente

set -e

# Variables (configurar según tu setup)
EC2_HOST="${EC2_HOST:-}"
EC2_USER="${EC2_USER:-ec2-user}"
EC2_KEY="${EC2_KEY:-~/.ssh/release-planner-key.pem}"
ECR_REGION="${AWS_REGION:-us-east-1}"
ECR_API_REPO="${ECR_API_REPO:-}"
ECR_PORTAL_REPO="${ECR_PORTAL_REPO:-}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

# Validar variables requeridas
if [ -z "$EC2_HOST" ]; then
    echo "❌ Error: EC2_HOST no está configurado"
    exit 1
fi

if [ -z "$ECR_API_REPO" ]; then
    echo "❌ Error: ECR_API_REPO no está configurado"
    exit 1
fi

echo "🚀 Deploying API to EC2..."

# Login a ECR
echo "🔐 Logging in to ECR..."
aws ecr get-login-password --region $ECR_REGION | \
    docker login --username AWS --password-stdin $ECR_API_REPO

# Pull imagen en EC2
echo "📥 Pulling image on EC2..."
ssh -i $EC2_KEY $EC2_USER@$EC2_HOST <<EOF
    set -e
    cd /opt/release-planner
    
    # Login a ECR
    aws ecr get-login-password --region $ECR_REGION | \
        docker login --username AWS --password-stdin $ECR_API_REPO
    
    # Actualizar docker-compose con nueva imagen
    export ECR_API_IMAGE=$ECR_API_REPO:$IMAGE_TAG
    
    # Deploy
    docker-compose -f docker-compose.prod.yml pull api
    docker-compose -f docker-compose.prod.yml up -d api
    
    # Health check
    echo "⏳ Waiting for API to be healthy..."
    sleep 10
    docker-compose -f docker-compose.prod.yml ps
    
    echo "✅ API deployed successfully!"
EOF

echo "✅ Deployment completed!"

