# AWS Free Tier - Configuración Producción Pequeña

## Arquitectura

```
┌─────────────────────────────────────┐
│  CloudFront + S3 (Frontend React)  │
│  - CDN Global                      │
│  - HTTPS Automático                │
│  - Cache Optimizado                │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  EC2 t2.micro (Backend)            │
│  - API NestJS (Puerto 3000)         │
│  - Redis (Puerto 6379)              │
│  - Docker Compose                   │
│  - Auto-restart                     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  RDS db.t2.micro (PostgreSQL)      │
│  - 20GB Storage                     │
│  - Automated Backups               │
│  - Security Group                   │
└─────────────────────────────────────┘
```

## Componentes

- **S3**: Hosting estático del frontend
- **CloudFront**: CDN y distribución global
- **EC2 t2.micro**: Backend API + Redis (misma instancia)
- **RDS db.t2.micro**: Base de datos PostgreSQL
- **ECR**: Container Registry para imágenes Docker
- **Route 53** (opcional): DNS (puedes usar Cloudflare gratis)

## Costos

- **Total**: $0/mes (dentro de Free Tier)
- **Límites**: 
  - 750 horas/mes EC2
  - 750 horas/mes RDS
  - 5GB S3 storage
  - 50GB CloudFront transfer

## Requisitos Previos

1. Cuenta AWS con Free Tier activo
2. AWS CLI instalado y configurado
3. Terraform instalado (opcional, también incluimos scripts bash)
4. Acceso SSH a EC2
5. GitHub Actions configurado

## Estructura de Archivos

```
aws/
├── infrastructure/
│   ├── terraform/          # Infraestructura como código
│   ├── scripts/            # Scripts de deployment
│   └── configs/            # Archivos de configuración
├── deployment/
│   ├── ec2-setup.sh       # Setup inicial de EC2
│   ├── deploy-api.sh      # Deploy de API
│   └── deploy-frontend.sh # Deploy de Frontend
└── ci-cd/
    └── aws-deploy.yml     # GitHub Actions workflow
```

## Pasos de Implementación

1. **Crear Infraestructura** (Terraform o Scripts)
2. **Configurar EC2** (Docker, Docker Compose)
3. **Configurar RDS** (PostgreSQL)
4. **Configurar S3 + CloudFront** (Frontend)
5. **Configurar ECR** (Container Registry)
6. **Configurar CI/CD** (GitHub Actions)
7. **Deploy Inicial**

## Documentación Detallada

Ver archivos individuales en cada directorio.

