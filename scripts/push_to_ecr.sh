#!/bin/bash
set -e

REGION="ap-south-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGISTRY_URL="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

echo "Logging in to Amazon ECR: $REGISTRY_URL"
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $REGISTRY_URL

declare -a SERVICES=(
    "frontend:frontend"
    "api-gateway:backend/api-gateway"
    "auth-service:backend/auth-service"
    "cluster-sync:backend/cluster-sync-service"
    "topology-service:backend/topology-service"
    "simulation-service:backend/simulation-service"
    "risk-service:backend/risk-service"
    "cost-service:backend/cost-service"
    "ai-service:ai-service"
)

for svc in "${SERVICES[@]}"; do
    NAME="${svc%%:*}"
    DIR_PATH="${svc##*:}"
    
    IMAGE_NAME="digitaltwin/${NAME}"
    LOCAL_TAG="${IMAGE_NAME}:latest"
    REMOTE_TAG="${REGISTRY_URL}/${IMAGE_NAME}:latest"

    echo "======================================================="
    echo " BUILDING AND PUSHING: $IMAGE_NAME"
    echo " PATH: $DIR_PATH"
    echo "======================================================="

    echo "Building Docker Image: $LOCAL_TAG..."
    docker build -t $LOCAL_TAG $DIR_PATH
    
    echo "Tagging Image: $REMOTE_TAG..."
    docker tag $LOCAL_TAG $REMOTE_TAG

    echo "Pushing to ECR: $REMOTE_TAG..."
    docker push $REMOTE_TAG
    
    echo "✅ Successfully pushed $IMAGE_NAME"
done

echo "🎉 All 9 services have been successfully built and pushed to AWS ECR!"
