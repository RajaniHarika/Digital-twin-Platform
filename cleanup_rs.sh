for rs in $(kubectl get rs -n digitaltwin --no-headers | awk '{if ($2==0) print $1}'); do
  kubectl delete rs $rs -n digitaltwin
  echo "Deleted $rs"
done
echo "Remaining RS:"
kubectl get rs -n digitaltwin
echo ""
echo "Current pods:"
kubectl get pods -n digitaltwin
