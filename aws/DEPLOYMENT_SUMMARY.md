# 📋 Resumen de Configuración - AWS Free Tier

## ✅ Archivos Creados

### Infraestructura (Terraform)
- ✅ `aws/infrastructure/terraform/main.tf` - Recursos principales
- ✅ `aws/infrastructure/terraform/variables.tf` - Variables
- ✅ `aws/infrastructure/terraform/outputs.tf` - Outputs
- ✅ `aws/infrastructure/terraform/ec2-user-data.sh` - Setup automático EC2
- ✅ `aws/infrastructure/terraform/terraform.tfvars.example` - Ejemplo de configuración
- ✅ `aws/infrastructure/terraform/.gitignore` - Ignorar archivos sensibles

### Deployment
- ✅ `aws/deployment/docker-compose.prod.yml` - Docker Compose para producción
- ✅ `aws/deployment/ec2-setup.sh` - Script de setup inicial EC2
- ✅ `aws/deployment/deploy-api.sh` - Script de deploy de API
- ✅ `aws/deployment/deploy-frontend.sh` - Script de deploy de Frontend
- ✅ `aws/deployment/verify-deployment.sh` - Script de verificación

### CI/CD
- ✅ `.github/workflows/aws-deploy.yml` - GitHub Actions workflow

### Documentación
- ✅ `aws/README.md` - Documentación completa
- ✅ `aws/QUICK_START.md` - Guía rápida de 30 minutos
- ✅ `aws/infrastructure/README.md` - Documentación de infraestructura

## 🏗️ Arquitectura Desplegada

```
CloudFront + S3 (Frontend)
    ↓
EC2 t2.micro (API + Redis)
    ↓
RDS db.t2.micro (PostgreSQL)
```

## 💰 Costos

| Componente | Servicio | Free Tier | Costo Mensual |
|------------|----------|-----------|---------------|
| Frontend | S3 + CloudFront | ✅ | $0 |
| Backend | EC2 t2.micro | ✅ | $0 |
| Database | RDS db.t2.micro | ✅ | $0 |
| Cache | Redis (en EC2) | ✅ | $0 |
| Registry | ECR | ✅ (500MB) | $0 |
| **TOTAL** | | | **$0/mes** |

## 📦 Recursos AWS Creados

1. **EC2 t2.micro**
   - Amazon Linux 2
   - Docker + Docker Compose
   - AWS CLI
   - Security Group (SSH, HTTP 3000, Redis 6379)

2. **RDS db.t2.micro**
   - PostgreSQL 15.4
   - 20GB storage
   - Automated backups (7 días)
   - Security Group (solo desde EC2)

3. **S3 Bucket**
   - Hosting estático
   - Versioning habilitado
   - Acceso solo desde CloudFront

4. **CloudFront Distribution**
   - CDN global
   - HTTPS automático
   - Cache optimizado
   - Error pages configurados

5. **ECR Repositories**
   - `release-planner/api`
   - `release-planner/portal`
   - Lifecycle policies (mantener 5 imágenes)

6. **Security Groups**
   - EC2: SSH, API HTTP, Redis (VPC)
   - RDS: PostgreSQL (solo desde EC2)

## 🚀 Próximos Pasos

### 1. Configurar Variables
```bash
cd aws/infrastructure/terraform
cp terraform.tfvars.example terraform.tfvars
# Editar terraform.tfvars con tus valores
```

### 2. Desplegar Infraestructura
```bash
terraform init
terraform plan
terraform apply
```

### 3. Configurar EC2
```bash
EC2_IP=$(terraform output -raw ec2_public_ip)
ssh -i ~/.ssh/release-planner-key.pem ec2-user@$EC2_IP
# Ejecutar: bash aws/deployment/ec2-setup.sh
```

### 4. Configurar GitHub Secrets
Ver `.github/workflows/aws-deploy.yml` para lista completa de secrets.

### 5. Primer Deploy
Seguir `aws/QUICK_START.md` para deploy manual o push a `main` para automático.

## 🔐 Secrets Requeridos (GitHub)

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_ACCOUNT_ID
AWS_REGION=us-east-1
EC2_HOST
EC2_SSH_KEY (contenido completo del .pem)
S3_BUCKET_NAME
CLOUDFRONT_DISTRIBUTION_ID
VITE_API_URL
```

## 📊 Monitoreo

- **CloudWatch Logs**: Automático
- **Health Checks**: `/api/health`
- **Backups RDS**: Automáticos (7 días)
- **Backups Redis**: Script cron diario

## 🛠️ Comandos Útiles

```bash
# Ver estado de infraestructura
terraform show

# Ver outputs
terraform output

# Conectar a EC2
ssh -i ~/.ssh/release-planner-key.pem ec2-user@$(terraform output -raw ec2_public_ip)

# Ver logs en EC2
cd /opt/release-planner
docker-compose -f docker-compose.prod.yml logs -f

# Deploy manual API
bash aws/deployment/deploy-api.sh

# Deploy manual Frontend
bash aws/deployment/deploy-frontend.sh

# Verificar deployment
bash aws/deployment/verify-deployment.sh
```

## ⚠️ Limitaciones Free Tier

- **EC2**: 1 instancia t2.micro (1 vCPU, 1GB RAM)
- **RDS**: 1 instancia db.t2.micro (1 vCPU, 1GB RAM, 20GB)
- **S3**: 5GB storage
- **CloudFront**: 50GB transfer/mes
- **ECR**: 500MB storage

**Suficiente para**: Desarrollo, Testing, Producción pequeña (<100 usuarios)

## 📚 Documentación

- **Completa**: `aws/README.md`
- **Rápida**: `aws/QUICK_START.md`
- **Infraestructura**: `aws/infrastructure/README.md`

## ✅ Checklist de Deployment

- [ ] AWS CLI configurado
- [ ] SSH Key creada en AWS
- [ ] Terraform variables configuradas
- [ ] Infraestructura desplegada
- [ ] EC2 configurado y conectado
- [ ] Variables de entorno en EC2
- [ ] Imágenes Docker en ECR
- [ ] API desplegada y funcionando
- [ ] Frontend desplegado en S3
- [ ] CloudFront funcionando
- [ ] Health checks pasando
- [ ] GitHub Secrets configurados
- [ ] CI/CD funcionando

---

**Estado**: ✅ Configuración completa lista para deployment
**Costo**: $0/mes (Free Tier)
**Tiempo estimado**: 30 minutos (Quick Start)

