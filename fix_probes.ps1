$services = @('auth-service','api-gateway','cost-service','risk-service','simulation-service','topology-service','cluster-sync')
$key = "infrastructure\terraform\modules\compute\scripts\digitaltwin-key.pem"
$host = "ubuntu@65.2.224.226"

foreach ($svc in $services) {
    # Patch liveness: initialDelaySeconds=120, periodSeconds=20, failureThreshold=5
    # Patch readiness: initialDelaySeconds=90, periodSeconds=10, failureThreshold=6
    $patch = '{"spec":{"template":{"spec":{"containers":[{"name":"' + $svc + '","livenessProbe":{"initialDelaySeconds":120,"periodSeconds":20,"failureThreshold":5},"readinessProbe":{"initialDelaySeconds":90,"periodSeconds":10,"failureThreshold":6}}]}}}}'
    & ssh -o StrictHostKeyChecking=no -i $key $host "kubectl patch deployment $svc -n digitaltwin -p '$patch'"
    Write-Host "Patched probes on $svc"
}
