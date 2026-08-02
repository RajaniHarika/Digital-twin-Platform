output "vpc_id" {
  description = "ID of the created VPC"
  value       = module.networking.vpc_id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = module.networking.public_subnet_ids
}

output "master_public_ip" {
  description = "Public IP of the Kubernetes Master node"
  value       = module.compute.master_public_ip
}

output "worker_public_ip" {
  description = "Public IP of the Kubernetes Worker node"
  value       = module.compute.worker_public_ip
}

output "master_private_ip" {
  description = "Private IP of the Kubernetes Master node"
  value       = module.compute.master_private_ip
}

output "worker_private_ip" {
  description = "Private IP of the Kubernetes Worker node"
  value       = module.compute.worker_private_ip
}

output "frontend_url" {
  description = "URL to access the React Frontend"
  value       = "http://${module.compute.worker_public_ip}:30080"
}

output "api_gateway_url" {
  description = "URL to access the API Gateway"
  value       = "http://${module.compute.worker_public_ip}:30088"
}

output "grafana_url" {
  description = "URL to access Grafana dashboard"
  value       = "http://${module.compute.worker_public_ip}:30300"
}

output "jenkins_url" {
  value       = "http://${module.compute.jenkins_public_ip}:8080"
  description = "Jenkins CI/CD Server URL"
}

output "ecr_repository_urls" {
  description = "Map of service name to ECR repository URL"
  value       = module.ecr.repository_urls
}

output "ssh_master_command" {
  description = "SSH command to connect to the Master node"
  value       = "ssh -i ${var.key_pair_name}.pem ubuntu@${module.compute.master_public_ip}"
}

output "ssh_worker_command" {
  description = "SSH command to connect to the Worker node"
  value       = "ssh -i ${var.key_pair_name}.pem ubuntu@${module.compute.worker_public_ip}"
}
