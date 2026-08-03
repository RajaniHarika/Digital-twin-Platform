$key = "infrastructure\terraform\modules\compute\scripts\digitaltwin-key.pem"
$host_ip = "65.2.224.226"
$remote_dir = "/home/ubuntu/Digital-twin-Platform/infrastructure/k8s/deployments"
$local_dir = "infrastructure\k8s\deployments"

$files = Get-ChildItem "$local_dir\*.yaml"
foreach ($f in $files) {
    $fname = $f.Name
    $content = Get-Content $f.FullName -Raw
    $content | & ssh -o StrictHostKeyChecking=no -i $key "ubuntu@$host_ip" "cat > $remote_dir/$fname"
    Write-Host "Uploaded $fname"
}

Write-Host "`nApplying all deployments..."
& ssh -o StrictHostKeyChecking=no -i $key "ubuntu@$host_ip" "kubectl apply -f $remote_dir/"
Write-Host "Done."
