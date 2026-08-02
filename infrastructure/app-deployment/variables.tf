variable "aws_region" {
  description = "AWS region for deploying the application server"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Deployment environment (e.g., dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Project name prefix for tags and resources"
  type        = string
  default     = "twindigital"
}

variable "vpc_cidr" {
  description = "CIDR block for the application VPC"
  type        = string
  default     = "10.10.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the application public subnet"
  type        = string
  default     = "10.10.1.0/24"
}

variable "ubuntu_ami" {
  description = "Ubuntu 22.04 LTS AMI ID for the target region"
  type        = string
  default     = "ami-03f4878755434977f" # Ubuntu 22.04 LTS in ap-south-1
}

variable "instance_type" {
  description = "EC2 instance type for running Frontend and Backend containers"
  type        = string
  default     = "t3.medium" # 2 vCPU / 4 GiB RAM — optimal for Node build & Docker
}

variable "volume_size" {
  description = "Root EBS volume size in GB"
  type        = number
  default     = 20
}

variable "ssh_allowed_cidr" {
  description = "CIDR block allowed for SSH access to the application server"
  type        = string
  default     = "0.0.0.0/0"
}
