pipeline {
    agent any
    
    environment {
        AWS_ACCOUNT_ID = "790304249797"
        AWS_REGION = "ap-south-1"
        DOCKERHUB_USERNAME = "shyammedh"
        PROJECT_NAME = "digitaltwin"
        K8S_MASTER_IP = "65.2.224.226"
        APP_SERVER_IP = "13.202.39.151"
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

        stage('Docker Hub Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                    echo \$DOCKER_PASS | docker login --username \$DOCKER_USER --password-stdin
                    """
                }
            }
        }

        stage('Build, Scan & Push Images (DevSecOps)') {
            steps {
                script {
                    def services = [
                        'api-gateway': 'backend/api-gateway',
                        'auth-service': 'backend/auth-service',
                        'topology-service': 'backend/topology-service',
                        'simulation-service': 'backend/simulation-service',
                        'cost-service': 'backend/cost-service',
                        'risk-service': 'backend/risk-service',
                        'cluster-sync-service': 'backend/cluster-sync-service'
                    ]

                    services.each { name, path ->
                        echo "----------------------------------------"
                        echo "Building ${name}..."
                        sh """
                        cd ${path}
                        docker build -t ${DOCKERHUB_USERNAME}/${PROJECT_NAME}-${name}:latest .
                        """
                        
                        echo "SCA & Container Scan for ${name} (Trivy)..."
                        // Scans the OS and application libraries (NPM/Maven/Pip) for CVEs
                        sh """
                        trivy image --severity HIGH,CRITICAL --exit-code 0 --no-progress ${DOCKERHUB_USERNAME}/${PROJECT_NAME}-${name}:latest
                        """
                        
                        echo "Pushing ${name} to Docker Hub..."
                        sh """
                        docker push ${DOCKERHUB_USERNAME}/${PROJECT_NAME}-${name}:latest
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
                        kubectl apply -f infrastructure/k8s/namespaces.yaml && \\
                        kubectl apply -f infrastructure/k8s/configmaps && \\
                        kubectl apply -f infrastructure/k8s/secrets && \\
                        kubectl apply -f infrastructure/k8s/rbac && \\
                        kubectl apply -f infrastructure/k8s/statefulsets && \\
                        kubectl apply -f infrastructure/k8s/statefulsets/prometheus-statefulset.yaml -n monitoring && \\
                        kubectl apply -f infrastructure/k8s/deployments && \\
                        kubectl apply -f infrastructure/k8s/ingress && \\
                        kubectl apply -f infrastructure/k8s/ingress/prometheus-ingress.yaml -n monitoring && \\
                        kubectl rollout restart deployment -n digitaltwin
                    '
                    '''
                }
            }
        }

        stage('Deploy to App Server') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'app-server-ssh-key', keyFileVariable: 'APP_SSH_KEY')]) {
                    sh '''
                    ssh -i $APP_SSH_KEY -o StrictHostKeyChecking=no ubuntu@$APP_SERVER_IP '
                        cd /opt/twindigital && \\
                        sudo git fetch origin develop && \\
                        sudo git reset --hard origin/develop && \\
                        sudo docker compose down && \\
                        sudo docker compose up -d --build --force-recreate
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
