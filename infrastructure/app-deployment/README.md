# TwinDigital Application Deployment (AWS EC2 & Nginx/Docker)

This directory provides a **dedicated, self-contained Terraform configuration** to deploy the **TwinDigital DevOps Platform** (Frontend & Full Stack) onto an AWS EC2 instance in `ap-south-1` (Mumbai).

---

## 🏗️ What This Provisions

- **VPC & Networking:** Dedicated VPC (`10.10.0.0/16`), Internet Gateway, and Public Subnet (`10.10.1.0/24`).
- **Security Group (`twindigital-prod-app-sg`):**
  - **Port 80 (HTTP):** Open to the internet for browser access (`0.0.0.0/0`).
  - **Port 443 (HTTPS):** Open for secure SSL traffic (`0.0.0.0/0`).
  - **Port 8090 (API Gateway):** Direct API access (`0.0.0.0/0`).
  - **Port 22 (SSH):** Secure management access.
- **SSH Key Pair:** Automatically generates a 4096-bit RSA SSH key and saves it locally as `scripts/digitaltwin-app-key.pem`.
- **Application EC2 Server (`t3.medium`):** Ubuntu 22.04 LTS instance pre-bootstrapped with:
  - **Docker & Docker Compose v2**
  - **Node.js 20 LTS**
  - **Nginx Web Server** (preconfigured with SPA routing and `/api` reverse proxy to port `8090`).

---

## 🚀 Quick Start Deployment

### 1. Initialize & Apply Terraform

Make sure your AWS CLI credentials are configured (`aws configure`), then run:

```bash
cd infrastructure/app-deployment
terraform init
terraform apply -auto-approve
```

At the end of `terraform apply`, you will see outputs like:

```hcl
app_server_public_ip = "13.234.xx.xx"
application_url      = "http://13.234.xx.xx"
ssh_command          = "ssh -i scripts/digitaltwin-app-key.pem ubuntu@13.234.xx.xx"
```

---

### 2. Connect & Deploy Your Code

#### Using Docker Compose (Full Stack)

1. SSH into the deployed EC2 server using the output command:
   ```bash
   ssh -i scripts/digitaltwin-app-key.pem ubuntu@<app_server_public_ip>
   ```
2. Clone your repository into `/opt/twindigital`:
   ```bash
   cd /opt/twindigital
   git clone https://github.com/RajaniHarika/Digital-twin-Platform.git .
   git checkout develop
   ```
3. Launch the full platform with Docker Compose:
   ```bash
   docker-compose up -d --build
   ```

#### Or Using Native Nginx (Frontend Only)

If deploying only the React frontend to Nginx:

```bash
cd /opt/twindigital/frontend
npm install && npm run build
sudo cp -r dist/* /var/www/html/
sudo systemctl restart nginx
```

---

## 🧹 Cleaning Up / Destroying Infrastructure

To delete all AWS resources created by this module:

```bash
terraform destroy -auto-approve
```
