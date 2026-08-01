# 🛡️ Digital Twin Platform — DevSecOps CI/CD Pipelines

This directory contains reusable **Declarative Jenkins DevSecOps Pipeline** templates that automate the full **Build → Scan → Secure → Deploy** lifecycle for all microservices in the Digital Twin Platform.

Every pipeline enforces **security-first** practices by integrating **SAST**, **SCA**, and **Container Security Scanning** before any image is pushed or deployed.

---

## 📁 Available Pipeline Templates

| Template File | Application Stack | Target Services |
| :--- | :--- | :--- |
| **`Jenkinsfile.springboot`** | Java 17 + Spring Boot (Maven) | `api-gateway`, `auth-service`, `topology-service`, `cluster-sync-service`, etc. |
| **`Jenkinsfile.react`** | React + Vite (Node.js + Nginx) | `frontend` |
| **`Jenkinsfile.fastapi`** | Python 3.11 + FastAPI | `ai-service`, Simulation/ML workers |

---

## 🔄 DevSecOps Pipeline Flow (9 Stages)

```
┌──────────────────────────────────────────────────────────────────┐
│                     DevSecOps CI/CD Pipeline                     │
│                                                                  │
│  PHASE 1: SOURCE CODE                                           │
│  ┌─────────────────┐    ┌────────────────────────┐              │
│  │ 1. Checkout Code │───►│ 2. Build & Unit Tests  │              │
│  └─────────────────┘    └───────────┬────────────┘              │
│                                     │                            │
│  PHASE 2: SECURITY SCANNING (DevSecOps)                         │
│  ┌──────────────────────────┐  ┌─────────────────────────────┐  │
│  │ 3. SAST: SonarQube Scan  │──► 4. Quality Gate (Pass/Fail) │  │
│  └──────────────────────────┘  └──────────────┬──────────────┘  │
│  ┌──────────────────────────────────────────┐  │                │
│  │ 5. SCA: Trivy FS Dependency CVE Scan     │◄─┘                │
│  └──────────────────────┬───────────────────┘                   │
│                         │                                        │
│  PHASE 3: CONTAINERIZATION                                      │
│  ┌──────────────────────┐  ┌────────────────────────────────┐   │
│  │ 6. Build Docker Image│──► 7. Container Security: Trivy   │   │
│  └──────────────────────┘  │    Image CVE Scan              │   │
│                            └──────────────┬─────────────────┘   │
│                                           │                      │
│  PHASE 4: PUSH & DEPLOY                                         │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐ │
│  │ 8. Push to AWS ECR       │──► 9. Deploy to Kubernetes      │ │
│  │    (ap-south-1)          │  │    (Rolling Update)          │ │
│  └──────────────────────────┘  └──────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Security Tools Integrated

| Tool | Type | Purpose |
| :--- | :--- | :--- |
| **SonarQube** | SAST (Static Application Security Testing) | Scans source code for security hotspots, code smells, bugs, and vulnerabilities |
| **SonarQube Quality Gate** | Policy Enforcement | Halts the pipeline if code does not meet the minimum security/quality threshold |
| **Trivy FS** | SCA (Software Composition Analysis) | Scans `pom.xml`, `package-lock.json`, `requirements.txt` for known CVEs in third-party dependencies |
| **Trivy Image** | Container Security | Scans Docker container images for HIGH/CRITICAL OS and runtime vulnerabilities before pushing to ECR |

---

## 🛠️ Required Jenkins Configuration

### 1. Jenkins Plugins
Install the following plugins from **Manage Jenkins → Plugins**:
* **Pipeline** (Declarative Pipeline support)
* **SonarQube Scanner** (for Quality Gate webhook integration)
* **AWS Credentials** (for ECR authentication)
* **Kubernetes CLI** (for `kubectl` deploy commands)

### 2. Credentials in Jenkins
Configure the following under **Manage Jenkins → Credentials**:

| Credential ID | Type | Description |
| :--- | :--- | :--- |
| `aws-ecr-credentials` | AWS Credentials | IAM Access Key with ECR push permissions |
| `k8s-kubeconfig` | Secret file | Kubeconfig YAML for the Kubernetes cluster |
| `sonar-host-url` | Secret text | SonarQube server URL (e.g., `http://sonarqube:9000`) |
| `sonar-auth-token` | Secret text | SonarQube authentication token for API access |

### 3. Required Tools on Jenkins Worker Node
* **Docker** — For building and scanning container images
* **Trivy** — For filesystem and image vulnerability scanning (`apt install trivy` or download binary)
* **AWS CLI v2** — For ECR authentication
* **kubectl** — For Kubernetes deployments
* **sonar-scanner** — For React and FastAPI SAST (Spring Boot uses Maven plugin directly)

---

## 📋 Pipeline Parameters

Each pipeline exposes standardized parameters that can be overridden per Jenkins job:

| Parameter | Default | Description |
| :--- | :--- | :--- |
| `SERVICE_NAME` | *(varies per template)* | Name of the target microservice |
| `SERVICE_PATH` | *(varies per template)* | Repository-relative path to the service directory |
| `AWS_REGION` | `ap-south-1` | AWS region |
| `ECR_REGISTRY` | `123456789012.dkr.ecr.ap-south-1.amazonaws.com` | AWS ECR Account Registry URL |
| `K8S_NAMESPACE` | `digitaltwin` | Target Kubernetes namespace |
| `IMAGE_TAG` | *(auto: BUILD_NUMBER)* | Optional Docker image tag override |
| `SONAR_PROJECT_KEY` | *(varies per template)* | SonarQube project key |
