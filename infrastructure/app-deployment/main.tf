terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.4"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ─── VPC & Networking for Application ────────────────────────────────────────
resource "aws_vpc" "app_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.project_name}-${var.environment}-app-vpc"
    Environment = var.environment
  }
}

resource "aws_internet_gateway" "app_igw" {
  vpc_id = aws_vpc.app_vpc.id

  tags = {
    Name = "${var.project_name}-${var.environment}-app-igw"
  }
}

resource "aws_subnet" "app_public_subnet" {
  vpc_id                  = aws_vpc.app_vpc.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-${var.environment}-app-public-subnet"
  }
}

resource "aws_route_table" "app_rt" {
  vpc_id = aws_vpc.app_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.app_igw.id
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-app-rt"
  }
}

resource "aws_route_table_association" "app_rta" {
  subnet_id      = aws_subnet.app_public_subnet.id
  route_table_id = aws_route_table.app_rt.id
}

# ─── Security Group for Application (HTTP/HTTPS/API/SSH) ─────────────────────
resource "aws_security_group" "app_sg" {
  name        = "${var.project_name}-${var.environment}-app-sg"
  description = "Security group for TwinDigital Frontend and Full Stack Application"
  vpc_id      = aws_vpc.app_vpc.id

  ingress {
    description = "HTTP Web Traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS Secure Traffic"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "API Gateway (Optional direct port)"
    from_port   = 8090
    to_port     = 8090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH Access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_allowed_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-app-sg"
  }
}

# ─── SSH Key Pair Generation ─────────────────────────────────────────────────
resource "tls_private_key" "app_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "app_keypair" {
  key_name   = "${var.project_name}-${var.environment}-app-key"
  public_key = tls_private_key.app_key.public_key_openssh

  tags = {
    Name = "${var.project_name}-${var.environment}-app-keypair"
  }
}

resource "local_file" "private_key_pem" {
  content         = tls_private_key.app_key.private_key_pem
  filename        = "${path.module}/scripts/digitaltwin-app-key.pem"
  file_permission = "0400"
}

# ─── EC2 Instance for Application Server ──────────────────────────────────────
resource "aws_instance" "app_server" {
  ami                    = var.ubuntu_ami
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.app_public_subnet.id
  key_name               = aws_key_pair.app_keypair.key_name
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  root_block_device {
    volume_type           = "gp3"
    volume_size           = var.volume_size
    delete_on_termination = true
    encrypted             = true

    tags = {
      Name = "${var.project_name}-${var.environment}-app-ebs"
    }
  }

  user_data = file("${path.module}/scripts/setup_app_server.sh")

  tags = {
    Name        = "${var.project_name}-${var.environment}-app-server"
    Role        = "application-server"
    Environment = var.environment
  }
}
