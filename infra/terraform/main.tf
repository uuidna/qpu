# UUIDNA QPU - AWS Infrastructure as Code

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.20"
    }
  }

  backend "s3" {
    bucket         = "uuidna-qpu-terraform"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "UUIDNA QPU"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# EKS Cluster
resource "aws_eks_cluster" "qpu" {
  name            = "uuidna-qpu-${var.environment}"
  version         = "1.27"
  role_arn        = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids              = var.subnet_ids
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  enabled_cluster_log_types = [
    "api",
    "audit",
    "authenticator",
    "controllerManager",
    "scheduler"
  ]

  encryption_config {
    provider {
      key_arn = aws_kms_key.eks.arn
    }
    resources = ["secrets"]
  }

  tags = {
    Name = "uuidna-qpu-cluster"
  }
}

# Node Group
resource "aws_eks_node_group" "qpu" {
  cluster_name    = aws_eks_cluster.qpu.name
  node_group_name = "qpu-nodes"
  node_role_arn   = aws_iam_role.node_role.arn
  subnet_ids      = var.subnet_ids

  scaling_config {
    desired_size = var.desired_nodes
    max_size     = var.max_nodes
    min_size     = var.min_nodes
  }

  instance_types = [var.node_instance_type]

  block_device_mappings {
    device_name = "/dev/xvda"

    ebs {
      volume_size           = 100
      volume_type           = "gp3"
      delete_on_termination = true
      encrypted             = true
      kms_key_id           = aws_kms_key.ebs.arn
    }
  }

  tags = {
    Name = "uuidna-qpu-node-group"
  }
}

# RDS PostgreSQL
resource "aws_db_instance" "qpu" {
  identifier     = "uuidna-qpu-${var.environment}"
  engine         = "postgres"
  engine_version = "15.3"
  instance_class = var.db_instance_class

  allocated_storage            = 100
  storage_type                 = "gp3"
  storage_encrypted            = true
  kms_key_id                   = aws_kms_key.rds.arn

  db_name  = "qpu_db"
  username = "postgres"
  password = random_password.db_password.result

  multi_az               = true
  publicly_accessible    = false
  skip_final_snapshot    = false
  final_snapshot_identifier = "uuidna-qpu-${var.environment}-final-snapshot"

  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  db_subnet_group_name            = aws_db_subnet_group.qpu.name
  vpc_security_group_ids          = [aws_security_group.rds.id]
  iam_database_authentication_enabled = true

  performance_insights_enabled          = true
  performance_insights_retention_period = 31

  tags = {
    Name = "uuidna-qpu-db"
  }
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "qpu" {
  cluster_id           = "uuidna-qpu-${var.environment}"
  engine               = "redis"
  node_type           = "cache.r7g.large"
  num_cache_nodes      = 3
  parameter_group_name = aws_elasticache_parameter_group.qpu.name
  engine_version       = "7.0"
  port                 = 6379

  subnet_group_name       = aws_elasticache_subnet_group.qpu.name
  security_group_ids      = [aws_security_group.redis.id]

  automatic_failover_enabled = true
  multi_az_enabled          = true
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token               = random_password.redis_auth.result

  snapshot_retention_limit = 5
  snapshot_window         = "03:00-05:00"

  tags = {
    Name = "uuidna-qpu-cache"
  }
}

# Application Load Balancer
resource "aws_lb" "qpu" {
  name               = "uuidna-qpu-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.subnet_ids

  enable_deletion_protection = true
  enable_http2              = true
  enable_cross_zone_load_balancing = true

  tags = {
    Name = "uuidna-qpu-alb"
  }
}

# Target Group
resource "aws_lb_target_group" "qpu" {
  name        = "uuidna-qpu-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 3
    interval            = 30
    path                = "/health"
    matcher             = "200"
  }
}

# Listener
resource "aws_lb_listener" "qpu_https" {
  load_balancer_arn = aws_lb.qpu.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
  certificate_arn   = aws_acm_certificate.qpu.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.qpu.arn
  }
}

# S3 for logs and backups
resource "aws_s3_bucket" "qpu_logs" {
  bucket = "uuidna-qpu-${var.environment}-logs"

  tags = {
    Name = "uuidna-qpu-logs"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "qpu_logs" {
  bucket = aws_s3_bucket.qpu_logs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3.arn
    }
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "qpu" {
  name              = "/aws/eks/uuidna-qpu"
  retention_in_days = 30

  kms_key_id = aws_kms_key.logs.arn

  tags = {
    Name = "uuidna-qpu-logs"
  }
}

# IAM Roles
resource "aws_iam_role" "eks_cluster_role" {
  name = "uuidna-qpu-eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster_role.name
}

resource "aws_iam_role" "node_role" {
  name = "uuidna-qpu-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "node_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.node_role.name
}

# KMS Keys for encryption
resource "aws_kms_key" "eks" {
  description             = "KMS key for EKS encryption"
  deletion_window_in_days = 10
  enable_key_rotation     = true
}

resource "aws_kms_key" "rds" {
  description             = "KMS key for RDS encryption"
  deletion_window_in_days = 10
  enable_key_rotation     = true
}

resource "aws_kms_key" "ebs" {
  description             = "KMS key for EBS encryption"
  deletion_window_in_days = 10
  enable_key_rotation     = true
}

resource "aws_kms_key" "s3" {
  description             = "KMS key for S3 encryption"
  deletion_window_in_days = 10
  enable_key_rotation     = true
}

resource "aws_kms_key" "logs" {
  description             = "KMS key for CloudWatch logs"
  deletion_window_in_days = 10
  enable_key_rotation     = true
}

# Random passwords
resource "random_password" "db_password" {
  length  = 32
  special = true
}

resource "random_password" "redis_auth" {
  length  = 32
  special = true
}

# Outputs
output "eks_cluster_endpoint" {
  value       = aws_eks_cluster.qpu.endpoint
  description = "EKS cluster endpoint"
}

output "eks_cluster_name" {
  value       = aws_eks_cluster.qpu.name
  description = "EKS cluster name"
}

output "rds_endpoint" {
  value       = aws_db_instance.qpu.endpoint
  description = "RDS endpoint"
}

output "redis_endpoint" {
  value       = aws_elasticache_cluster.qpu.cache_nodes[0].address
  description = "Redis endpoint"
}

output "alb_dns_name" {
  value       = aws_lb.qpu.dns_name
  description = "Application Load Balancer DNS name"
}
