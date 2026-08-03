#!/bin/bash
# Increase probe delays so Spring Boot (which takes 60-70s) doesn't get killed
NAMESPACE="digitaltwin"
SERVICES="auth-service api-gateway cost-service risk-service simulation-service topology-service cluster-sync"

for svc in $SERVICES; do
  kubectl patch deployment $svc -n $NAMESPACE -p "{\"spec\":{\"template\":{\"spec\":{\"containers\":[{\"name\":\"$svc\",\"livenessProbe\":{\"initialDelaySeconds\":120,\"periodSeconds\":20,\"failureThreshold\":5},\"readinessProbe\":{\"initialDelaySeconds\":90,\"periodSeconds\":10,\"failureThreshold\":6}}]}}}}"
  echo "Patched probes on $svc"
done

echo ""
echo "Waiting 2 minutes for pods to stabilize..."
sleep 120

echo ""
echo "=== Final pod status ==="
kubectl get pods -n $NAMESPACE
