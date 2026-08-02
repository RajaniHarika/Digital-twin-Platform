variable "project_name" {
  type = string
}

variable "ecr_services" {
  description = "List of service names to create ECR repos for"
  type        = list(string)
}

variable "ecr_image_retention_count" {
  description = "Max number of tagged images to keep per repository"
  type        = number
  default     = 3
}
