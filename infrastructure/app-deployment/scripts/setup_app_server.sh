#!/bin/bash
set -euo pipefail
exec > >(tee /var/log/twindigital-app-setup.log) 2>&1

echo "─── [1/6] Updating System & Installing Base Dependencies ───"
apt-get update -y
apt-get install -y ca-certificates curl gnupg lsb-release git unzip wget nginx

echo "─── [2/6] Installing Docker & Docker Compose v2 ───"
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-compose-v2

systemctl start docker
systemctl enable docker
usermod -aG docker ubuntu

echo "─── [3/6] Installing Node.js 20 LTS ───"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "─── [4/6] Configuring Nginx for TwinDigital SPA & API Reverse Proxy ───"
cat << 'EOF' > /etc/nginx/sites-available/default
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root /var/www/html;
    index index.html index.htm;

    # Serve React SPA with HTML5 History API Routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy /api requests to API Gateway container on port 8090
    location /api/ {
        proxy_pass http://localhost:8090/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

systemctl restart nginx
systemctl enable nginx

echo "─── [5/6] Preparing Application Directory /opt/twindigital ───"
mkdir -p /opt/twindigital
chown -R ubuntu:ubuntu /opt/twindigital

echo "─── [6/6] Bootstrap Completed Successfully! ───"
echo "To deploy your app:"
echo "1. SSH into the server: ssh -i digitaltwin-app-key.pem ubuntu@<SERVER_IP>"
echo "2. Clone your repository into /opt/twindigital"
echo "3. Run 'docker-compose up -d' or 'npm run build' inside frontend/"
