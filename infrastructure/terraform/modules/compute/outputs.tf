output "master_public_ip"  { value = aws_instance.master.public_ip }
output "master_private_ip" { value = aws_instance.master.private_ip }
output "worker_public_ip"  { value = aws_instance.worker.public_ip }
output "worker_private_ip" { value = aws_instance.worker.private_ip }
output "master_instance_id" { value = aws_instance.master.id }
output "worker_instance_id" { value = aws_instance.worker.id }
