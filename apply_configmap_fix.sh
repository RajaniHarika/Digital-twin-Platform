#!/bin/bash
set -e

echo "=== Applying updated ConfigMap ==="
kubectl apply -f /home/ubuntu/Digital-twin-Platform/infrastructure/k8s/configmaps/app-config.yaml

echo ""
echo "=== Fixing Redis PVC - deleting and re-creating ==="
kubectl delete statefulset redis-statefulset -n digitaltwin 2>/dev/null || true
kubectl delete pvc redis-data-redis-statefulset-0 -n digitaltwin 2>/dev/null || true
kubectl delete pv redis-pv 2>/dev/null || true
sleep 3
kubectl apply -f /home/ubuntu/Digital-twin-Platform/infrastructure/k8s/statefulsets/redis-statefulset.yaml

echo ""
echo "=== Restarting all backend services to pick up new ConfigMap ==="
for dep in auth-service api-gateway cluster-sync cost-service risk-service simulation-service topology-service; do
  kubectl rollout restart deployment/$dep -n digitaltwin
  echo "  Restarted $dep"
done

echo ""
echo "=== Waiting 45s for Spring Boot services to start ==="
sleep 45

echo ""
echo "=== Final pod status ==="
kubectl get pods -n digitaltwin
