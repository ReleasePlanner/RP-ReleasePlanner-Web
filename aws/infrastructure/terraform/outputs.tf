# Outputs ya están definidos en main.tf
# Este archivo se mantiene para referencia futura

output "summary" {
  value = <<-EOT
    ✅ Infrastructure deployed successfully!
    
    📋 Resources created:
    - EC2 Instance: ${aws_instance.backend.id}
    - EC2 Public IP: ${aws_eip.backend.public_ip}
    - RDS Endpoint: ${aws_db_instance.postgres.endpoint}
    - S3 Bucket: ${aws_s3_bucket.frontend.id}
    - CloudFront: ${aws_cloudfront_distribution.frontend.domain_name}
    - ECR API: ${aws_ecr_repository.api.repository_url}
    - ECR Portal: ${aws_ecr_repository.portal.repository_url}
    
    📝 Next steps:
    1. SSH to EC2: ssh -i ~/.ssh/release-planner-key.pem ec2-user@${aws_eip.backend.public_ip}
    2. Run setup: bash aws/deployment/ec2-setup.sh
    3. Configure .env file in /opt/release-planner/.env
    4. Deploy application
    
    💰 Cost: $0/month (Free Tier)
  EOT
  description = "Deployment summary"
}

