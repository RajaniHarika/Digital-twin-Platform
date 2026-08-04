export const mockDashboardData = {
  header: {
    welcomeMessage: "Welcome back, DevOps Engineer",
    clusterHealthBadge: "Healthy",
    clusterHealthScore: 98.4,
  },
  clusterHealth: {
    nodes: [
      { name: "Master Node", status: "Healthy", healthPercent: 100 },
      { name: "Worker Node 1", status: "Healthy", healthPercent: 95 },
      { name: "Worker Node 2", status: "Warning", healthPercent: 78 },
      { name: "Worker Node 3", status: "Healthy", healthPercent: 99 }
    ],
    components: [
      { name: "API Server", status: "Healthy", healthPercent: 100 },
      { name: "Scheduler", status: "Healthy", healthPercent: 100 },
      { name: "etcd", status: "Healthy", healthPercent: 100 },
      { name: "Controller Manager", status: "Healthy", healthPercent: 100 }
    ]
  },
  podStatus: {
    running: 432,
    pending: 12,
    failed: 3,
    crashLoopBackOff: 5,
    restartCount: 47
  },
  deployments: [
    { id: 1, name: "frontend-service", namespace: "prod", version: "v2.4.1", replicas: 5, available: 5, status: "Running", lastUpdated: "10 mins ago" },
    { id: 2, name: "payment-gateway", namespace: "prod", version: "v1.9.0", replicas: 3, available: 3, status: "Running", lastUpdated: "2 hours ago" },
    { id: 3, name: "user-auth", namespace: "prod", version: "v3.1.2", replicas: 4, available: 2, status: "Updating", lastUpdated: "Just now" },
    { id: 4, name: "inventory-worker", namespace: "staging", version: "v1.2.0", replicas: 2, available: 0, status: "Failed", lastUpdated: "5 mins ago" },
    { id: 5, name: "recommendation-engine", namespace: "prod", version: "v4.0.0", replicas: 8, available: 8, status: "Running", lastUpdated: "1 day ago" }
  ],
  jenkinsPipelines: [
    { id: 1, name: "payment-gateway-ci", stage: "Deploy to Prod", duration: "12m 45s", lastBuild: "#4532", successRate: 98, status: "Success" },
    { id: 2, name: "frontend-service-cd", stage: "E2E Testing", duration: "8m 10s", lastBuild: "#2109", successRate: 92, status: "Running" },
    { id: 3, name: "user-auth-hotfix", stage: "Unit Tests", duration: "1m 30s", lastBuild: "#890", successRate: 85, status: "Failed" },
    { id: 4, name: "data-pipeline-nightly", stage: "Queued", duration: "-", lastBuild: "#102", successRate: 99, status: "Queued" }
  ],
  dockerImages: [
    { id: 1, repository: "registry.gitlab.com/payment-gateway", tag: "v1.9.0", size: "245 MB", lastUpdated: "2 hours ago", securityScan: "Passed", vulnerabilities: 0, status: "Active" },
    { id: 2, repository: "registry.gitlab.com/frontend-service", tag: "v2.4.1", size: "112 MB", lastUpdated: "10 mins ago", securityScan: "Passed", vulnerabilities: 2, status: "Active" },
    { id: 3, repository: "registry.gitlab.com/user-auth", tag: "v3.1.2", size: "189 MB", lastUpdated: "1 hour ago", securityScan: "Warning", vulnerabilities: 15, status: "Active" },
    { id: 4, repository: "registry.gitlab.com/inventory-worker", tag: "v1.2.0", size: "320 MB", lastUpdated: "1 day ago", securityScan: "Failed", vulnerabilities: 42, status: "Deprecated" }
  ],
  prometheusMetrics: {
    cpu: [
      { time: '00:00', usage: 45 }, { time: '04:00', usage: 52 }, { time: '08:00', usage: 78 }, { time: '12:00', usage: 85 }, { time: '16:00', usage: 65 }, { time: '20:00', usage: 50 }
    ],
    memory: [
      { time: '00:00', usage: 60 }, { time: '04:00', usage: 62 }, { time: '08:00', usage: 70 }, { time: '12:00', usage: 82 }, { time: '16:00', usage: 75 }, { time: '20:00', usage: 65 }
    ],
    network: [
      { time: '00:00', in: 120, out: 80 }, { time: '04:00', in: 150, out: 95 }, { time: '08:00', in: 400, out: 250 }, { time: '12:00', in: 450, out: 300 }, { time: '16:00', in: 300, out: 200 }, { time: '20:00', in: 180, out: 110 }
    ]
  },
  grafanaMonitoring: {
    systemHealth: 92,
    nodeMetrics: "Stable",
    appMetrics: "Nominal",
    serviceAvailability: 99.98,
    latency: "45ms",
    errorRate: 0.02
  },
  alerts: [
    { id: 1, title: "High CPU Usage - Worker Node 2", timestamp: "5 mins ago", source: "Prometheus", severity: "Warning", status: "Active" },
    { id: 2, title: "Database Connection Failed", timestamp: "12 mins ago", source: "payment-gateway", severity: "Critical", status: "Active" },
    { id: 3, title: "Pod CrashLoopBackOff", timestamp: "25 mins ago", source: "inventory-worker", severity: "Critical", status: "Active" },
    { id: 4, title: "New Deployment Successful", timestamp: "1 hour ago", source: "frontend-service", severity: "Info", status: "Resolved" }
  ]
};
