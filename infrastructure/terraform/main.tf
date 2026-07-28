module "networking" {
  source = "./modules/networking"

  project_name        = var.project_name
  environment         = var.environment
  vpc_cidr            = var.vpc_cidr
  public_subnet_cidrs = var.public_subnet_cidrs
  availability_zones  = var.availability_zones
}

module "security" {
  source = "./modules/security"

  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.networking.vpc_id
  vpc_cidr     = var.vpc_cidr
  your_ip_cidr = var.your_ip_cidr
}

module "compute" {
  source = "./modules/compute"

  project_name         = var.project_name
  environment          = var.environment
  master_instance_type = var.master_instance_type
  worker_instance_type = var.worker_instance_type
  master_volume_size   = var.master_volume_size
  worker_volume_size   = var.worker_volume_size
  ubuntu_ami           = var.ubuntu_ami
  key_pair_name        = var.key_pair_name
  subnet_id            = module.networking.public_subnet_ids[0]
  master_sg_id         = module.security.master_sg_id
  worker_sg_id         = module.security.worker_sg_id
}

module "ecr" {
  source = "./modules/ecr"

  project_name              = var.project_name
  ecr_services              = var.ecr_services
  ecr_image_retention_count = var.ecr_image_retention_count
}
