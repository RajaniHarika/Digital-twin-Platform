// Mock data for the DevOps Engineer Dashboard
// This can be easily replaced by backend APIs later.

export const mockDashboardData = {
  header: {
    welcomeMessage: "Welcome back, DevOps Admin. Cluster console is active.",
    clusterHealthBadge: "Healthy",
    clusterHealthScore: 98.4,
  },

  kpis: [
    {
      id: "cluster-health",
      title: "Kubernetes Cluster Health",
      value: "98.4%",
      description: "Overall cluster health index",
      trend: "up",
      trendValue: "+0.5%",
      color: "success",
    },
    {
      id: "running-pods",
      title: "Running Pods",
      value: "156",
      description: "Across all namespaces",
      trend: "up",
      trendValue: "+12",
      color: "info",
    },
    {
      id: "active-deployments",
      title: "Active Deployments",
      value: "42",
      description: "Production releases",
      trend: "stable",
      trendValue: "0",
      color: "primary",
    },
    {
      id: "jenkins-pipelines",
      title: "Jenkins Pipelines",
      value: "12 / 15",
      description: "Pipelines successfully built",
      trend: "up",
      trendValue: "+2",
      color: "success",
    },
    {
      id: "critical-alerts",
      title: "Critical Alerts",
      value: "2",
      description: "Requires immediate attention",
      trend: "down",
      trendValue: "-3",
      color: "error",
    },
    {
      id: "cpu-utilization",
      title: "CPU Utilization",
      value: "72.4%",
      description: "Cluster-wide average",
      trend: "up",
      trendValue: "+5.2%",
      color: "warning",
    },
  ],

  clusterHealthComponents: [
    { name: "Master Node", health: 100, status: "healthy" },
    { name: "Worker Nodes (x12)", health: 96.8, status: "healthy" },
    { name: "API Server", health: 100, status: "healthy" },
    { name: "Scheduler", health: 100, status: "healthy" },
    { name: "etcd", health: 99.9, status: "healthy" },
    { name: "Controller Manager", health: 95.0, status: "warning" },
  ],

  podStatus: {
    running: 132,
    pending: 15,
    failed: 3,
    crashLoopBackOff: 6,
    restartCount: 14,
    total: 156,
  },

  deployments: [
    { id: "dep-1", name: "auth-service", namespace: "security", version: "v2.1.0", replicas: "3/3", status: "success", lastUpdated: "5 mins ago" },
    { id: "dep-2", name: "payment-service", namespace: "finance", version: "v1.8.5", replicas: "2/2", status: "success", lastUpdated: "12 mins ago" },
    { id: "dep-3", name: "notification-worker", namespace: "core", version: "v4.0.1", replicas: "1/2", status: "failed", lastUpdated: "1 hour ago" },
    { id: "dep-4", name: "user-portal", namespace: "frontend", version: "v3.2.0", replicas: "5/5", status: "success", lastUpdated: "2 hours ago" },
    { id: "dep-5", name: "order-processor", namespace: "core", version: "v2.4.1", replicas: "3/4", status: "running", lastUpdated: "Just now" },
  ],

  jenkinsPipelines: [
    { id: "pip-1", name: "Auth Service CI/CD", stage: "Deploy to Prod", duration: "4m 32s", successRate: 98, status: "success" },
    { id: "pip-2", name: "Payment Gateway Build", stage: "Running Tests", duration: "2m 15s", successRate: 92, status: "running" },
    { id: "pip-3", name: "Notification Engine", stage: "Docker Publish", duration: "1m 45s", successRate: 85, status: "failed" },
    { id: "pip-4", name: "Core DB Migration", stage: "Completed", duration: "8m 10s", successRate: 100, status: "success" },
  ],

  dockerImages: [
    { id: "img-1", repository: "digitaltwin/auth-service", tag: "v2.1.0-release", size: "184 MB", securityScan: "Passed", lastUpdated: "3 days ago" },
    { id: "img-2", repository: "digitaltwin/payment-gateway", tag: "v1.8.5-alpine", size: "212 MB", securityScan: "1 Low Vulnerability", lastUpdated: "2 weeks ago" },
    { id: "img-3", repository: "digitaltwin/notification-worker", tag: "v4.0.1-dev", size: "320 MB", securityScan: "2 High, 4 Medium", lastUpdated: "1 day ago" },
    { id: "img-4", repository: "digitaltwin/order-processor", tag: "latest", size: "196 MB", securityScan: "Passed", lastUpdated: "10 hours ago" },
  ],

  prometheusMetrics: [
    { time: "14:00", cpu: 55, memory: 62, disk: 41, network: 420 },
    { time: "14:05", cpu: 62, memory: 64, disk: 41, network: 480 },
    { time: "14:10", cpu: 74, memory: 68, disk: 42, network: 650 },
    { time: "14:15", cpu: 68, memory: 69, disk: 42, network: 590 },
    { time: "14:20", cpu: 85, memory: 72, disk: 42, network: 880 },
    { time: "14:25", cpu: 72, memory: 70, disk: 42, network: 720 },
    { time: "14:30", cpu: 65, memory: 68, disk: 42, network: 610 },
  ],

  grafanaMonitoring: {
    systemHealth: [
      { name: "Node 1", val: 88 },
      { name: "Node 2", val: 94 },
      { name: "Node 3", val: 78 },
      { name: "Node 4", val: 96 },
    ],
    nodeMetrics: [
      { time: "0", load: 2.1, pods: 14 },
      { time: "1", load: 2.5, pods: 16 },
      { time: "2", load: 3.2, pods: 19 },
      { time: "3", load: 2.9, pods: 18 },
      { time: "4", load: 2.2, pods: 15 },
    ],
    appMetrics: [
      { time: "14:00", req: 1200, err: 2 },
      { time: "14:05", req: 1450, err: 4 },
      { time: "14:10", req: 1890, err: 25 },
      { time: "14:15", req: 1600, err: 5 },
      { time: "14:20", req: 2100, err: 3 },
    ]
  },

  alerts: [
    { id: "al-1", severity: "critical", title: "Node 3 Disk Space Low", message: "Disk usage on Node 3 has exceeded 90%.", time: "2 mins ago" },
    { id: "al-2", severity: "critical", title: "CrashLoopBackOff", message: "Pod notification-worker-7c45bd6d-9z2v is crashing repeatedly.", time: "8 mins ago" },
    { id: "al-3", severity: "warning", title: "API Server Latency High", message: "API Server request latency average is 520ms (Threshold: 500ms).", time: "15 mins ago" },
    { id: "al-4", severity: "info", title: "Deployment Completed", message: "Deployment user-portal v3.2.0 succeeded.", time: "2 hours ago" },
  ],

  activityTimeline: [
    { id: "act-1", type: "deployment", title: "Deployment success", desc: "auth-service successfully updated to v2.1.0 in 'security' namespace.", time: "5 mins ago" },
    { id: "act-2", type: "alert", title: "Critical Alert triggered", desc: "Pod notification-worker-7c45bd6d-9z2v entered CrashLoopBackOff state.", time: "8 mins ago" },
    { id: "act-3", type: "restart", title: "Container Restarted", desc: "Kubelet restarted pod payment-service-67fb987-df84 in namespace 'finance'.", time: "25 mins ago" },
    { id: "act-4", type: "simulation", title: "Simulation finished", desc: "Load simulation 'Order service scale test' completed with a Risk Score of 23%.", time: "1 hour ago" },
  ]
};
