variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  description = "ID of the VPC to create security groups in"
  type        = string
}

variable "vpc_cidr" {
  description = "VPC CIDR block — used to allow all internal node-to-node traffic"
  type        = string
}

variable "your_ip_cidr" {
  description = "Your public IP in CIDR notation for SSH access"
  type        = string
}
