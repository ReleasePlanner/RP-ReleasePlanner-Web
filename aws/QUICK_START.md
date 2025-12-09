# 🚀 Quick Start - AWS Free Tier Deployment

Guía rápida para desplegar en AWS Free Tier en 30 minutos.

## ⚡ Pasos Rápidos

### 1. Preparación (5 min)

```bash
# 1. Instalar AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install

# 2. Configurar AWS
aws configure
# Ingresar: Access Key, Secret Key, Region (us-east-1), Format (json)

# 3. Crear SSH Key
ssh-keygen -t rsa -b 4096 -f ~/.ssh/release-planner-key
aws ec2 create-key-pair --key-name release-planner-key \
  --query 'KeyMaterial' --output text > ~/.ssh/release-planner-key.pem
chmod 400 ~/.ssh/release-planner-key.pem
```

### 2. Desplegar Infraestructura (10 min)

```bash
cd aws/infrastructure/terraform

# Configurar variables
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars  # Editar con tus valores

# Desplegar
terraform init
terraform plan
terraform apply  # Confirmar con 'yes'

# Guardar outputs
terraform output -json > ../../outputs.json
```

### 3. Configurar EC2 (5 min)

```bash
# Obtener IP de EC2
EC2_IP=$(terraform output -raw ec2_public_ip)

# Conectar y configurar
ssh -i ~/.ssh/release-planner-key.pem ec2-user@$EC2_IP
# En EC2:
bash <(curl -s https://raw.githubusercontent.com/tu-repo/aws/deployment/ec2-setup.sh)
```

### 4. Configurar Variables (5 min)

```bash
# En EC2, editar .env
nano /opt/release-planner/.env

# Obtener valores de Terraform outputs:
# - DATABASE_HOST: terraform output -raw rds_address
# - FRONTEND_URL: terraform output -raw cloudfront_domain_name
```

### 5. Deploy Aplicación (5 min)

```bash
# Desde tu máquina local

# 1. Build y push imágenes
export AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=us-east-1

aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com

# Build API
docker build -f apps/api/Dockerfile -t $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/release-planner/api:latest .
docker push $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/release-planner/api:latest

# Build Portal
docker build -f apps/portal/Dockerfile \
  --build-arg VITE_API_URL=https://$(terraform output -raw cloudfront_domain_name) \
  -t $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/release-planner/portal:latest .
docker push $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/release-planner/portal:latest

# 2. Deploy en EC2
export EC2_IP=$(terraform output -raw ec2_public_ip)
export ECR_API=$AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/release-planner/api:latest

ssh -i ~/.ssh/release-planner-key.pem ec2-user@$EC2_IP <<EOF
cd /opt/release-planner
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com
export ECR_API_IMAGE=$ECR_API
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
EOF

# 3. Deploy Frontend
npm run build:portal
export S3_BUCKET=$(terraform output -raw s3_bucket_name)
export CLOUDFRONT_ID=$(terraform output -raw cloudfront_distribution_id)
bash aws/deployment/deploy-frontend.sh
```

### 6. Verificar (2 min)

```bash
# Verificar API
curl http://$EC2_IP:3000/api/health

# Verificar Frontend
curl https://$(terraform output -raw cloudfront_domain_name)

# Ver logs
ssh -i ~/.ssh/release-planner-key.pem ec2-user@$EC2_IP
cd /opt/release-planner
docker-compose -f docker-compose.prod.yml logs -f
```

## ✅ Checklist

- [ ] AWS CLI configurado
- [ ] SSH Key creada en AWS
- [ ] Terraform desplegado
- [ ] EC2 configurado
- [ ] Variables de entorno configuradas
- [ ] Imágenes Docker en ECR
- [ ] API desplegada en EC2
- [ ] Frontend desplegado en S3
- [ ] Health checks pasando

## 🎯 URLs Finales

- **Frontend**: `https://d1234567890.cloudfront.net`
- **API**: `http://1.2.3.4:3000/api`
- **Health**: `http://1.2.3.4:3000/api/health`

## 📚 Siguiente Paso

Configurar CI/CD automático con GitHub Actions:
- Ver `.github/workflows/aws-deploy.yml`
- Configurar GitHub Secrets
- Push a `main` para deploy automático

## 🆘 Problemas Comunes

**EC2 no conecta a RDS:**
```bash
# Verificar Security Groups
aws ec2 describe-security-groups --filters "Name=tag:Name,Values=release-planner*"
```

**CloudFront 403:**
```bash
# Verificar S3 bucket policy
aws s3api get-bucket-policy --bucket $(terraform output -raw s3_bucket_name)
```

**Docker out of memory:**
```bash
# En EC2
docker system prune -a
```

---

**Tiempo total estimado**: 30 minutos
**Costo**: $0/mes (Free Tier)

