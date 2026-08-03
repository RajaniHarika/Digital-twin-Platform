#!/bin/bash
# Fix 1: Re-apply MySQL grants (pod IP may have changed)
echo "=== Fixing MySQL grants ==="
kubectl exec -n monitoring virtual-infra-db-0 -- mysql -u root -p'DT@RootPass2024!' -e "
DROP USER IF EXISTS 'dtadmin'@'%';
CREATE USER 'dtadmin'@'%' IDENTIFIED BY 'DT@UserPass2024!';
GRANT ALL PRIVILEGES ON *.* TO 'dtadmin'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
SELECT user, host FROM mysql.user WHERE user='dtadmin';
SHOW GRANTS FOR 'dtadmin'@'%';
"

# Fix 2: Apply fixed cluster-sync deployment
echo ""
echo "=== Applying fixed cluster-sync deployment ==="
kubectl apply -f /home/ubuntu/Digital-twin-Platform/infrastructure/k8s/deployments/cluster-sync.yaml

# Fix 3: Delete failing pods so they restart with correct config
echo ""
echo "=== Restarting auth-service ==="
kubectl delete pod -l app=auth-service -n digitaltwin

echo ""
echo "=== Waiting 15s for pods to settle ==="
sleep 15

echo ""
echo "=== Pod status ==="
kubectl get pods -n digitaltwin
