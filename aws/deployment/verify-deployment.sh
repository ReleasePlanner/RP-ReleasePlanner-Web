#!/bin/bash
# Script para verificar el deployment completo

set -e

echo "🔍 Verifying AWS deployment..."

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
EC2_HOST="${EC2_HOST:-}"
EC2_USER="${EC2_USER:-ec2-user}"
EC2_KEY="${EC2_KEY:-~/.ssh/release-planner-key.pem}"
CLOUDFRONT_URL="${CLOUDFRONT_URL:-}"

check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅${NC} $1 installed"
        return 0
    else
        echo -e "${RED}❌${NC} $1 not found"
        return 1
    fi
}

check_aws_resource() {
    local resource_type=$1
    local resource_name=$2
    
    if aws $resource_type describe-$resource_type --$resource_type-names $resource_name &> /dev/null; then
        echo -e "${GREEN}✅${NC} $resource_type $resource_name exists"
        return 0
    else
        echo -e "${RED}❌${NC} $resource_type $resource_name not found"
        return 1
    fi
}

check_http() {
    local url=$1
    local expected_status=${2:-200}
    
    status=$(curl -s -o /dev/null -w "%{http_code}" $url || echo "000")
    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✅${NC} $url returns $expected_status"
        return 0
    else
        echo -e "${RED}❌${NC} $url returns $status (expected $expected_status)"
        return 1
    fi
}

# Verificar herramientas
echo ""
echo "📦 Checking required tools..."
check_command aws
check_command docker
check_command terraform || echo -e "${YELLOW}⚠️${NC}  Terraform not installed (optional)"

# Verificar AWS credentials
echo ""
echo "🔐 Checking AWS credentials..."
if aws sts get-caller-identity &> /dev/null; then
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    echo -e "${GREEN}✅${NC} AWS credentials valid (Account: $ACCOUNT_ID)"
else
    echo -e "${RED}❌${NC} AWS credentials not configured"
    exit 1
fi

# Verificar recursos AWS
echo ""
echo "☁️  Checking AWS resources..."

# EC2
if [ ! -z "$EC2_HOST" ]; then
    echo -e "${GREEN}✅${NC} EC2_HOST configured: $EC2_HOST"
    
    # Verificar conectividad SSH
    if ssh -i $EC2_KEY -o ConnectTimeout=5 -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "echo 'SSH OK'" &> /dev/null; then
        echo -e "${GREEN}✅${NC} EC2 SSH connection successful"
        
        # Verificar Docker
        if ssh -i $EC2_KEY $EC2_USER@$EC2_HOST "docker --version" &> /dev/null; then
            echo -e "${GREEN}✅${NC} Docker installed on EC2"
        else
            echo -e "${RED}❌${NC} Docker not installed on EC2"
        fi
        
        # Verificar contenedores
        containers=$(ssh -i $EC2_KEY $EC2_USER@$EC2_HOST "cd /opt/release-planner && docker-compose -f docker-compose.prod.yml ps -q 2>/dev/null | wc -l" || echo "0")
        if [ "$containers" -gt "0" ]; then
            echo -e "${GREEN}✅${NC} $containers containers running"
        else
            echo -e "${YELLOW}⚠️${NC}  No containers running"
        fi
    else
        echo -e "${RED}❌${NC} Cannot connect to EC2 via SSH"
    fi
else
    echo -e "${YELLOW}⚠️${NC}  EC2_HOST not configured"
fi

# RDS
echo "Checking RDS..."
if aws rds describe-db-instances --query 'DBInstances[?DBInstanceIdentifier==`release-planner-postgres-production`]' --output text &> /dev/null; then
    RDS_STATUS=$(aws rds describe-db-instances --db-instance-identifier release-planner-postgres-production --query 'DBInstances[0].DBInstanceStatus' --output text 2>/dev/null || echo "not-found")
    if [ "$RDS_STATUS" = "available" ]; then
        echo -e "${GREEN}✅${NC} RDS instance available"
    else
        echo -e "${YELLOW}⚠️${NC}  RDS status: $RDS_STATUS"
    fi
else
    echo -e "${RED}❌${NC} RDS instance not found"
fi

# S3
echo "Checking S3..."
S3_BUCKETS=$(aws s3 ls | grep release-planner-frontend || echo "")
if [ ! -z "$S3_BUCKETS" ]; then
    echo -e "${GREEN}✅${NC} S3 bucket exists"
else
    echo -e "${RED}❌${NC} S3 bucket not found"
fi

# CloudFront
if [ ! -z "$CLOUDFRONT_URL" ]; then
    echo ""
    echo "🌐 Checking CloudFront..."
    check_http "$CLOUDFRONT_URL" 200
    
    # Verificar API desde frontend
    if [ ! -z "$EC2_HOST" ]; then
        API_URL="http://$EC2_HOST:3000/api/health"
        check_http "$API_URL" 200 || echo -e "${YELLOW}⚠️${NC}  API not accessible (check Security Groups)"
    fi
fi

# ECR
echo ""
echo "📦 Checking ECR repositories..."
if aws ecr describe-repositories --repository-names release-planner/api &> /dev/null; then
    API_IMAGES=$(aws ecr list-images --repository-name release-planner/api --query 'imageIds | length(@)' --output text)
    echo -e "${GREEN}✅${NC} ECR API repository exists ($API_IMAGES images)"
else
    echo -e "${RED}❌${NC} ECR API repository not found"
fi

if aws ecr describe-repositories --repository-names release-planner/portal &> /dev/null; then
    PORTAL_IMAGES=$(aws ecr list-images --repository-name release-planner/portal --query 'imageIds | length(@)' --output text)
    echo -e "${GREEN}✅${NC} ECR Portal repository exists ($PORTAL_IMAGES images)"
else
    echo -e "${RED}❌${NC} ECR Portal repository not found"
fi

echo ""
echo "✅ Verification completed!"
echo ""
echo "📝 Summary:"
echo "  - Run this script after infrastructure deployment"
echo "  - Set EC2_HOST and CLOUDFRONT_URL environment variables"
echo "  - Ensure EC2_KEY points to your SSH key"

