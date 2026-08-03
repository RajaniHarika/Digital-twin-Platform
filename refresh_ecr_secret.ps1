$password = Get-Content ecr_pass.txt -Raw
$password = $password.Trim()
ssh -o StrictHostKeyChecking=no -i "infrastructure\terraform\modules\compute\scripts\digitaltwin-key.pem" "ubuntu@65.2.224.226" "kubectl delete secret ecr-registry-secret -n digitaltwin 2>/dev/null; kubectl create secret docker-registry ecr-registry-secret --docker-server=790304249797.dkr.ecr.ap-south-1.amazonaws.com --docker-username=AWS --docker-password='$password' -n digitaltwin && kubectl patch serviceaccount default -n digitaltwin -p '{`"imagePullSecrets`":[{`"name`":`"ecr-registry-secret`"}]}'"
