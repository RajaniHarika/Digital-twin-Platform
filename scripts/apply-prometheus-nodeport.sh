#!/bin/bash
# apply-prometheus-nodeport.sh
# Run this on the K8s master (65.2.224.226) after the code is deployed
# This exposes Prometheus on NodePort 30090 so the App Server backend can reach it

echo "Applying Prometheus NodePort service..."
kubectl apply -f /opt/digital-twin/infrastructure/k8s/statefulsets/prometheus-statefulset.yaml -n monitoring

echo "Verifying service type..."
kubectl get svc prometheus -n monitoring

echo "Testing Prometheus is reachable from outside..."
curl -s "http://localhost:30090/api/v1/query?query=up" | head -c 200

echo ""
echo "Done! Prometheus is now accessible at http://65.2.224.226:30090"
