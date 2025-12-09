variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1" # Cambiar según tu preferencia
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "release-planner"
}

variable "ec2_key_name" {
  description = "Name of the AWS key pair for EC2"
  type        = string
  # Debe existir en AWS o crear con: aws ec2 create-key-pair --key-name release-planner-key
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "releaseplanner"
  sensitive   = true
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "releaseplanner"
  sensitive   = true
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
  # Usar: terraform apply -var="db_password=TU_PASSWORD_SEGURO"
}

