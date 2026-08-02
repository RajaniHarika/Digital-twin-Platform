pipeline {
    agent any
    
    environment {
        AWS_ACCOUNT_ID = "790304249797"
        AWS_REGION = "ap-south-1"
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        PROJECT_NAME = "digitaltwin"
        K8S_MASTER_IP = "65.2.224.226"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Secret Scanning (GitLeaks)') {
            steps {
                script {
                    echo "Scanning repository for hardcoded secrets, API keys, and passwords..."
                    // Uses Docker to run GitLeaks so we don't have to install it manually on Jenkins
                    sh "docker run --rm -v ${WORKSPACE}:/path zricethezav/gitleaks:latest detect --source=/path -v"
                }
            }
        }

        stage('SAST Security Scan (Semgrep)') {
            steps {
                script {
                    echo "Running Static Application Security Testing (SAST)..."
                    // Semgrep will scan Python, Java, JS files for code vulnerabilities (SQL Injection, XSS, etc)
                    sh "docker run --rm -v ${WORKSPACE}:/src returntocorp/semgrep semgrep scan --config auto"
                }
            }
        }

        stage('IaC Security Scan (Checkov)') {
            steps {
                script {
                    echo "Scanning Infrastructure as Code (Terraform & Kubernetes) for misconfigurations..."
                    // Checks if K8s containers are running as root, missing resource limits, etc.
                    sh "docker run --rm -v ${WORKSPACE}:/tf bridgecrew/checkov --directory /tf/infrastructure/k8s --soft-fail"
                }
            }
        }

        stage('AWS ECR Login') {
            steps {
                withCredentials([aws(credentialsId: 'aws-credentials', accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh """
                    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                    """
                }
            }
        }

        stage('Build, Scan & Push Images (DevSecOps)') {
            steps {
                script {
                    def services = [
                        'frontend': 'frontend',
                        'api-gateway': 'backend/api-gateway',
                        'auth-service': 'backend/auth-service',
                        'topology-service': 'backend/topology-service',
                        'simulation-service': 'backend/simulation-service',
                        'cost-service': 'backend/cost-service',
                        'risk-service': 'backend/risk-service',
                        'cluster-sync-service': 'backend/cluster-sync-service',
                        'ai-service': 'ai-service'
                    ]

                    services.each { name, path ->
                        echo "----------------------------------------"
                        echo "Building ${name}..."
                        sh """
                        cd ${path}
                        docker build -t ${ECR_REGISTRY}/${PROJECT_NAME}/${name}:latest .
                        """
                        
                        echo "SCA & Container Scan for ${name} (Trivy)..."
                        // Scans the OS and application libraries (NPM/Maven/Pip) for CVEs
                        sh """
                        trivy image --severity HIGH,CRITICAL --exit-code 0 --no-progress ${ECR_REGISTRY}/${PROJECT_NAME}/${name}:latest
                        """
                        
                        echo "Pushing ${name} to ECR..."
                        sh """
                        docker push ${ECR_REGISTRY}/${PROJECT_NAME}/${name}:latest
                        """
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'k8s-master-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                    sh '''
                    ssh -i $SSH_KEY -o StrictHostKeyChecking=no ubuntu@$K8S_MASTER_IP '
                        cd Digital-twin-Platform && \\
                        git pull origin develop && \\
                        kubectl apply -f infrastructure/k8s/statefulsets && \\
                        kubectl apply -f infrastructure/k8s/deployments && \\
                        kubectl apply -f infrastructure/k8s/services && \\
                        kubectl rollout restart deployment -n digitaltwin
                    '
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "DevSecOps Pipeline executed successfully!"
        }
        failure {
            echo "Pipeline failed! Security scan or build error. Please check the logs."
        }
    }
}
