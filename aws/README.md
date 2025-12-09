# AWS Deployment - Producción Pequeña (Free Tier)

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Arquitectura](#arquitectura)
3. [Configuración Inicial](#configuración-inicial)
4. [Despliegue de Infraestructura](#despliegue-de-infraestructura)
5. [Configuración de Servicios](#configuración-de-servicios)
6. [Despliegue de Aplicación](#despliegue-de-aplicación)
7. [CI/CD Automático](#cicd-automático)
8. [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)
9. [Troubleshooting](#troubleshooting)

---

## Requisitos Previos

### 1. Cuenta AWS
- Cuenta AWS activa con Free Tier disponible
- Acceso a AWS Console
- Límite de crédito configurado (recomendado)

### 2. Herramientas Locales
```bash
# AWS CLI
aws --version  # Debe ser v2.x

# Terraform (opcional, para infraestructura)
terraform --version  # >= 1.0

# Docker (para builds locales)
docker --version

# SSH Key
ssh-keygen -t rsa -b 4096 -f ~/.ssh/release-planner-key
```

### 3. Configurar AWS CLI
```bash
aws configure
# AWS Access Key ID: [tu-access-key]
# AWS Secret Access Key: [tu-secret-key]
# Default region: us-east-1
# Default output format: json
```

### 4. Crear Key Pair en AWS
```bash
# Opción 1: Desde AWS CLI
aws ec2 create-key-pair \
  --key-name release-planner-key \
  --query 'KeyMaterial' \
  --output text > ~/.ssh/release-planner-key.pem
chmod 400 ~/.ssh/release-planner-key.pem

# Opción 2: Desde AWS Console
# EC2 → Key Pairs → Create key pair
# Nombre: release-planner-key
# Tipo: RSA
# Formato: .pem
```

---

## Arquitectura

```
┌─────────────────────────────────────────┐
│  CloudFront + S3                        │
│  - Frontend React (Portal)              │
│  - CDN Global                           │
│  - HTTPS Automático                     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  EC2 t2.micro                           │
│  - API NestJS (Puerto 3000)            │
│  - Redis (Puerto 6379)                 │
│  - Docker Compose                       │
│  - Auto-restart                         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  RDS db.t2.micro                        │
│  - PostgreSQL 15                        │
│  - 20GB Storage                          │
│  - Automated Backups                    │
└─────────────────────────────────────────┘
```

### Componentes

| Componente | Servicio AWS | Free Tier | Costo |
|------------|--------------|-----------|-------|
| Frontend | S3 + CloudFront | ✅ Sí | $0 |
| Backend | EC2 t2.micro | ✅ Sí | $0 |
| Database | RDS db.t2.micro | ✅ Sí | $0 |
| Cache | Redis en EC2 | ✅ Sí | $0 |
| Registry | ECR | ✅ Sí (500MB) | $0 |

---

## Configuración Inicial

### 1. Clonar y Preparar

```bash
# Navegar al directorio del proyecto
cd aws/infrastructure/terraform

# Copiar archivo de variables
cp terraform.tfvars.example terraform.tfvars

# Editar terraform.tfvars con tus valores
nano terraform.tfvars
```

### 2. Configurar Variables

Editar `terraform.tfvars`:

```hcl
aws_region   = "us-east-1"
environment  = "production"
project_name = "release-planner"
ec2_key_name = "release-planner-key"

# Base de datos
db_name     = "releaseplanner"
db_username = "releaseplanner"
db_password = "TU_PASSWORD_SEGURO_AQUI" # Mínimo 8 caracteres
```

### 3. Obtener AWS Account ID

```bash
aws sts get-caller-identity --query Account --output text
# Guardar este valor para GitHub Secrets
```

---

## Despliegue de Infraestructura

### Opción A: Con Terraform (Recomendado)

```bash
cd aws/infrastructure/terraform

# Inicializar Terraform
terraform init

# Validar configuración
terraform validate

# Plan de despliegue
terraform plan

# Aplicar (crear recursos)
terraform apply
# Confirmar con: yes

# Guardar outputs importantes
terraform output -json > outputs.json
```

### Opción B: Scripts Manuales

Si prefieres no usar Terraform, puedes crear los recursos manualmente desde AWS Console o usando AWS CLI. Ver `aws/infrastructure/scripts/` para scripts de ejemplo.

---

## Configuración de Servicios

### 1. Configurar EC2

```bash
# Obtener IP pública de EC2 desde Terraform outputs
EC2_IP=$(terraform output -raw ec2_public_ip)

# Conectar a EC2
ssh -i ~/.ssh/release-planner-key.pem ec2-user@$EC2_IP

# Una vez conectado, ejecutar setup
bash <(curl -s https://raw.githubusercontent.com/tu-repo/aws/deployment/ec2-setup.sh)
# O copiar el script manualmente
```

### 2. Configurar Variables de Entorno en EC2

```bash
# En EC2, editar .env
nano /opt/release-planner/.env
```

Configurar con valores reales:

```env
# Database (obtener de Terraform outputs)
DATABASE_HOST=release-planner-postgres-production.xxxxx.us-east-1.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_USER=releaseplanner
DATABASE_PASSWORD=TU_PASSWORD_DE_TERRAFORM
DATABASE_NAME=releaseplanner

# Redis (local en EC2)
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0

# JWT (generar secrets seguros)
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# Frontend (obtener de Terraform outputs)
FRONTEND_URL=https://d1234567890.cloudfront.net

# Application
NODE_ENV=production
PORT=3000
RUN_MIGRATIONS=true  # Solo en primer deploy
```

### 3. Copiar Docker Compose a EC2

```bash
# Desde tu máquina local
scp -i ~/.ssh/release-planner-key.pem \
  aws/deployment/docker-compose.prod.yml \
  ec2-user@$EC2_IP:/opt/release-planner/
```

---

## Despliegue de Aplicación

### 1. Build y Push de Imágenes Docker

```bash
# Login a ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com

# Obtener URLs de repositorios
ECR_API=$(aws ecr describe-repositories --repository-names release-planner/api --query 'repositories[0].repositoryUri' --output text)
ECR_PORTAL=$(aws ecr describe-repositories --repository-names release-planner/portal --query 'repositories[0].repositoryUri' --output text)

# Build y push API
docker build -f apps/api/Dockerfile -t $ECR_API:latest .
docker push $ECR_API:latest

# Build y push Portal
docker build -f apps/portal/Dockerfile -t $ECR_PORTAL:latest \
  --build-arg VITE_API_URL=https://tu-cloudfront-url.cloudfront.net .
docker push $ECR_PORTAL:latest
```

### 2. Deploy en EC2

```bash
# Conectar a EC2
ssh -i ~/.ssh/release-planner-key.pem ec2-user@$EC2_IP

# En EC2
cd /opt/release-planner

# Configurar imagen ECR en docker-compose
export ECR_API_IMAGE=$ECR_API:latest
export ECR_PORTAL_IMAGE=$ECR_PORTAL:latest

# Login a ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin $ECR_API

# Deploy
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Verificar
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

### 3. Deploy Frontend a S3

```bash
# Build frontend localmente
npm run build:portal

# Obtener bucket name de Terraform
S3_BUCKET=$(terraform output -raw s3_bucket_name)
CLOUDFRONT_ID=$(terraform output -raw cloudfront_distribution_id)

# Deploy
bash aws/deployment/deploy-frontend.sh
```

---

## CI/CD Automático

### 1. Configurar GitHub Secrets

En GitHub: Settings → Secrets and variables → Actions

Agregar:

```
AWS_ACCESS_KEY_ID=tu-access-key
AWS_SECRET_ACCESS_KEY=tu-secret-key
AWS_ACCOUNT_ID=123456789012
AWS_REGION=us-east-1

EC2_HOST=1.2.3.4
EC2_SSH_KEY=contenido-completo-del-archivo-pem

S3_BUCKET_NAME=release-planner-frontend-production-xxxx
CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC

VITE_API_URL=https://d1234567890.cloudfront.net
```

### 2. Obtener EC2 SSH Key para GitHub

```bash
# Convertir PEM a formato para GitHub Secret
cat ~/.ssh/release-planner-key.pem
# Copiar TODO el contenido incluyendo -----BEGIN y -----END
```

### 3. Workflow Automático

El workflow `.github/workflows/aws-deploy.yml` se ejecutará automáticamente en cada push a `main`.

---

## Monitoreo y Mantenimiento

### 1. CloudWatch Logs

```bash
# Ver logs de EC2
aws logs tail /aws/ec2/release-planner --follow

# Ver logs de RDS
aws logs tail /aws/rds/instance/release-planner-postgres-production/postgresql --follow
```

### 2. Health Checks

```bash
# API Health
curl https://$EC2_IP:3000/api/health

# Frontend
curl https://$(terraform output -raw cloudfront_domain_name)
```

### 3. Backups

Los backups de RDS son automáticos (7 días en Free Tier).

Para Redis (en EC2):
```bash
ssh ec2-user@$EC2_IP
/opt/release-planner/backup.sh
```

### 4. Actualizaciones

```bash
# Actualizar API
bash aws/deployment/deploy-api.sh

# Actualizar Frontend
bash aws/deployment/deploy-frontend.sh
```

---

## Troubleshooting

### Problema: EC2 no puede conectarse a RDS

**Solución:**
```bash
# Verificar Security Groups
aws ec2 describe-security-groups --group-ids sg-xxxxx

# Verificar que RDS Security Group permite tráfico desde EC2 Security Group
```

### Problema: CloudFront muestra error 403

**Solución:**
```bash
# Verificar S3 bucket policy
aws s3api get-bucket-policy --bucket $S3_BUCKET

# Verificar Origin Access Control
aws cloudfront get-distribution --id $CLOUDFRONT_ID
```

### Problema: Docker out of memory

**Solución:**
```bash
# En EC2, limpiar Docker
docker system prune -a --volumes

# Verificar espacio
df -h
```

### Problema: API no responde

**Solución:**
```bash
# Ver logs
ssh ec2-user@$EC2_IP
cd /opt/release-planner
docker-compose -f docker-compose.prod.yml logs api

# Reiniciar
docker-compose -f docker-compose.prod.yml restart api
```

---

## Costos y Límites Free Tier

### Límites Mensuales

- **EC2**: 750 horas (1 instancia 24/7)
- **RDS**: 750 horas (1 instancia 24/7)
- **S3**: 5GB storage
- **CloudFront**: 50GB transfer out
- **ECR**: 500MB storage

### Monitoreo de Costos

```bash
# Ver costos estimados
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

---

## Próximos Pasos

1. ✅ Configurar dominio personalizado (Route 53 o Cloudflare)
2. ✅ Habilitar WAF en CloudFront
3. ✅ Configurar alertas de CloudWatch
4. ✅ Implementar backup automático de Redis
5. ✅ Configurar SSL personalizado (ACM)

---

## Soporte

Para problemas o preguntas:
1. Revisar logs en CloudWatch
2. Verificar Security Groups
3. Consultar documentación AWS
4. Revisar este README

---

**Última actualización**: Diciembre 2025

