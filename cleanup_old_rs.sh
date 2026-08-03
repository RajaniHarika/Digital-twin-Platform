#!/bin/bash
# For each deployment, find the RS with the latest pod-template-hash and scale down the old one
NAMESPACE="digitaltwin"
DEPLOYMENTS="ai-service api-gateway auth-service cluster-sync cost-service frontend risk-service simulation-service topology-service"

for dep in $DEPLOYMENTS; do
  echo "=== $dep ==="
  # Get desired RS (the one owned by current deployment template)
  ACTIVE_RS=$(kubectl get rs -n $NAMESPACE -l app=$dep --no-headers | awk '$2 > 0 {print $1}' | head -1)
  # Get all RS for this deployment
  ALL_RS=$(kubectl get rs -n $NAMESPACE --no-headers | grep "^$dep-" | awk '{print $1}')
  for rs in $ALL_RS; do
    if [ "$rs" != "$ACTIVE_RS" ]; then
      echo "  Deleting old RS: $rs"
      kubectl delete rs $rs -n $NAMESPACE 2>/dev/null || true
    else
      echo "  Keeping active RS: $rs"
    fi
  done
done

echo ""
echo "=== Final pod status ==="
kubectl get pods -n $NAMESPACE
