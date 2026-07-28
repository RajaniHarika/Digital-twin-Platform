output "repository_urls" {
  description = "Map of service name to ECR repository URL (use in Dockerfiles and Jenkinsfiles)"
  value = {
    for name, repo in aws_ecr_repository.services :
    name => repo.repository_url
  }
}

output "repository_arns" {
  description = "Map of service name to ECR repository ARN"
  value = {
    for name, repo in aws_ecr_repository.services :
    name => repo.arn
  }
}
