terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "release-planner"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# VPC (usando default VPC para Free Tier)
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Security Group para EC2 (API + Redis)
resource "aws_security_group" "ec2_backend" {
  name        = "${var.project_name}-ec2-backend-${var.environment}"
  description = "Security group for EC2 backend (API + Redis)"
  vpc_id      = data.aws_vpc.default.id

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Restringir a tu IP en producción
    description = "SSH"
  }

  # API HTTP
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "API HTTP"
  }

  # Redis (solo desde EC2)
  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = [data.aws_vpc.default.cidr_block]
    description = "Redis (solo VPC)"
  }

  # Egress - todo el tráfico saliente
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = {
    Name = "${var.project_name}-ec2-backend-${var.environment}"
  }
}

# Security Group para RDS
resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-${var.environment}"
  description = "Security group for RDS PostgreSQL"
  vpc_id      = data.aws_vpc.default.id

  # PostgreSQL desde EC2
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2_backend.id]
    description     = "PostgreSQL from EC2"
  }

  tags = {
    Name = "${var.project_name}-rds-${var.environment}"
  }
}

# Key Pair para SSH (crear manualmente o usar existente)
# resource "aws_key_pair" "deployer" {
#   key_name   = "${var.project_name}-key-${var.environment}"
#   public_key = file("~/.ssh/id_rsa.pub")
# }

# EC2 Instance (Backend API + Redis)
resource "aws_instance" "backend" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro" # Free Tier
  key_name               = var.ec2_key_name
  vpc_security_group_ids = [aws_security_group.ec2_backend.id]
  subnet_id              = data.aws_subnets.default.ids[0]

  user_data = base64encode(templatefile("${path.module}/ec2-user-data.sh", {
    project_name = var.project_name
    environment  = var.environment
  }))

  root_block_device {
    volume_type = "gp3"
    volume_size = 8 # Free Tier: 30GB EBS gratis
    encrypted   = true
  }

  tags = {
    Name = "${var.project_name}-backend-${var.environment}"
  }
}

# Elastic IP para EC2 (opcional, pero recomendado)
resource "aws_eip" "backend" {
  instance = aws_instance.backend.id
  domain   = "vpc"

  tags = {
    Name = "${var.project_name}-backend-eip-${var.environment}"
  }
}

# RDS Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-${var.environment}"
  subnet_ids = data.aws_subnets.default.ids

  tags = {
    Name = "${var.project_name}-db-subnet-${var.environment}"
  }
}

# RDS Parameter Group (optimizado para Free Tier)
resource "aws_db_parameter_group" "postgres" {
  name   = "${var.project_name}-postgres-${var.environment}"
  family = "postgres15"

  parameter {
    name  = "shared_buffers"
    value = "256MB" # Aproximadamente 25% de 1GB RAM
  }

  parameter {
    name  = "effective_cache_size"
    value = "768MB"
  }

  parameter {
    name  = "maintenance_work_mem"
    value = "64MB"
  }

  parameter {
    name  = "checkpoint_completion_target"
    value = "0.9"
  }

  tags = {
    Name = "${var.project_name}-postgres-params-${var.environment}"
  }
}

# RDS Instance (PostgreSQL)
resource "aws_db_instance" "postgres" {
  identifier = "${var.project_name}-postgres-${var.environment}"

  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.t2.micro" # Free Tier

  allocated_storage     = 20 # Free Tier: 20GB gratis
  max_allocated_storage = 20 # No auto-scaling en Free Tier
  storage_type          = "gp2"
  storage_encrypted     = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password # Usar AWS Secrets Manager en producción

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  parameter_group_name    = aws_db_parameter_group.postgres.name

  backup_retention_period = 7 # Free Tier: 7 días gratis
  backup_window          = "03:00-04:00"
  maintenance_window     = "mon:04:00-mon:05:00"

  skip_final_snapshot       = var.environment != "production"
  final_snapshot_identifier = var.environment == "production" ? "${var.project_name}-final-${formatdate("YYYY-MM-DD-hhmm", timestamp())}" : null

  publicly_accessible = false # Solo accesible desde VPC
  multi_az           = false  # Free Tier: no Multi-AZ

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  tags = {
    Name = "${var.project_name}-postgres-${var.environment}"
  }
}

# S3 Bucket para Frontend
resource "aws_s3_bucket" "frontend" {
  bucket = "${var.project_name}-frontend-${var.environment}-${random_id.bucket_suffix.hex}"

  tags = {
    Name = "${var.project_name}-frontend-${var.environment}"
  }
}

# Random ID para bucket único
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# S3 Bucket Versioning
resource "aws_s3_bucket_versioning" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Bucket Public Access Block (deshabilitado para CloudFront)
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets  = true
}

# S3 Bucket Policy (solo CloudFront puede acceder)
resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.frontend.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.frontend.arn
          }
        }
      }
    ]
  })
}

# CloudFront Origin Access Control
resource "aws_cloudfront_origin_access_control" "frontend" {
  name                              = "${var.project_name}-frontend-oac-${var.environment}"
  description                       = "OAC for S3 frontend bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                 = "always"
  signing_protocol                 = "sigv4"
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project_name} frontend distribution"
  default_root_object = "index.html"
  price_class         = "PriceClass_100" # Solo US, Canada, Europa (más barato)

  origin {
    domain_name              = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.frontend.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend.id
  }

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods  = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.frontend.id}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  # Cache behavior para assets estáticos
  ordered_cache_behavior {
    path_pattern     = "/assets/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.frontend.id}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 31536000 # 1 año
    max_ttl                = 31536000
    compress               = true
  }

  # Error pages
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true # Usar ACM para dominio personalizado
  }

  tags = {
    Name = "${var.project_name}-frontend-${var.environment}"
  }
}

# ECR Repository para API
resource "aws_ecr_repository" "api" {
  name                 = "${var.project_name}/api"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.project_name}-api-ecr"
  }
}

# ECR Repository para Portal
resource "aws_ecr_repository" "portal" {
  name                 = "${var.project_name}/portal"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.project_name}-portal-ecr"
  }
}

# ECR Lifecycle Policy (mantener solo últimas 5 imágenes)
resource "aws_ecr_lifecycle_policy" "api" {
  repository = aws_ecr_repository.api.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 5 images"
        selection = {
          tagStatus     = "any"
          countType     = "imageCountMoreThan"
          countNumber   = 5
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

resource "aws_ecr_lifecycle_policy" "portal" {
  repository = aws_ecr_repository.portal.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 5 images"
        selection = {
          tagStatus     = "any"
          countType     = "imageCountMoreThan"
          countNumber   = 5
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# Outputs
output "ec2_public_ip" {
  value       = aws_eip.backend.public_ip
  description = "Public IP of EC2 instance"
}

output "ec2_instance_id" {
  value       = aws_instance.backend.id
  description = "EC2 instance ID"
}

output "rds_endpoint" {
  value       = aws_db_instance.postgres.endpoint
  description = "RDS endpoint"
}

output "rds_address" {
  value       = aws_db_instance.postgres.address
  description = "RDS address"
}

output "s3_bucket_name" {
  value       = aws_s3_bucket.frontend.id
  description = "S3 bucket name for frontend"
}

output "cloudfront_distribution_id" {
  value       = aws_cloudfront_distribution.frontend.id
  description = "CloudFront distribution ID"
}

output "cloudfront_domain_name" {
  value       = aws_cloudfront_distribution.frontend.domain_name
  description = "CloudFront domain name"
}

output "ecr_api_repository_url" {
  value       = aws_ecr_repository.api.repository_url
  description = "ECR API repository URL"
}

output "ecr_portal_repository_url" {
  value       = aws_ecr_repository.portal.repository_url
  description = "ECR Portal repository URL"
}

