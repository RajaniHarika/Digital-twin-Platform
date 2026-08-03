#!/bin/bash
set -e

NS="digitaltwin"

echo "=== Step 1: Scale all deployments to 0 ==="
for dep in ai-service api-gateway auth-service cluster-sync cost-service risk-service simulation-service topology-service; do
  kubectl scale deployment $dep -n $NS --replicas=0
  echo "  Scaled down $dep"
done

sleep 5

echo ""
echo "=== Step 2: Delete all stale ReplicaSets ==="
kubectl get rs -n $NS --no-headers | awk '{print $1}' | xargs -r kubectl delete rs -n $NS

sleep 3

echo ""
echo "=== Step 3: Scale all deployments back to 1 ==="
for dep in ai-service api-gateway auth-service cluster-sync cost-service risk-service simulation-service topology-service; do
  kubectl scale deployment $dep -n $NS --replicas=1
  echo "  Scaled up $dep"
done

sleep 10

echo ""
echo "=== Step 4: Final pod status ==="
kubectl get pods -n $NS

echo ""
echo "=== Step 5: Node allocation ==="
kubectl describe node | grep -A6 "Allocated resources"
