# Digital-Twin Platform — Deployment & Infrastructure Implementation Plan

**Author:** Shyam (DevOps Engineer)
**Branch:** `feature/kubernetes-setup`
**Cloud Provider:** AWS (Free Tier — Max Eligible Instances)
**Tooling Stack:** Terraform (Modular) · Kubernetes (`kubeadm`) · Jenkins (Master-Worker) · Prometheus · Grafana · AWS ECR

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Data Storage & AI Prediction Flow](#3-data-storage--ai-prediction-flow)
4. [AWS Free-Tier Infrastructure Sizing](#4-aws-free-tier-infrastructure-sizing)
5. [Terraform Modular Structure](#5-terraform-modular-structure)
6. [Kubernetes Cluster Design](#6-kubernetes-cluster-design)
7. [Kubernetes StatefulSets (Persistent Data)](#7-kubernetes-statefulsets-persistent-data)
8. [Kubernetes Deployments (Microservices)](#8-kubernetes-deployments-microservices)
9. [Jenkins Master-Worker CI/CD Pipeline](#9-jenkins-master-worker-cicd-pipeline)
10. [Observability — Prometheus & Grafana](#10-observability--prometheus--grafana)
11. [Phase-by-Phase Execution Plan](#11-phase-by-phase-execution-plan)
12. [Full Directory Structure](#12-full-directory-structure)
13. [Verification & Testing Checklist](#13-verification--testing-checklist)

---

## 1. Project Overview

The **Digital-Twin Platform** is an enterprise-grade cloud-native platform that creates and manages a **live digital replica** of a real Kubernetes cluster. It enables DevOps teams to:

- **Visualize** the live topology of their Kubernetes infrastructure (nodes, pods, services, namespaces).
- **Simulate** virtual infrastructure changes (scaling, node failure, traffic spikes) safely before applying to production.
- **Predict** deployment risks, downtime probability, and rollback requirements.
- **Calculate** real-time and projected cloud infrastructure costs.
- **Receive AI-driven recommendations** powered by machine learning models.

### My Role (DevOps Responsibility)
As the DevOps Engineer on this project, I am responsible for the **entire lifecycle after application development**:
- Provisioning AWS cloud infrastructure with **Terraform**.
- Bootstrapping a self-managed **Kubernetes cluster** using `kubeadm`.
- Writing **Kubernetes manifests** (Deployments, StatefulSets, Services, Ingress).
- Setting up **Jenkins Master-Worker CI/CD pipelines** for automated build and deployment.
- Configuring **Prometheus & Grafana** for cluster and application observability.

---

## 2. System Architecture Overview

```
                           +----------------------+
                           |    React Frontend    |
                           |  Material UI + Axios |
                           +----------+-----------+
                                      |
                              JWT Authentication
                                      |
                                      v
                     +-------------------------------+
                     |      API Gateway Service       |
                     | Spring Cloud Gateway + JWT     |
                     +---------------+---------------+
                                     |
         ---------------------------------------------------------------
         |          |            |            |           |            |
         v          v            v            v           v            v
  +-----------+ +----------+ +----------+ +----------+ +----------+ +----------+
  | Auth      | | Cluster  | | Topology | |Simulation| | Risk     | | Cost     |
  | Service   | | Sync     | | Service  | | Service  | | Service  | | Service  |
  | :8081     | | :8082    | | :8083    | | :8084    | | :8085    | | :8086    |
  +-----------+ +----------+ +----------+ +----------+ +----------+ +----------+
         |          |            |            |           |            |
         |          |            |            |           |            |
         -----------------------------------------------------------------
                                   |
                                   v
                         +----------------------+
                         |      AI Service      |
                         | FastAPI + ML Models  |
                         |       :8000          |
                         +----------+-----------+
                                    |
                                    v
                          +----------------------+
                          | Recommendation Engine|
                          +----------------------+
```

### Internal Kubernetes Networking (ClusterIP DNS)
All inter-service communication happens via Kubernetes internal DNS. No service talks directly to another — everything routes through the API Gateway:

| Service | Internal DNS | Port |
|---------|-------------|------|
| API Gateway | `api-gateway.digitaltwin.svc.cluster.local` | 8080 |
| Auth Service | `auth-service.digitaltwin.svc.cluster.local` | 8081 |
| Cluster Sync | `cluster-sync.digitaltwin.svc.cluster.local` | 8082 |
| Topology Service | `topology-service.digitaltwin.svc.cluster.local` | 8083 |
| Simulation Service | `simulation-service.digitaltwin.svc.cluster.local` | 8084 |
| Risk Service | `risk-service.digitaltwin.svc.cluster.local` | 8085 |
| Cost Service | `cost-service.digitaltwin.svc.cluster.local` | 8086 |
| AI Service | `ai-service.digitaltwin.svc.cluster.local` | 8000 |
| MySQL DB | `virtual-infra-db.digitaltwin.svc.cluster.local` | 3306 |
| Prometheus | `prometheus.monitoring.svc.cluster.local` | 9090 |
| Grafana | `grafana.monitoring.svc.cluster.local` | 3000 |

---

## 3. Data Storage & AI Prediction Flow

### 3.1 What Data is Generated & Where it is Stored

The platform generates two types of data that must be persisted permanently across pod restarts.

#### Type 1: Structural / Graph Data → MySQL (StatefulSet)
When users perform actions on the platform, all relational data is saved to the MySQL 8.0 Digital-Twin database:
- **Auth Service** writes: Users, Roles (ADMIN, DEVOPS_ENGINEER, CLOUD_ENGINEER, etc.), JWT token metadata.
- **Cluster Sync Service** writes: Snapshots of live Kubernetes objects (Nodes, Pods, Deployments, Services, ConfigMaps, Secrets, PVs, Ingress).
- **Simulation Service** writes: Virtual test scenarios (`SimulationRun` records), modified virtual topology graphs (e.g., "Virtual cluster with Node-1 deleted and replica count doubled").
- **AI Service** writes: Computed recommendations and anomaly flags.

#### Type 2: Time-Series Metrics Data → Prometheus (StatefulSet)
The Prometheus daemon continuously scrapes live metrics:
- **Node Exporter** on each EC2 instance: CPU usage %, Memory usage %, Disk I/O, Network throughput.
- **Spring Boot Actuator** endpoints (`/actuator/prometheus`) of all 6 Java services: JVM heap usage, garbage collection pauses, HTTP request latency, active thread count.
- **FastAPI AI Service** Prometheus middleware: ML inference time, request queue depth.

### 3.2 How Risk, Cost & AI Services Read Data for Predictions

```
[Simulation Service]
        |
        | Writes SimulationRun to MySQL
        v
[MySQL Database (8.0)]               [Prometheus TSDB]
        |                                    |
        | SELECT * FROM simulation_runs      | /api/v1/query?query=cpu_usage_avg
        | WHERE status='PENDING'             | /api/v1/query_range?...
        v                                    v
[Risk Service (Spring Boot)]
        - Reads virtual topology from MySQL (how many replicas, what nodes)
        - Reads historical CPU/Memory from Prometheus API
        - Calculates: Downtime probability %, Pod failure risk, Rollback suggestion
        - Writes RiskReport to MySQL

[Cost Service (Spring Boot)]
        - Reads virtual node and pod count from MySQL
        - Reads actual resource consumption % from Prometheus
        - Calculates: Monthly cost (CPU hrs × rate, Memory hrs × rate, Storage GB × rate)
        - Writes CostReport to MySQL

[AI Service (FastAPI + ML Models)]
        - Queries MySQL: SimulationRun + RiskReport + CostReport
        - Queries Prometheus: 7-day historical metric trends
        - Runs ML inference (capacity planning, anomaly detection, optimization)
        - Writes Recommendations to MySQL
        - React Frontend polls: GET /api/v1/ai/recommendations → displays to user
```

---

## 4. AWS Free-Tier Infrastructure Sizing

### 4.1 EC2 Instances (Free Tier Eligible Flex Instances)

| Role | Instance Type | vCPU | RAM | Storage | Monthly Cost |
|------|--------------|------|-----|---------|-------------|
| Kubernetes Master (Control Plane) | `c7i-flex.large` | 2 | 4 GiB | 15 GB GP3 EBS | **FREE** |
| Kubernetes Worker Node | `m7i-flex.large` | 2 | 8 GiB | 15 GB GP3 EBS | **FREE** |
| **Total** | — | **4 vCPU** | **12 GiB** | **30 GB** | **$0.00** |

> **Why these instances?**
> - `c7i-flex.large` (4GB RAM): Perfectly sized for the Kubernetes control plane. The `kube-apiserver`, `etcd`, `kube-scheduler`, and `kube-controller-manager` require at least 2GB RAM comfortably.
> - `m7i-flex.large` (8GB RAM): Hosts all 9 application workloads. Budget breakdown: 6 Spring Boot services (256MB each = 1.5GB), FastAPI AI (512MB), React Nginx (64MB), Prometheus (512MB), Grafana (256MB), MySQL (512MB) = ~3.5GB used out of 8GB available. Plenty of room!

### 4.2 Total EBS Storage Budget (Free Tier = 30GB max)
- Master Node root volume: **15 GB GP3**
- Worker Node root volume: **15 GB GP3**
- **Total: 30 GB = $0.00/month (exactly at Free Tier limit!)**

### 4.3 AWS ECR (Container Registry)
- AWS Free Tier: **500 MB of private registry storage per month**
- We provision 9 repositories with a lifecycle policy to keep only the **last 3 image versions** to stay within the 500MB limit.

### 4.4 What We Are NOT Using (Cost Elimination)
| AWS Service | Monthly Cost Saved | Why Eliminated |
|------------|-------------------|----------------|
| NAT Gateway | ~$32/month | EC2 nodes run in Public Subnets. Direct internet access via IGW for pulling Docker images. Security enforced by Security Groups. |
| AWS Application Load Balancer (ALB) | ~$18/month | Frontend and API Gateway exposed via Kubernetes NodePort (port 30080, 30088) directly on Worker node's public IP. |
| AWS RDS (Managed MySQL) | ~$15/month | MySQL runs as a Kubernetes StatefulSet inside our cluster. |

---

## 5. Terraform Modular Structure

### 5.1 Why Modular Terraform?
Instead of writing one giant `main.tf` file with 1000 lines, we split infrastructure into independent, reusable **Terraform Modules**. Each module has one job and one job only. This makes the code easy to understand, maintain, and reuse.

### 5.2 Module Breakdown

#### Module 1: `modules/networking/` — AWS VPC & Subnets
**What it does:** Creates the virtual network (VPC) that all EC2 instances live inside. Think of it as creating the building before placing rooms in it.

**Resources it creates:**
- `aws_vpc` → Virtual Private Cloud `10.0.0.0/16`
- `aws_subnet` (x2 Public Subnets) → `10.0.1.0/24` (AZ-a), `10.0.2.0/24` (AZ-b)
- `aws_internet_gateway` → Allows EC2s to reach the internet (for pulling Docker images, calling AWS APIs)
- `aws_route_table` + `aws_route_table_association` → Connects subnets to the IGW

**Files:** `main.tf`, `variables.tf`, `outputs.tf`

---

#### Module 2: `modules/security/` — AWS Security Groups (Firewall Rules)
**What it does:** Creates the firewall rules that control which network traffic is allowed to reach our EC2 instances.

**Resources it creates:**
- **Master Node Security Group:**
  - TCP `6443` from Worker nodes only → Kubernetes API Server
  - TCP `2379-2380` from Master only → `etcd` peer communication
  - TCP `10250` from within VPC → `kubelet` API
  - TCP `22` from your IP only → SSH admin access
- **Worker Node Security Group:**
  - TCP `10250` from within VPC → `kubelet` API
  - TCP `30000-32767` from `0.0.0.0/0` → NodePort services (Frontend + API Gateway public access)
  - TCP `179` between all nodes → Calico BGP (container networking)
  - All traffic from within the VPC `10.0.0.0/16` → Inter-pod communication

**Files:** `main.tf`, `variables.tf`, `outputs.tf`

---

#### Module 3: `modules/compute/` — EC2 Instances + kubeadm Bootstrap
**What it does:** Creates the actual virtual machines on AWS and automatically installs and configures a Kubernetes cluster on them using `kubeadm`.

**Resources it creates:**
- `aws_key_pair` → SSH key for admin access
- `aws_instance` (Master: `c7i-flex.large`) with `user_data = install_master.sh`
- `aws_instance` (Worker: `m7i-flex.large`) with `user_data = install_worker.sh`
- `aws_ssm_parameter` → Stores `kubeadm join` token securely so Worker can auto-join Master

**`install_master.sh` script does:**
1. Disable swap (`swapoff -a`) and set kernel networking params for Kubernetes.
2. Install `containerd` (container runtime) and configure `SystemdCgroup = true`.
3. Install `kubeadm`, `kubelet`, `kubectl` from the official Kubernetes apt repository.
4. Run `kubeadm init --pod-network-cidr=192.168.0.0/16` to initialize the control plane.
5. Configure `KUBECONFIG` for the ubuntu user.
6. Install Calico CNI (pod-to-pod networking): `kubectl apply -f calico.yaml`.
7. Generate `kubeadm join` command and save it to AWS SSM Parameter Store.

**`install_worker.sh` script does:**
1. Install `containerd`, `kubeadm`, `kubelet`.
2. Fetch the join command from AWS SSM Parameter Store.
3. Run `kubeadm join <master-private-ip>:6443 --token ... --discovery-token-ca-cert-hash sha256:...`

**Files:** `main.tf`, `variables.tf`, `outputs.tf`, `scripts/install_master.sh`, `scripts/install_worker.sh`

---

#### Module 4: `modules/ecr/` — AWS Container Registry
**What it does:** Creates 9 private Docker image repositories in AWS ECR. Jenkins pushes freshly built Docker images here, and Kubernetes pulls from here during deployments.

**ECR Repositories Created:**
1. `digitaltwin/frontend`
2. `digitaltwin/api-gateway`
3. `digitaltwin/auth-service`
4. `digitaltwin/cluster-sync`
5. `digitaltwin/topology-service`
6. `digitaltwin/simulation-service`
7. `digitaltwin/risk-service`
8. `digitaltwin/cost-service`
9. `digitaltwin/ai-service`

**Each repository has:**
- `image_tag_mutability = "MUTABLE"` → allows overwriting the `latest` tag
- `scan_on_push = true` → automatic vulnerability scanning on every push
- Lifecycle policy: Keep last **3 tagged images** only (to stay within the 500MB Free Tier limit)

**Files:** `main.tf`, `variables.tf`, `outputs.tf`

---

## 6. Kubernetes Cluster Design

### 6.1 Cluster Topology
```
┌─────────────────────────────────────────────────────────────┐
│                    AWS VPC (10.0.0.0/16)                     │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  Public Subnet (10.0.1.0/24)                          │   │
│  │                                                       │   │
│  │  ┌──────────────────────┐  ┌──────────────────────┐  │   │
│  │  │  Master Node          │  │  Worker Node          │  │   │
│  │  │  c7i-flex.large       │  │  m7i-flex.large       │  │   │
│  │  │  2 vCPU / 4 GiB RAM  │  │  2 vCPU / 8 GiB RAM  │  │   │
│  │  │  15 GB GP3 EBS        │  │  15 GB GP3 EBS        │  │   │
│  │  │                       │  │                       │  │   │
│  │  │  kube-apiserver       │  │  digitaltwin namespace│  │   │
│  │  │  kube-scheduler       │  │  - api-gateway        │  │   │
│  │  │  kube-controller-mgr  │  │  - auth-service       │  │   │
│  │  │  etcd                 │  │  - cluster-sync       │  │   │
│  │  │  calico               │  │  - topology-service   │  │   │
│  │  │                       │  │  - simulation-service │  │   │
│  │  │                       │  │  - risk-service       │  │   │
│  │  │                       │  │  - cost-service       │  │   │
│  │  │                       │  │  - ai-service         │  │   │
│  │  │                       │  │  - frontend           │  │   │
│  │  │                       │  │                       │  │   │
│  │  │                       │  │  monitoring namespace │  │   │
│  │  │                       │  │  - prometheus         │  │   │
│  │  │                       │  │  - grafana            │  │   │
│  │  │                       │  │  - virtual-infra-db   │  │   │
│  │  └──────────────────────┘  └──────────────────────┘  │   │
│  └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Kubernetes Namespaces
- `digitaltwin` → All application microservices
- `monitoring` → Prometheus, Grafana, MySQL StatefulSets
- `kube-system` → Kubernetes system components (auto-created by kubeadm)

### 6.3 Kubernetes Service Account & RBAC for Cluster Sync
The **Cluster Sync Service** is special — it needs to read the live Kubernetes cluster state (nodes, pods, deployments, services, etc.) by calling the Kubernetes API. We create a dedicated `ServiceAccount` and `ClusterRole` for it:

```
cluster-sync ServiceAccount
    |
    | bound to ClusterRole: cluster-sync-reader
    |
    v
ClusterRole permissions:
    - get, list, watch: nodes
    - get, list, watch: pods
    - get, list, watch: deployments
    - get, list, watch: services
    - get, list, watch: configmaps
    - get, list, watch: namespaces
    - get, list, watch: persistentvolumes
    - get, list, watch: ingresses
```

---

## 7. Kubernetes StatefulSets (Persistent Data)

StatefulSets are used for workloads that store data permanently. Unlike normal Deployments where pods can be deleted and recreated freely, StatefulSets give each pod a stable name and a dedicated storage volume.

### 7.1 Why HostPath PVs (Not Dynamic EBS PVCs)?
Since our 30 GB EBS budget is fully used by the root volumes of our 2 EC2 instances, we use **Kubernetes HostPath PersistentVolumes** that write directly to the Worker node's 15 GB root disk (inside a `/data/` directory on the host). This gives us persistent storage at zero extra cost.

### 7.2 MySQL StatefulSet (`virtual-infra-db`)
```
StatefulSet: virtual-infra-db
Namespace:   monitoring
Image:       mysql:8.0
Replicas:    1
Storage:     HostPath PV → /data/mysql on Worker node (5 GB)

Environment Variables:
  MYSQL_DATABASE:          digitaltwin
  MYSQL_USER:              dtadmin
  MYSQL_PASSWORD:          (from Kubernetes Secret)
  MYSQL_ROOT_PASSWORD:     (from Kubernetes Secret)

Memory & Buffer Config (my.cnf command line flags):
  --innodb-buffer-pool-size=512M
  --max-connections=100
  --character-set-server=utf8mb4
  --collation-server=utf8mb4_unicode_ci

Service:
  Type: ClusterIP
  Port: 3306
  DNS:  virtual-infra-db.monitoring.svc.cluster.local
```

### 7.3 Prometheus StatefulSet
```
StatefulSet: prometheus
Namespace:   monitoring
Image:       prom/prometheus:v2.48.0
Replicas:    1
Storage:     HostPath PV → /data/prometheus on Worker node (5 GB)

Config (ConfigMap prometheus-config):
  global:
    scrape_interval: 15s
  scrape_configs:
    - job: kubernetes-nodes      (Node Exporter scrape)
    - job: auth-service          (/actuator/prometheus)
    - job: cluster-sync          (/actuator/prometheus)
    - job: topology-service      (/actuator/prometheus)
    - job: simulation-service    (/actuator/prometheus)
    - job: risk-service          (/actuator/prometheus)
    - job: cost-service          (/actuator/prometheus)
    - job: ai-service            (/metrics via FastAPI)

Retention: 15d (15 days of historical metrics)

Service:
  Type: ClusterIP
  Port: 9090
  DNS:  prometheus.monitoring.svc.cluster.local
```

### 7.4 Grafana StatefulSet
```
StatefulSet: grafana
Namespace:   monitoring
Image:       grafana/grafana:10.2.0
Replicas:    1
Storage:     HostPath PV → /data/grafana on Worker node (3 GB)

Environment Variables:
  GF_SECURITY_ADMIN_USER:     admin
  GF_SECURITY_ADMIN_PASSWORD: (from Kubernetes Secret)

Pre-configured Datasources (via ConfigMap):
  - Prometheus → http://prometheus:9090

Pre-configured Dashboards:
  - Dashboard 1: "Cluster Node Health" (CPU%, RAM%, Disk I/O per node)
  - Dashboard 2: "Digital-Twin Microservices Health" (HTTP latency, JVM heap, GC pauses per service)
  - Dashboard 3: "AI Service Metrics" (Inference time, queue depth)

Service:
  Type: NodePort
  Port: 3000 → NodePort: 30300
  External Access: http://<Worker-Node-Public-IP>:30300
```

---

## 8. Kubernetes Deployments (Microservices)

All microservices are **stateless** — they don't store data themselves. They read/write from MySQL and Prometheus. So they use standard Kubernetes `Deployments` (not StatefulSets).

### 8.1 JVM Memory Tuning (Spring Boot Services)
Each Spring Boot service has JVM flags to cap its memory usage and prevent OOM on the shared worker node:
```
JAVA_OPTS: "-Xms256m -Xmx512m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
```

### 8.2 All Service Deployments Summary

| Service | Image | Replicas | Memory Request | Memory Limit | Service Type | NodePort |
|---------|-------|----------|---------------|-------------|-------------|---------|
| `api-gateway` | `ecr/.../digitaltwin-api-gateway` | 1 | 256Mi | 512Mi | NodePort | 30088 |
| `auth-service` | `ecr/.../digitaltwin-auth-service` | 1 | 256Mi | 512Mi | ClusterIP | — |
| `cluster-sync` | `ecr/.../digitaltwin-cluster-sync` | 1 | 256Mi | 512Mi | ClusterIP | — |
| `topology-service` | `ecr/.../digitaltwin-topology-service` | 1 | 256Mi | 512Mi | ClusterIP | — |
| `simulation-service` | `ecr/.../digitaltwin-simulation-service` | 1 | 256Mi | 512Mi | ClusterIP | — |
| `risk-service` | `ecr/.../digitaltwin-risk-service` | 1 | 256Mi | 512Mi | ClusterIP | — |
| `cost-service` | `ecr/.../digitaltwin-cost-service` | 1 | 256Mi | 512Mi | ClusterIP | — |
| `ai-service` | `ecr/.../digitaltwin-ai-service` | 1 | 256Mi | 512Mi | ClusterIP | — |
| `frontend` | `ecr/.../digitaltwin-frontend` | 1 | 64Mi | 128Mi | NodePort | 30080 |

### 8.3 External Access (No ALB — Free Tier!)
- **React Frontend**: `http://<Worker-Node-Public-IP>:30080`
- **API Gateway (Swagger/Health)**: `http://<Worker-Node-Public-IP>:30088`
- **Grafana Dashboards**: `http://<Worker-Node-Public-IP>:30300`

---

## 9. Jenkins Master-Worker CI/CD Pipeline

### 9.1 Jenkins Architecture
We use a **Jenkins Master-Worker (Controller-Agent)** architecture:
- **Jenkins Master (Controller):** Runs the Jenkins UI, manages pipeline scheduling, and does no heavy work.
- **Jenkins Agent (Worker):** A separate node where the actual build jobs run (Maven builds, npm builds, Docker image builds). This prevents heavy CPU/RAM builds from crashing the Jenkins controller.

> **For Free Tier:** Jenkins Controller and Agent can both run locally on your laptop during the development phase and be triggered via ngrok tunnels, or run as a Kubernetes Pod inside the cluster to save money.

### 9.2 Pipeline Flow (for Each Service)
```
[Developer pushes code to GitHub]
        |
        v
[Jenkins detects push via GitHub Webhook]
        |
        v
[Jenkins Controller receives trigger]
        |
        v
[Jenkins Controller dispatches job to Build Agent]
        |
        v
[Build Agent - Stage 1: Checkout]
  git clone <branch>
        |
        v
[Build Agent - Stage 2: Test & Build]
  Java:   mvn clean package -DskipTests
  React:  npm install && npm run build
  Python: pip install -r requirements.txt && pytest
        |
        v
[Build Agent - Stage 3: Docker Build]
  docker build -t <ecr-url>/digitaltwin-<service>:$BUILD_NUMBER .
        |
        v
[Build Agent - Stage 4: Push to AWS ECR]
  aws ecr get-login-password | docker login <ecr-url>
  docker push <ecr-url>/digitaltwin-<service>:$BUILD_NUMBER
        |
        v
[Build Agent - Stage 5: Deploy to Kubernetes]
  kubectl set image deployment/<service> \
    <service>=<ecr-url>/digitaltwin-<service>:$BUILD_NUMBER \
    -n digitaltwin
  kubectl rollout status deployment/<service> -n digitaltwin
```

### 9.3 Jenkinsfile Templates

**`Jenkinsfile.springboot`** — Template for all 6 Java services:
```groovy
pipeline {
  agent { label 'build-agent' }
  environment {
    ECR_REGISTRY = "<aws-account-id>.dkr.ecr.ap-south-1.amazonaws.com"
    SERVICE_NAME = "${params.SERVICE_NAME}"  // e.g. auth-service
  }
  stages {
    stage('Checkout')     { steps { checkout scm } }
    stage('Build JAR')    { steps { sh "cd backend/${SERVICE_NAME} && mvn clean package -DskipTests" } }
    stage('Docker Build') { steps { sh "docker build -t ${ECR_REGISTRY}/digitaltwin-${SERVICE_NAME}:${BUILD_NUMBER} ./backend/${SERVICE_NAME}" } }
    stage('ECR Push')     { steps { sh "aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin ${ECR_REGISTRY} && docker push ${ECR_REGISTRY}/digitaltwin-${SERVICE_NAME}:${BUILD_NUMBER}" } }
    stage('K8s Deploy')   { steps { sh "kubectl set image deployment/${SERVICE_NAME} ${SERVICE_NAME}=${ECR_REGISTRY}/digitaltwin-${SERVICE_NAME}:${BUILD_NUMBER} -n digitaltwin && kubectl rollout status deployment/${SERVICE_NAME} -n digitaltwin" } }
  }
}
```

---

## 10. Observability — Prometheus & Grafana

### 10.1 What Prometheus Monitors
Prometheus collects and stores metrics from these sources every **15 seconds**:

| Source | Metrics Collected |
|--------|------------------|
| Node Exporter (EC2 Master & Worker) | CPU usage %, RAM usage %, Disk read/write I/O, Network bytes sent/received |
| Spring Boot Actuator (`/actuator/prometheus`) for all 6 Java services | JVM heap used, GC pause duration, HTTP request latency (p50/p95/p99), active threads, DB connection pool usage |
| FastAPI AI Service (`/metrics`) | ML model inference time (ms), API request rate, error rate |
| Kubernetes API (kube-state-metrics) | Pod status (Running/Pending/Failed), Deployment replica count, StatefulSet health |

### 10.2 Key Grafana Dashboards

**Dashboard 1: Cluster Infrastructure Health**
- Node CPU usage % (Master vs Worker)
- Node RAM usage % (Master vs Worker)
- Disk I/O throughput
- Alert: Node CPU > 85% for 5 minutes → Slack/email notification

**Dashboard 2: Digital-Twin Microservices Health**
- HTTP request latency (p95) per service
- JVM Heap used per Spring Boot service
- HTTP 5xx error rate per service
- Alert: Error rate > 5% for any service → Slack/email notification

**Dashboard 3: AI Simulation Insights**
- ML inference time per request
- Active simulation runs count
- Cost recommendations generated per hour

---

## 11. Phase-by-Phase Execution Plan

### Phase 1: Modular AWS Networking (Week 1)
**Goal:** Create secure AWS network infrastructure at $0.00 cost.

| Step | Task | Files Created |
|------|------|--------------|
| 1.1 | Create Terraform root skeleton | `main.tf`, `variables.tf`, `outputs.tf`, `providers.tf`, `terraform.tfvars.example` |
| 1.2 | Build Networking Module | `modules/networking/main.tf`, `variables.tf`, `outputs.tf` |
| 1.3 | Build Security Groups Module | `modules/security/main.tf`, `variables.tf`, `outputs.tf` |
| 1.4 | Run `terraform plan` and verify 0 NAT Gateways, correct CIDR blocks | — |

---

### Phase 2: EC2 Compute & Kubernetes Cluster (Week 1-2)
**Goal:** Provision `c7i-flex.large` Master and `m7i-flex.large` Worker. Auto-bootstrap Kubernetes with `kubeadm`.

| Step | Task | Files Created |
|------|------|--------------|
| 2.1 | Build Compute Module | `modules/compute/main.tf`, `variables.tf`, `outputs.tf` |
| 2.2 | Write Master bootstrap script | `modules/compute/scripts/install_master.sh` |
| 2.3 | Write Worker bootstrap script | `modules/compute/scripts/install_worker.sh` |
| 2.4 | Run `terraform apply` and verify | `kubectl get nodes` should show Master + Worker in `Ready` state |

---

### Phase 3: AWS ECR Repositories (Week 2)
**Goal:** Create 9 private Docker registries for all services.

| Step | Task | Files Created |
|------|------|--------------|
| 3.1 | Build ECR Module | `modules/ecr/main.tf`, `variables.tf`, `outputs.tf` |
| 3.2 | Run `terraform apply` to create repositories | — |
| 3.3 | Test by pushing a sample Docker image and verifying lifecycle rules | — |

---

### Phase 4: Stateful Workloads — Prometheus, Grafana, MySQL (Week 2-3)
**Goal:** Deploy StatefulSets for all persistent data workloads.

| Step | Task | Files Created |
|------|------|--------------|
| 4.1 | Create Kubernetes namespaces | `k8s/namespaces.yaml` |
| 4.2 | Create HostPath PVs and StorageClass | `k8s/storage-class.yaml` |
| 4.3 | Deploy MySQL StatefulSet | `k8s/statefulsets/virtual-infra-db-statefulset.yaml` |
| 4.4 | Deploy Prometheus StatefulSet with ConfigMap | `k8s/statefulsets/prometheus-statefulset.yaml`, `k8s/configmaps/prometheus-config.yaml` |
| 4.5 | Deploy Grafana StatefulSet with Dashboards | `k8s/statefulsets/grafana-statefulset.yaml` |
| 4.6 | Verify pods Running and PVCs Bound | `kubectl get pods,pvc -n monitoring` |

---

### Phase 5: Microservice Deployments (Week 3-4)
**Goal:** Deploy all 9 application services and configure routing.

| Step | Task | Files Created |
|------|------|--------------|
| 5.1 | Create Secrets for DB password, JWT secret | `k8s/secrets/` |
| 5.2 | Create ConfigMaps for application properties | `k8s/configmaps/` |
| 5.3 | Deploy Auth Service | `k8s/deployments/auth-service.yaml` |
| 5.4 | Deploy Cluster Sync Service (with RBAC) | `k8s/deployments/cluster-sync.yaml`, `k8s/rbac/cluster-sync-rbac.yaml` |
| 5.5 | Deploy remaining 5 backend services | `k8s/deployments/topology/simulation/risk/cost/ai-service.yaml` |
| 5.6 | Deploy API Gateway | `k8s/deployments/api-gateway.yaml` |
| 5.7 | Deploy React Frontend | `k8s/deployments/frontend.yaml` |
| 5.8 | Verify all 9 pods Running and test API via NodePort | `kubectl get pods -n digitaltwin` |

---

### Phase 6: Jenkins CI/CD Pipelines (Week 4)
**Goal:** Automate the entire build → containerize → deploy workflow.

| Step | Task | Files Created |
|------|------|--------------|
| 6.1 | Set up Jenkins Controller + Build Agent | `infrastructure/jenkins/` |
| 6.2 | Create reusable Jenkinsfile for Spring Boot services | `jenkins/Jenkinsfile.springboot` |
| 6.3 | Create reusable Jenkinsfile for React Frontend | `jenkins/Jenkinsfile.react` |
| 6.4 | Create reusable Jenkinsfile for FastAPI AI Service | `jenkins/Jenkinsfile.fastapi` |
| 6.5 | Configure GitHub Webhooks and test end-to-end pipeline | — |

---

## 12. Full Directory Structure

```
infrastructure/
├── terraform/
│   ├── main.tf                          # Root: calls all modules
│   ├── variables.tf                     # Global variables
│   ├── outputs.tf                       # Global outputs (IPs, ECR URLs)
│   ├── providers.tf                     # AWS provider + version lock
│   ├── terraform.tfvars.example         # Template for user config
│   └── modules/
│       ├── networking/
│       │   ├── main.tf                  # VPC, Subnets, IGW, Route Tables
│       │   ├── variables.tf
│       │   └── outputs.tf
│       ├── security/
│       │   ├── main.tf                  # Master SG, Worker SG
│       │   ├── variables.tf
│       │   └── outputs.tf
│       ├── compute/
│       │   ├── main.tf                  # EC2 instances, Key Pair, SSM
│       │   ├── variables.tf
│       │   ├── outputs.tf
│       │   └── scripts/
│       │       ├── install_master.sh    # kubeadm init script
│       │       └── install_worker.sh   # kubeadm join script
│       └── ecr/
│           ├── main.tf                  # 9 ECR repositories
│           ├── variables.tf
│           └── outputs.tf
│
├── k8s/
│   ├── namespaces.yaml                  # digitaltwin + monitoring namespaces
│   ├── storage-class.yaml              # HostPath StorageClass
│   ├── secrets/                        # K8s Secrets (DB password, JWT key)
│   ├── configmaps/                     # App config, Prometheus scrape config
│   ├── rbac/
│   │   └── cluster-sync-rbac.yaml     # ServiceAccount + ClusterRole for Cluster Sync
│   ├── statefulsets/
│   │   ├── prometheus-statefulset.yaml
│   │   ├── grafana-statefulset.yaml
│   │   └── virtual-infra-db-statefulset.yaml
│   └── deployments/
│       ├── api-gateway.yaml
│       ├── auth-service.yaml
│       ├── cluster-sync.yaml
│       ├── topology-service.yaml
│       ├── simulation-service.yaml
│       ├── risk-service.yaml
│       ├── cost-service.yaml
│       ├── ai-service.yaml
│       └── frontend.yaml
│
└── jenkins/
    ├── Jenkinsfile.springboot
    ├── Jenkinsfile.react
    └── Jenkinsfile.fastapi
```

---

## 13. Verification & Testing Checklist

### Terraform Verification
```bash
# Format all Terraform files
terraform fmt -recursive infrastructure/terraform/

# Validate configuration syntax
terraform validate infrastructure/terraform/

# Preview changes (MUST VERIFY: 0 NAT Gateways, 2 EC2 instances, 30GB EBS total)
terraform plan -out=tfplan infrastructure/terraform/
```

### Kubernetes Cluster Verification
```bash
# Check all nodes are Ready
kubectl get nodes

# Expected output:
# NAME           STATUS   ROLES           AGE   VERSION
# ip-10-0-1-xx   Ready    control-plane   5m    v1.29.x
# ip-10-0-1-yy   Ready    <none>          3m    v1.29.x
```

### Stateful Workloads Verification
```bash
# Check all monitoring pods are Running
kubectl get pods -n monitoring

# Check PVCs are Bound (persistent volumes working)
kubectl get pvc -n monitoring

# Expected: STATUS = Bound for prometheus, grafana, mysql PVCs
```

### Microservices Verification
```bash
# Check all application pods are Running
kubectl get pods -n digitaltwin

# Test Auth Service via API Gateway
curl http://<Worker-Public-IP>:30088/api/v1/auth/health
# Expected: {"status": "UP"}
```

### Jenkins Pipeline Verification
- Trigger a manual build for `auth-service` and verify all 5 stages pass:
  `Checkout` → `Build JAR` → `Docker Build` → `ECR Push` → `K8s Deploy`

### Grafana Observability Verification
- Open `http://<Worker-Public-IP>:30300` in browser
- Log in with admin credentials
- Verify "Cluster Node Health" dashboard shows CPU/RAM metrics for both nodes
- Verify "Digital-Twin Microservices Health" dashboard shows HTTP request rates for all 6 Java services
