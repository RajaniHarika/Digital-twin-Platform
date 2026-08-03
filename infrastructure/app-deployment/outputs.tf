output "app_server_public_ip" {
  description = "Public IPv4 address of the TwinDigital application server"
  value       = aws_eip.app_eip.public_ip
}

output "app_server_public_dns" {
  description = "Public DNS name of the TwinDigital application server"
  value       = aws_eip.app_eip.public_dns
}

output "application_url" {
  description = "URL to access the live TwinDigital DevOps Platform in your browser"
  value       = "http://${aws_eip.app_eip.public_ip}"
}

output "ssh_command" {
  description = "SSH command to connect to your application server"
  value       = "ssh -i scripts/digitaltwin-app-key.pem ubuntu@${aws_eip.app_eip.public_ip}"
}
