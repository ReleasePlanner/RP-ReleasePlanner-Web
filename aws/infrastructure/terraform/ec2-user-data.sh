#!/bin/bash
# User data script para EC2 - Instala Docker y configura servicios

set -e

# Actualizar sistema
yum update -y

# Instalar Docker
yum install -y docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# Instalar AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install
rm -rf aws awscliv2.zip

# Crear directorio para aplicación
mkdir -p /opt/release-planner
chown ec2-user:ec2-user /opt/release-planner

# Instalar CloudWatch Agent (opcional)
yum install -y amazon-cloudwatch-agent

# Configurar límites del sistema para Docker
cat >> /etc/sysctl.conf <<EOF
vm.max_map_count=262144
fs.file-max=65536
EOF

sysctl -p

# Log de finalización
echo "User data script completed at $(date)" >> /var/log/user-data.log

