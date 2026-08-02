resource "aws_instance" "jenkins" {
  ami                         = var.ubuntu_ami
  instance_type               = "m7i-flex.large"
  subnet_id                   = var.subnet_id
  key_name                    = aws_key_pair.digitaltwin.key_name
  vpc_security_group_ids      = [var.jenkins_sg_id]
  associate_public_ip_address = true

  root_block_device {
    volume_type           = "gp3"
    volume_size           = 20
    delete_on_termination = true
    encrypted             = true

    tags = {
      Name = "${var.project_name}-${var.environment}-jenkins-ebs"
    }
  }

  user_data = file("${path.module}/scripts/install_jenkins.sh")

  tags = {
    Name = "${var.project_name}-${var.environment}-jenkins"
    Role = "ci-cd-server"
  }
}

resource "aws_eip" "jenkins_eip" {
  instance = aws_instance.jenkins.id
  domain   = "vpc"

  tags = {
    Name = "${var.project_name}-${var.environment}-jenkins-eip"
  }
}
