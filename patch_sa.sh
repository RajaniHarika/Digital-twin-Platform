kubectl patch serviceaccount default -n digitaltwin -p '{"imagePullSecrets":[{"name":"ecr-registry-secret"}]}'
echo "Patched service account"
kubectl delete pod cluster-sync-f6457797b-5xdmt -n digitaltwin 2>/dev/null || true
kubectl delete pod auth-service-6b77cfc8d6-zq95d -n digitaltwin 2>/dev/null || true
echo "Deleted failing pods - will be recreated with new ECR secret"
kubectl get pods -n digitaltwin
