variable "aws_region" {
  description = "AWS region to deploy infrastructure in"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Deployment environment (dev / staging / prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name prefix for all resource names"
  type        = string
  default     = "digitaltwin"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for the public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "availability_zones" {
  description = "Availability Zones to deploy subnets into"
  type        = list(string)
  default     = ["ap-south-1a", "ap-south-1b"]
}

variable "master_instance_type" {
  description = "EC2 instance type for Kubernetes Master — Free Tier eligible"
  type        = string
  default     = "c7i-flex.large"
}

variable "worker_instance_type" {
  description = "EC2 instance type for Kubernetes Worker — Free Tier eligible"
  type        = string
  default     = "m7i-flex.large"
}

variable "master_volume_size" {
  description = "Root EBS volume size in GB for Master node (keep total <= 30 GB for Free Tier)"
  type        = number
  default     = 15
}

variable "worker_volume_size" {
  description = "Root EBS volume size in GB for Worker node (keep total <= 30 GB for Free Tier)"
  type        = number
  default     = 15
}

variable "ubuntu_ami" {
  description = "Ubuntu 22.04 LTS AMI ID for ap-south-1"
  type        = string
  default     = "ami-03f4878755434977f"
}

variable "key_pair_name" {
  description = "Name of the SSH key pair for EC2 access"
  type        = string
  default     = "digitaltwin-key"
}

variable "your_ip_cidr" {
  description = "Your public IP in CIDR notation for SSH access (e.g. 1.2.3.4/32)"
  type        = string
  default     = "0.0.0.0/0"
}

variable "ecr_services" {
  description = "List of service names to create ECR repositories for"
  type        = list(string)
  default = [
    "frontend",
    "api-gateway",
    "auth-service",
    "cluster-sync-service",
    "topology-service",
    "simulation-service",
    "risk-service",
    "cost-service",
    "ai-service"
  ]
}

variable "ecr_image_retention_count" {
  description = "Max number of tagged images to keep per ECR repo"
  type        = number
  default     = 3
}
