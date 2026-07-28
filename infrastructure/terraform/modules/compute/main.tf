resource "aws_key_pair" "digitaltwin" {
  key_name   = var.key_pair_name
  public_key = tls_private_key.digitaltwin.public_key_openssh

  tags = {
    Name = "${var.project_name}-${var.environment}-keypair"
  }
}

resource "tls_private_key" "digitaltwin" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "local_file" "private_key" {
  content         = tls_private_key.digitaltwin.private_key_pem
  filename        = "${path.module}/scripts/${var.key_pair_name}.pem"
  file_permission = "0400"
}

resource "aws_instance" "master" {
  ami                         = var.ubuntu_ami
  instance_type               = var.master_instance_type
  subnet_id                   = var.subnet_id
  key_name                    = aws_key_pair.digitaltwin.key_name
  vpc_security_group_ids      = [var.master_sg_id]
  associate_public_ip_address = true

  root_block_device {
    volume_type           = "gp3"
    volume_size           = var.master_volume_size
    delete_on_termination = true
    encrypted             = true

    tags = {
      Name = "${var.project_name}-${var.environment}-master-ebs"
    }
  }

  user_data = file("${path.module}/scripts/install_master.sh")

  tags = {
    Name = "${var.project_name}-${var.environment}-master"
    Role = "kubernetes-master"
  }
}

resource "aws_instance" "worker" {
  ami                         = var.ubuntu_ami
  instance_type               = var.worker_instance_type
  subnet_id                   = var.subnet_id
  key_name                    = aws_key_pair.digitaltwin.key_name
  vpc_security_group_ids      = [var.worker_sg_id]
  associate_public_ip_address = true

  root_block_device {
    volume_type           = "gp3"
    volume_size           = var.worker_volume_size
    delete_on_termination = true
    encrypted             = true

    tags = {
      Name = "${var.project_name}-${var.environment}-worker-ebs"
    }
  }

  user_data = file("${path.module}/scripts/install_worker.sh")

  tags = {
    Name = "${var.project_name}-${var.environment}-worker"
    Role = "kubernetes-worker"
  }
}
