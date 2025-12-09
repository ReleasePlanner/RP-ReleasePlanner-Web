#!/bin/bash
# Script de setup inicial en EC2
# Ejecutar después de crear la instancia EC2

set -e

echo "🚀 Setting up EC2 instance for Release Planner..."

# Variables (ajustar según tu configuración)
PROJECT_DIR="/opt/release-planner"
ENV_FILE="$PROJECT_DIR/.env"

# Verificar que estamos en EC2
if [ ! -f /sys/hypervisor/uuid ] || [ "$(head -c 3 /sys/hypervisor/uuid)" != "ec2" ]; then
    echo "⚠️  Warning: This script is designed for EC2 instances"
fi

# Crear directorio del proyecto
sudo mkdir -p $PROJECT_DIR
sudo chown ec2-user:ec2-user $PROJECT_DIR
cd $PROJECT_DIR

# Crear archivo .env de ejemplo
cat > $ENV_FILE <<EOF
# Database
DATABASE_HOST=REPLACE_WITH_RDS_ENDPOINT
DATABASE_PORT=5432
DATABASE_USER=releaseplanner
DATABASE_PASSWORD=REPLACE_WITH_DB_PASSWORD
DATABASE_NAME=releaseplanner

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0

# JWT
JWT_SECRET=REPLACE_WITH_SECURE_SECRET
JWT_REFRESH_SECRET=REPLACE_WITH_SECURE_REFRESH_SECRET
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=https://REPLACE_WITH_CLOUDFRONT_DOMAIN

# Application
NODE_ENV=production
PORT=3000
RUN_MIGRATIONS=false
EOF

echo "✅ Created .env file at $ENV_FILE"
echo "⚠️  IMPORTANT: Edit $ENV_FILE and replace all REPLACE_WITH_* values"

# Crear script de deploy
cat > $PROJECT_DIR/deploy.sh <<'DEPLOY_SCRIPT'
#!/bin/bash
# Script de deployment

set -e

PROJECT_DIR="/opt/release-planner"
cd $PROJECT_DIR

echo "🔄 Pulling latest images..."
docker-compose -f docker-compose.prod.yml pull

echo "🔄 Stopping containers..."
docker-compose -f docker-compose.prod.yml down

echo "🔄 Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

echo "✅ Deployment completed!"
echo "📊 Container status:"
docker-compose -f docker-compose.prod.yml ps

echo "📝 Logs (last 50 lines):"
docker-compose -f docker-compose.prod.yml logs --tail=50
DEPLOY_SCRIPT

chmod +x $PROJECT_DIR/deploy.sh

# Crear script de logs
cat > $PROJECT_DIR/logs.sh <<'LOGS_SCRIPT'
#!/bin/bash
# Ver logs de los contenedores

cd /opt/release-planner
docker-compose -f docker-compose.prod.yml logs -f "$@"
LOGS_SCRIPT

chmod +x $PROJECT_DIR/logs.sh

# Crear script de backup
cat > $PROJECT_DIR/backup.sh <<'BACKUP_SCRIPT'
#!/bin/bash
# Backup de Redis data

set -e

BACKUP_DIR="/opt/release-planner/backups"
mkdir -p $BACKUP_DIR

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/redis_backup_$TIMESTAMP.tar.gz"

echo "📦 Creating Redis backup..."
docker run --rm \
  -v release-planner_redis_data:/data \
  -v $BACKUP_DIR:/backup \
  alpine tar czf /backup/redis_backup_$TIMESTAMP.tar.gz -C /data .

echo "✅ Backup created: $BACKUP_FILE"

# Mantener solo últimos 7 backups
ls -t $BACKUP_DIR/redis_backup_*.tar.gz | tail -n +8 | xargs -r rm

echo "🧹 Old backups cleaned"
BACKUP_SCRIPT

chmod +x $PROJECT_DIR/backup.sh

# Configurar cron para backups diarios
(crontab -l 2>/dev/null; echo "0 2 * * * $PROJECT_DIR/backup.sh >> $PROJECT_DIR/backup.log 2>&1") | crontab -

echo ""
echo "✅ EC2 setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Edit $ENV_FILE with your configuration"
echo "2. Copy docker-compose.prod.yml to $PROJECT_DIR/"
echo "3. Run: $PROJECT_DIR/deploy.sh"
echo ""
echo "📚 Useful commands:"
echo "  - View logs: $PROJECT_DIR/logs.sh"
echo "  - Deploy: $PROJECT_DIR/deploy.sh"
echo "  - Backup: $PROJECT_DIR/backup.sh"

