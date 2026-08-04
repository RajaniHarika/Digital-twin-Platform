$Region = "ap-south-1"
$AccountId = (aws sts get-caller-identity --query Account --output text).Trim()
$RegistryUrl = "${AccountId}.dkr.ecr.${Region}.amazonaws.com"

Write-Host "Logging in to Amazon ECR: $RegistryUrl" -ForegroundColor Cyan
aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin $RegistryUrl

$Services = @(
    @{ Name = "frontend"; Path = "frontend" },
    @{ Name = "api-gateway"; Path = "backend/api-gateway" },
    @{ Name = "auth-service"; Path = "backend/auth-service" },
    @{ Name = "cluster-sync"; Path = "backend/cluster-sync-service" },
    @{ Name = "topology-service"; Path = "backend/topology-service" },
    @{ Name = "simulation-service"; Path = "backend/simulation-service" },
    @{ Name = "risk-service"; Path = "backend/risk-service" },
    @{ Name = "cost-service"; Path = "backend/cost-service" }
)

foreach ($svc in $Services) {
    $ImageName = "digitaltwin/" + $svc.Name
    $LocalTag = "${ImageName}:latest"
    $RemoteTag = "${RegistryUrl}/${ImageName}:latest"
    $SvcPath = $svc.Path

    Write-Host "`n=======================================================" -ForegroundColor Yellow
    Write-Host " BUILDING AND PUSHING: $ImageName" -ForegroundColor Yellow
    Write-Host " PATH: $SvcPath" -ForegroundColor Yellow
    Write-Host "=======================================================" -ForegroundColor Yellow

    # Build the image
    Write-Host "Building Docker Image: $LocalTag..." -ForegroundColor Cyan
    docker build -t $LocalTag $SvcPath
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to build $ImageName" -ForegroundColor Red
        exit 1
    }

    # Tag the image for ECR
    Write-Host "Tagging Image: $RemoteTag..." -ForegroundColor Cyan
    docker tag $LocalTag $RemoteTag

    # Push the image to ECR
    Write-Host "Pushing to ECR: $RemoteTag..." -ForegroundColor Cyan
    docker push $RemoteTag
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to push $ImageName" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Successfully pushed $ImageName" -ForegroundColor Green
}

Write-Host "`n🎉 All 9 services have been successfully built and pushed to AWS ECR!" -ForegroundColor Green
