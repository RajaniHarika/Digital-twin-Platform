export const USERS = [
  {
    id: '1',
    email: 'admin@digitaltwin.com',
    password: 'admin123',
    role: 'Admin',
    name: 'System Admin',
  },
  {
    id: '2',
    email: 'devops@digitaltwin.com',
    password: 'devops123',
    role: 'DevOps Engineer',
    name: 'DevOps Lead',
  },
  {
    id: '3',
    email: 'cloud@digitaltwin.com',
    password: 'cloud123',
    role: 'Cloud Engineer',
    name: 'Cloud Architect',
  },
  {
    id: '4',
    email: 'backend@digitaltwin.com',
    password: 'backend123',
    role: 'Backend Engineer',
    name: 'Backend Dev',
  },
  {
    id: '5',
    email: 'sre@digitaltwin.com',
    password: 'sre123',
    role: 'Site Reliability Engineer (SRE)',
    name: 'SRE Lead',
  },
  {
    id: '6',
    email: 'manager@digitaltwin.com',
    password: 'manager123',
    role: 'Project Manager',
    name: 'Project Manager',
  },
];

export const K8S_NODES = [
  { id: 'node-1', name: 'worker-ap-south-1a', status: 'Ready', cpu: 72, memory: 68, pods: 24, zone: 'ap-south-1a' },
  { id: 'node-2', name: 'worker-ap-south-1b', status: 'Ready', cpu: 58, memory: 61, pods: 19, zone: 'ap-south-1b' },
  { id: 'node-3', name: 'master-ap-south-1a', status: 'Ready', cpu: 41, memory: 52, pods: 8, zone: 'ap-south-1a' },
];

export const TOPOLOGY_NODES = [
  { id: 'api-gateway', type: 'gateway', label: 'API Gateway', status: 'healthy', cpu: 45.2, memory: 52.8, latency: 12, position: { x: 400, y: 40 } },
  { id: 'auth-service', type: 'service', label: 'Auth Service', status: 'healthy', cpu: 28.4, memory: 41.2, latency: 18, position: { x: 150, y: 140 } },
  { id: 'cluster-sync', type: 'service', label: 'Cluster Sync', status: 'healthy', cpu: 35.1, memory: 48.6, latency: 22, position: { x: 400, y: 140 } },
  { id: 'topology-service', type: 'service', label: 'Topology Service', status: 'healthy', cpu: 31.8, memory: 44.3, latency: 19, position: { x: 650, y: 140 } },
  { id: 'simulation-service', type: 'service', label: 'Simulation Service', status: 'warning', cpu: 68.4, memory: 71.2, latency: 35, position: { x: 150, y: 280 } },
  { id: 'risk-service', type: 'service', label: 'Risk Service', status: 'healthy', cpu: 42.6, memory: 46.8, latency: 24, position: { x: 400, y: 280 } },
  { id: 'cost-service', type: 'service', label: 'Cost Service', status: 'healthy', cpu: 38.2, memory: 43.1, latency: 21, position: { x: 650, y: 280 } },
  { id: 'mysql', type: 'database', label: 'MySQL Cluster', status: 'healthy', cpu: 33.5, memory: 74.1, latency: 8, position: { x: 150, y: 420 } },
  { id: 'prometheus', type: 'monitoring', label: 'Prometheus', status: 'healthy', cpu: 22.1, memory: 38.4, latency: 5, position: { x: 650, y: 420 } },
];

export const TOPOLOGY_EDGES = [
  { id: 'e1', source: 'api-gateway', target: 'auth-service' },
  { id: 'e2', source: 'api-gateway', target: 'cluster-sync' },
  { id: 'e3', source: 'api-gateway', target: 'topology-service' },
  { id: 'e4', source: 'api-gateway', target: 'simulation-service' },
  { id: 'e5', source: 'api-gateway', target: 'risk-service' },
  { id: 'e6', source: 'api-gateway', target: 'cost-service' },
  { id: 'e10', source: 'auth-service', target: 'mysql' },
  { id: 'e11', source: 'cluster-sync', target: 'prometheus' },
  { id: 'e12', source: 'topology-service', target: 'prometheus' },
];

export const SIMULATIONS = [
  { id: 'sim-001', name: 'Payment Service Scale 3→5', status: 'completed', duration: 45, timestamp: '2026-07-30T10:30:00Z', riskScore: 23, impact: 'Low', costDelta: 120 },
  { id: 'sim-002', name: 'Node Failure — worker-1a', status: 'running', duration: null, timestamp: '2026-07-30T11:15:00Z', riskScore: null, impact: 'High', costDelta: 0 },
  { id: 'sim-003', name: 'Ingress Traffic Spike 3x', status: 'completed', duration: 90, timestamp: '2026-07-30T09:45:00Z', riskScore: 45, impact: 'Medium', costDelta: 340 },
  { id: 'sim-004', name: 'MySQL Failover Test', status: 'completed', duration: 30, timestamp: '2026-07-30T08:00:00Z', riskScore: 12, impact: 'Low', costDelta: 0 },
  { id: 'sim-005', name: 'API Gateway Stress 10k RPS', status: 'failed', duration: 60, timestamp: '2026-07-30T07:30:00Z', riskScore: 87, impact: 'Critical', costDelta: 890 },
];

export const RISK_ITEMS = [
  { id: 'r1', service: 'simulation-service', severity: 'high', score: 78, title: 'Memory pressure during scale events', recommendation: 'Increase memory limits to 512Mi' },
  { id: 'r2', service: 'api-gateway', severity: 'medium', score: 52, title: 'Single replica deployment', recommendation: 'Scale to minimum 2 replicas for HA' },
  { id: 'r3', service: 'mysql', severity: 'low', score: 24, title: 'Backup retention below policy', recommendation: 'Extend backup retention to 30 days' },
];

export const COST_BREAKDOWN = [
  { service: 'EC2 Compute', monthly: 18420, trend: 4.2, category: 'compute' },
  { service: 'EBS Storage', monthly: 3280, trend: -1.1, category: 'storage' },
  { service: 'Data Transfer', monthly: 5640, trend: 8.7, category: 'network' },
  { service: 'ECR Registry', monthly: 890, trend: 2.3, category: 'registry' },
  { service: 'Load Balancer', monthly: 1240, trend: 0.5, category: 'network' },
  { service: 'CloudWatch', monthly: 680, trend: 1.8, category: 'monitoring' },
];

export const PREDICTIONS = [
  { id: 'p1', metric: 'CPU Utilization', current: 72.4, predicted: 84.2, horizon: '7 days', confidence: 0.91 },
  { id: 'p2', metric: 'Monthly Cost', current: 30150, predicted: 33480, horizon: '30 days', confidence: 0.87 },
  { id: 'p3', metric: 'Pod Count', current: 156, predicted: 189, horizon: '14 days', confidence: 0.83 },
  { id: 'p4', metric: 'Failure Probability', current: 0.12, predicted: 0.08, horizon: '7 days', confidence: 0.79 },
];

export const HISTORY = [
  { id: 'h1', type: 'deployment', action: 'Deployed auth-service v1.2.0', user: 'devops@digitaltwin.com', timestamp: '2026-07-30T09:00:00Z', status: 'success' },
  { id: 'h2', type: 'simulation', action: 'Ran node failure simulation', user: 'sre@digitaltwin.com', timestamp: '2026-07-30T08:30:00Z', status: 'completed' },
  { id: 'h3', type: 'risk', action: 'Risk assessment triggered', user: 'cloud@digitaltwin.com', timestamp: '2026-07-29T16:45:00Z', status: 'warning' },
  { id: 'h4', type: 'cost', action: 'Cost forecast updated', user: 'manager@digitaltwin.com', timestamp: '2026-07-29T14:20:00Z', status: 'info' },
  { id: 'h5', type: 'topology', action: 'Cluster sync completed', user: 'backend@digitaltwin.com', timestamp: '2026-07-29T11:10:00Z', status: 'success' },
];

export const JENKINS_PIPELINES = [
  { id: 1, name: 'auth-service-ci', stage: 'Deploy to Prod', duration: '9m 20s', lastBuild: '#1284', successRate: 97, status: 'Success' },
  { id: 2, name: 'api-gateway-cd', stage: 'Integration Tests', duration: '6m 45s', lastBuild: '#892', successRate: 94, status: 'Running' },
  { id: 3, name: 'topology-service-build', stage: 'Unit Tests', duration: '4m 10s', lastBuild: '#456', successRate: 91, status: 'Success' },
  { id: 4, name: 'simulation-service-nightly', stage: 'Queued', duration: '-', lastBuild: '#203', successRate: 88, status: 'Queued' },
];

export const DOCKER_IMAGES = [
  { id: 1, repository: 'registry.digitaltwin.com/auth-service', tag: '1.2.0', size: '198 MB', lastUpdated: '3 hours ago', securityScan: 'Passed', vulnerabilities: 0, status: 'Active' },
  { id: 2, repository: 'registry.digitaltwin.com/api-gateway', tag: '3.0.1', size: '176 MB', lastUpdated: '1 day ago', securityScan: 'Passed', vulnerabilities: 1, status: 'Active' },
  { id: 3, repository: 'registry.digitaltwin.com/topology-service', tag: '2.1.0', size: '214 MB', lastUpdated: '6 hours ago', securityScan: 'Warning', vulnerabilities: 8, status: 'Active' },
  { id: 4, repository: 'registry.digitaltwin.com/simulation-service', tag: '1.0.3', size: '289 MB', lastUpdated: '2 days ago', securityScan: 'Passed', vulnerabilities: 3, status: 'Active' },
];
