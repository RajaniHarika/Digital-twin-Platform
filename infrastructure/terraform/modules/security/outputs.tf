output "master_sg_id" {
  description = "Security Group ID for the Master node"
  value       = aws_security_group.master.id
}

output "worker_sg_id" {
  description = "Security Group ID for the Worker node"
  value       = aws_security_group.worker.id
}

output "jenkins_sg_id" {
  description = "Security Group ID for the Jenkins node"
  value       = aws_security_group.jenkins.id
}
