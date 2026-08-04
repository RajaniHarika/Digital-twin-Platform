$services = @('auth-service','api-gateway','cluster-sync','cost-service','risk-service','simulation-service','topology-service')
foreach ($svc in $services) {
    $file = "infrastructure\k8s\deployments\$svc.yaml"
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $content = $content -replace 'cpu: "200m"', 'cpu: "100m"'
        $content = $content -replace 'cpu: "500m"', 'cpu: "300m"'
        Set-Content -Path $file -Value $content
        Write-Host "Updated $svc"
    }
}
