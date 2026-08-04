#!/bin/bash
# Patch all deployments to explicitly reference imagePullSecrets
NAMESPACE="digitaltwin"
DEPLOYMENTS="api-gateway auth-service cluster-sync cost-service risk-service simulation-service topology-service"

for dep in $DEPLOYMENTS; do
  kubectl patch deployment $dep -n $NAMESPACE -p '{"spec":{"template":{"spec":{"imagePullSecrets":[{"name":"ecr-registry-secret"}]}}}}'
  echo "Patched imagePullSecrets on $dep"
done

echo ""
echo "Waiting 15 seconds for rollout..."
sleep 15

echo "=== Pod status ==="
kubectl get pods -n $NAMESPACE
