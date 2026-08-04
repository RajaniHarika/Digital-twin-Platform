# FAKE DATA REFERENCE — Digital Twin Platform Dashboard
# Created: 2026-08-04
# Purpose: Track all fake/mock/static data and how to fix them
# ============================================================

## HOW TO USE THIS FILE
# Before starting any fix, check this file.
# After fixing something, mark it [DONE] with the date.
# Commit this file with each fix PR.

# ============================================================
# SECTION 1: QUICK FIXES (Code only, no infrastructure needed)
# ============================================================

[PENDING] FIX-001: ai-service still showing on live site
  - Cause: Backend Node.js server not restarted after deleting ai-service from store.js
  - Pages affected: Infrastructure Topology, Risk Analysis
  - Fix: SSH into App Server (13.202.39.151) and run: pm2 restart all

[PENDING] FIX-002: frontend row in Deployment table on Admin Dashboard
  - File: backend/src/routes/api.js, line 53
  - Fake: { id: d5, service: frontend, version: 1.0.0, status: success }
  - Fix: Delete that object. Frontend is Nginx, NOT in Kubernetes.

[PENDING] FIX-003: AI Service row in /health endpoint
  - File: backend/src/routes/api.js, line 66
  - Fake: { name: AI Service, status: healthy, uptime: 99.99 }
  - Fix: Delete that object.

[PENDING] FIX-004: activeServices hardcoded as 8
  - File: backend/src/routes/api.js, line 24: activeServices: 8
  - Fix: Change to 7 (our 7 real microservices).

# ============================================================
# SECTION 2: PROMETHEUS INTEGRATION (Main feature)
# ============================================================
# Prometheus is at: prometheus.monitoring.svc.cluster.local:9090 (inside k8s)
# STEP FIRST: Change Prometheus Service from ClusterIP to NodePort 30090
# Then backend calls: http://65.2.224.226:30090/api/v1/query?query=<PromQL>

[PENDING] FIX-005: CPU Usage on Admin Dashboard (always shows 72%)
  - File: backend/src/routes/api.js, line 29: cpuUsage: 72.4
  - Fix PromQL: avg(process_cpu_usage{namespace="digitaltwin"}) * 100

[PENDING] FIX-006: Memory Usage on Admin Dashboard (always shows 69%)
  - File: backend/src/routes/api.js, line 30: memoryUsage: 68.9
  - Fix PromQL: avg(jvm_memory_used_bytes{area="heap"} / jvm_memory_max_bytes{area="heap"}) * 100

[PENDING] FIX-007: CPU Utilization chart - random on every refresh
  - File: backend/src/routes/api.js, trendData() function lines 15-19
  - Fix: Prometheus range query - last 24h with 2h step
  - PromQL: avg(process_cpu_usage)[24h:2h]

[PENDING] FIX-008: Memory Utilization chart - random on every refresh
  - Same file as FIX-007
  - PromQL: avg(jvm_memory_used_bytes{area="heap"} / jvm_memory_max_bytes{area="heap"})[24h:2h]

[PENDING] FIX-009: Network I/O chart - random on every refresh
  - Same file as FIX-007
  - PromQL: rate(node_network_receive_bytes_total[2h]) — uses node-exporter

[PENDING] FIX-010: Topology page - per-service CPU% all hardcoded
  - File: backend/src/data/store.js, TOPOLOGY_NODES array
  - Fix PromQL per service: process_cpu_usage{job="api-gateway"} * 100
  - Apply to: api-gateway, auth-service, cluster-sync, topology-service,
              simulation-service, risk-service, cost-service

[PENDING] FIX-011: Topology page - per-service Memory% all hardcoded
  - Same as FIX-010
  - PromQL: jvm_memory_used_bytes{job="api-gateway",area="heap"} / jvm_memory_max_bytes{job="api-gateway",area="heap"} * 100

[PENDING] FIX-012: Topology page - per-service Latency all hardcoded
  - PromQL: rate(http_server_requests_seconds_sum{job="api-gateway"}[5m]) / rate(http_server_requests_seconds_count{job="api-gateway"}[5m]) * 1000

[PENDING] FIX-013: Topology page - service status always hardcoded as healthy
  - Fix PromQL: up{job="api-gateway"} => 1=healthy, 0=down
  - Map: 1 -> "healthy", 0 -> "down"

[PENDING] FIX-014: Risk Analysis - items not from real metrics
  - File: backend/src/data/store.js, RISK_ITEMS
  - Fix rules:
    * Memory risk: if jvm_memory_used > 400Mi for simulation-service
    * Single replica: check Kubernetes deployment.replicas == 1
    * MySQL backup: keep static (it is a valid compliance note)
    * Remove ai-service risk item (already deleted, needs server restart FIX-001)

[PENDING] FIX-015: Prediction page - all values hardcoded
  - File: backend/src/data/store.js, PREDICTIONS
  - Fix: Prometheus 7-day history + linear extrapolation
    * Current CPU: avg(process_cpu_usage) * 100
    * Predicted CPU (7d): current + (slope_from_last_7d * 7)
    * Current pods: count(kube_pod_info{namespace="digitaltwin"})
    * No ML needed - simple linear extrapolation is fine

# ============================================================
# SECTION 3: MICROSERVICE AND AWS API INTEGRATION
# ============================================================

[PENDING] FIX-016: Simulation page - all 5 simulations are fake
  - File: backend/src/data/store.js, SIMULATIONS
  - Fix: Call simulation-service REST API
    Internal URL: http://simulation-service.digitaltwin.svc.cluster.local:8084/api/simulations
    Add backend route: GET /api/simulations -> proxy to simulation-service

[PENDING] FIX-017: Cost Analysis - all cost numbers are hardcoded
  - File: backend/src/data/store.js, COST_BREAKDOWN
  - Fix: AWS Cost Explorer API
    aws ce get-cost-and-usage --granularity MONTHLY --group-by Type=DIMENSION,Key=SERVICE
  - IMPORTANT: Cache for 24h - API costs $0.01 per request

[PENDING] FIX-018: Audit History - all 5 events are fake
  - File: backend/src/data/store.js, HISTORY
  - Fix: Jenkins REST API for deployment events
    Jenkins: GET http://JENKINS_IP:8080/job/DigitalTwinPlatform/api/json

[PENDING] FIX-019: Jenkins Pipelines on dashboard - wrong names and build numbers
  - File: backend/src/data/store.js, JENKINS_PIPELINES
  - Fix: Jenkins REST API: GET http://JENKINS_IP:8080/job/<job>/lastBuild/api/json

# ============================================================
# SECTION 4: ACCEPTABLE TO KEEP STATIC
# ============================================================

[STATIC-OK] Cost Optimization recommendations (Right-size, Reserved Instances, S3 Lifecycle)
  Reason: Architecture advice, not live metrics. Fine to keep static.

[STATIC-OK] System Health Radar on Simulation page
  Reason: Visual summary. OK if overall risk score (FIX-014) becomes real.

[STATIC-OK] Confidence percentages on Prediction (91%, 87%, 83%, 79%)
  Reason: Fine to keep as long as current/predicted values (FIX-015) are real.

# ============================================================
# SECTION 5: IMPLEMENTATION ORDER
# ============================================================

PHASE 1 - Immediate (no new infrastructure):
  FIX-001 -> Restart backend server
  FIX-002 -> Remove frontend from deployment table
  FIX-003 -> Remove AI Service from health endpoint
  FIX-004 -> Fix activeServices count to 7

PHASE 2 - Prometheus Integration:
  Step 1: Change prometheus-statefulset.yaml Service type from ClusterIP -> NodePort 30090
  Step 2: Add new backend route GET /api/metrics/live that queries Prometheus
  FIX-005, FIX-006 -> Real CPU/Memory on Admin Dashboard header
  FIX-007, FIX-008, FIX-009 -> Real Charts
  FIX-010, FIX-011, FIX-012, FIX-013 -> Real Topology metrics per service
  FIX-014 -> Real Risk items from Prometheus thresholds
  FIX-015 -> Real Predictions from Prometheus 7-day trend

PHASE 3 - External APIs:
  FIX-016 -> Real Simulations from simulation-service
  FIX-017 -> Real Cost from AWS Cost Explorer (24h cached)
  FIX-018 -> Real Audit History from Jenkins + simulation-service
  FIX-019 -> Real Jenkins pipelines from Jenkins API

# ============================================================
# KEY REFERENCE INFO
# ============================================================

App Server IP:          13.202.39.151  (frontend + backend Node.js)
K8s Master IP:          65.2.224.226
Prometheus (NodePort):  http://65.2.224.226:30090  (AFTER Phase 2 Step 1)
Prometheus (internal):  http://prometheus.monitoring.svc.cluster.local:9090
API Gateway (internal): http://api-gateway.digitaltwin.svc.cluster.local:8080
Simulation (internal):  http://simulation-service.digitaltwin.svc.cluster.local:8084
K8s namespace:          digitaltwin
Monitoring namespace:   monitoring
AWS Region:             ap-south-1
AWS Account:            790304249797
