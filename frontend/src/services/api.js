import axios from 'axios';
import { mockDashboardData } from '../features/dashboard/mockData';
import { cloudMockData } from '../data/cloudMockData';
import { getApiBaseUrl } from './config';
import authService from './auth';
import { getRelativeTime } from '../utils/formatters';

const getAuthToken = () => localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      authService.logout();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Helper ──────────────────────────────────────────────────────────
export const mockDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const mapAlerts = (alerts) =>
  (alerts || []).map((a, i) => ({
    id: a.id || String(i),
    title: a.title,
    timestamp: getRelativeTime(a.timestamp),
    source: a.message?.split(' ')[0] || 'System',
    message: a.message || a.title,
    severity: a.severity === 'critical' ? 'Critical' : a.severity === 'warning' ? 'Warning' : 'Info',
    status: a.acknowledged ? 'Resolved' : 'Active',
  }));

const mapDeploymentStatus = (status) => {
  if (status === 'success') return 'Running';
  if (status === 'failed') return 'Failed';
  if (status === 'running') return 'Running';
  return 'Warning';
};

const buildDashboardData = (metrics, health, alerts, deployments, nodes, pipelines, dockerImages) => {
  const criticalCount = (alerts || []).filter((a) => a.severity === 'critical' && !a.acknowledged).length;
  const serviceUptime =
    health.services?.length > 0
      ? health.services.reduce((sum, s) => sum + s.uptime, 0) / health.services.length
      : 99.5;

  return {
    header: {
      welcomeMessage: `Welcome back, ${authService.getCurrentUser()?.name || 'Engineer'}`,
      clusterHealthBadge: health.overall === 'healthy' ? 'Healthy' : 'Degraded',
      clusterHealthScore: Math.round(serviceUptime * 10) / 10,
    },
    clusterHealth: {
      nodes: (nodes || []).map((n) => ({
        name: n.name,
        status: n.status === 'Ready' ? 'Healthy' : 'Warning',
        healthPercent: Math.max(0, Math.min(100, 100 - Math.round((n.cpu || 0) * 0.35))),
      })),
      components: (health.services || []).slice(0, 6).map((s) => ({
        name: s.name,
        status: s.status === 'healthy' ? 'Healthy' : 'Warning',
        healthPercent: Math.round(s.uptime),
      })),
    },
    podStatus: {
      running: metrics.runningPods ?? mockDashboardData.podStatus.running,
      pending: metrics.pendingPods ?? mockDashboardData.podStatus.pending,
      failed: criticalCount,
      crashLoopBackOff: metrics.crashLoopBackOff ?? mockDashboardData.podStatus.crashLoopBackOff,
      restartCount: metrics.restartCount ?? mockDashboardData.podStatus.restartCount,
    },
    deployments: (deployments || []).map((d, i) => ({
      id: d.id || i,
      name: d.service,
      namespace: 'digital-twin',
      version: d.version,
      replicas: 2,
      available: d.status === 'success' ? 2 : d.status === 'failed' ? 0 : 1,
      status: mapDeploymentStatus(d.status),
      lastUpdated: getRelativeTime(d.timestamp),
    })),
    jenkinsPipelines: pipelines?.length ? pipelines : mockDashboardData.jenkinsPipelines,
    dockerImages: dockerImages?.length ? dockerImages : mockDashboardData.dockerImages,
    prometheusMetrics: {
      cpu: (metrics.trends?.cpu || mockDashboardData.prometheusMetrics.cpu).map((p) => ({
        time: p.name || p.time,
        usage: p.value ?? p.usage,
      })),
      memory: (metrics.trends?.memory || mockDashboardData.prometheusMetrics.memory).map((p) => ({
        time: p.name || p.time,
        usage: p.value ?? p.usage,
      })),
      network: (metrics.trends?.network || mockDashboardData.prometheusMetrics.network).map((p) => ({
        time: p.name || p.time,
        in: p.value ?? p.in,
        out: p.out ?? Math.round((p.value ?? p.in ?? 0) * 0.6),
      })),
    },
    grafanaMonitoring: {
      systemHealth: Math.round(100 - (metrics.riskScore || 20)),
      nodeMetrics: 'Stable',
      appMetrics: 'Nominal',
      serviceAvailability: Math.round(serviceUptime * 100) / 100,
      latency: `${Math.round(20 + (metrics.cpuUsage || 50) * 0.2)}ms`,
      errorRate: metrics.riskScore ? (metrics.riskScore / 1000).toFixed(2) : mockDashboardData.grafanaMonitoring.errorRate,
    },
    alerts: mapAlerts(alerts),
    kpi: metrics,
  };
};

const mergeWithMockFallback = (data) => ({
  ...mockDashboardData,
  ...data,
  header: { ...mockDashboardData.header, ...data.header },
  clusterHealth: {
    nodes: data.clusterHealth?.nodes?.length ? data.clusterHealth.nodes : mockDashboardData.clusterHealth.nodes,
    components: data.clusterHealth?.components?.length ? data.clusterHealth.components : mockDashboardData.clusterHealth.components,
  },
  podStatus: { ...mockDashboardData.podStatus, ...data.podStatus },
  prometheusMetrics: {
    cpu: data.prometheusMetrics?.cpu?.length ? data.prometheusMetrics.cpu : mockDashboardData.prometheusMetrics.cpu,
    memory: data.prometheusMetrics?.memory?.length ? data.prometheusMetrics.memory : mockDashboardData.prometheusMetrics.memory,
    network: data.prometheusMetrics?.network?.length ? data.prometheusMetrics.network : mockDashboardData.prometheusMetrics.network,
  },
  grafanaMonitoring: { ...mockDashboardData.grafanaMonitoring, ...data.grafanaMonitoring },
  alerts: data.alerts?.length ? data.alerts : mockDashboardData.alerts,
  deployments: data.deployments?.length ? data.deployments : mockDashboardData.deployments,
  jenkinsPipelines: data.jenkinsPipelines?.length ? data.jenkinsPipelines : mockDashboardData.jenkinsPipelines,
  dockerImages: data.dockerImages?.length ? data.dockerImages : mockDashboardData.dockerImages,
});

export const buildCloudDashboardData = (metrics, cost, nodes) => {
  const breakdown = cost?.breakdown || [];
  const colors = ['#C7FF3A', '#94C600', '#22C55E', '#565656', '#F59E0B'];
  return {
    header: {
      title: 'Cloud Engineer Dashboard',
      provider: 'AWS',
      region: 'ap-south-1',
    },
    kpis: {
      totalInstances: nodes?.length ? nodes.length * 48 : cloudMockData.kpis.totalInstances,
      monthlySpend: cost?.total ?? metrics?.monthlyCost ?? cloudMockData.kpis.monthlySpend,
      costTrend: '+4.8%',
      totalStorage: '125 TB',
      storageTrend: '+2.1%',
      activeNodes: nodes?.filter((n) => n.status === 'Ready').length ?? cloudMockData.kpis.activeNodes,
    },
    resourceUtilization: {
      cpu: Math.round(metrics?.cpuUsage ?? cloudMockData.resourceUtilization.cpu),
      memory: Math.round(metrics?.memoryUsage ?? cloudMockData.resourceUtilization.memory),
      disk: cloudMockData.resourceUtilization.disk,
      network: Math.min(100, Math.round((metrics?.networkTraffic ?? 500) / 10)),
    },
    nodeCapacity: (nodes || []).map((n) => ({
      id: n.name,
      state: n.cpu > 80 ? 'warning' : 'running',
      cpu: n.cpu,
      memory: n.memory,
      storage: Math.round(n.memory * 0.6),
      network: Math.round(n.cpu * 0.5),
    })),
    costAnalysis: breakdown.map((item, i) => ({
      name: item.service,
      value: item.monthly,
      color: colors[i % colors.length],
    })),
    storageUsage: cloudMockData.storageUsage,
    networkTraffic: (metrics?.trends?.network || cloudMockData.networkTraffic).map((p, i) => ({
      time: p.name || p.time || cloudMockData.networkTraffic[i]?.time,
      inbound: p.value ?? p.in ?? 450,
      outbound: Math.round((p.value ?? p.in ?? 450) * 0.65),
    })),
  };
};

// ─── Simulation API (Real Backend) ──────────────────────────────────
export const simulationApi = {
  getAll: async () => {
    try {
      const response = await api.get('/api/v1/simulations');
      return response;
    } catch {
      // Fallback to mock if backend is not running
      await mockDelay();
      return {
        data: [
          { id: 1, name: 'Payment Service Scaling', type: 'SCALE_UP', status: 'COMPLETED', duration: 45, riskScore: 23, createdAt: '2026-07-08T10:30:00Z' },
          { id: 2, name: 'User Service Load Test', type: 'LOAD_TEST', status: 'RUNNING', duration: null, riskScore: null, createdAt: '2026-07-08T11:15:00Z' },
          { id: 3, name: 'Order Service Migration', type: 'MIGRATION', status: 'COMPLETED', duration: 120, riskScore: 45, createdAt: '2026-07-08T09:45:00Z' },
          { id: 4, name: 'Database Failover Test', type: 'FAILOVER', status: 'COMPLETED', duration: 30, riskScore: 12, createdAt: '2026-07-08T08:00:00Z' },
          { id: 5, name: 'API Gateway Stress Test', type: 'LOAD_TEST', status: 'FAILED', duration: 60, riskScore: 87, createdAt: '2026-07-08T07:30:00Z' },
        ],
      };
    }
  },
  getById: (id) => api.get(`/api/v1/simulations/${id}`),
  create: (data) => api.post('/api/v1/simulations', data),
  update: (id, data) => api.put(`/api/v1/simulations/${id}`, data),
  delete: (id) => api.delete(`/api/v1/simulations/${id}`),
};

// ─── Risk API (Real Backend) ────────────────────────────────────────
export const riskApi = {
  getAll: async () => {
    try {
      const response = await api.get('/api/v1/risks');
      return response;
    } catch {
      await mockDelay();
      return {
        data: [
          { id: 1, riskName: 'Database Connection Pool Exhaustion', severity: 'CRITICAL', category: 'INFRASTRUCTURE', likelihood: 85, impact: 95, status: 'OPEN', description: 'Connection pool reaching maximum capacity during peak hours' },
          { id: 2, riskName: 'API Rate Limit Breach', severity: 'HIGH', category: 'PERFORMANCE', likelihood: 72, impact: 60, status: 'MITIGATED', description: 'Third-party API rate limits being approached' },
          { id: 3, riskName: 'SSL Certificate Expiry', severity: 'MEDIUM', category: 'SECURITY', likelihood: 100, impact: 90, status: 'OPEN', description: 'SSL certificates expiring within 30 days' },
          { id: 4, riskName: 'Memory Leak in Order Service', severity: 'HIGH', category: 'APPLICATION', likelihood: 65, impact: 70, status: 'INVESTIGATING', description: 'Gradual memory increase detected in production' },
          { id: 5, riskName: 'Network Latency Spike', severity: 'LOW', category: 'NETWORK', likelihood: 30, impact: 40, status: 'RESOLVED', description: 'Intermittent latency spikes between availability zones' },
        ],
      };
    }
  },
  getById: (id) => api.get(`/api/v1/risks/${id}`),
  create: (data) => api.post('/api/v1/risks', data),
  update: (id, data) => api.put(`/api/v1/risks/${id}`, data),
  delete: (id) => api.delete(`/api/v1/risks/${id}`),
};

// ─── Cost API (Real Backend) ────────────────────────────────────────
export const costApi = {
  getAll: async () => {
    try {
      const response = await api.get('/api/costs');
      return response;
    } catch {
      await mockDelay();
      return {
        data: [
          { id: 1, resourceName: 'EKS Cluster (prod)', resourceType: 'COMPUTE', monthlyCost: 12450.00, status: 'ACTIVE', region: 'us-east-1', tags: 'production' },
          { id: 2, resourceName: 'RDS PostgreSQL (primary)', resourceType: 'DATABASE', monthlyCost: 8900.00, status: 'ACTIVE', region: 'us-east-1', tags: 'production' },
          { id: 3, resourceName: 'S3 Bucket (logs)', resourceType: 'STORAGE', monthlyCost: 2340.00, status: 'ACTIVE', region: 'us-east-1', tags: 'logging' },
          { id: 4, resourceName: 'CloudFront CDN', resourceType: 'NETWORK', monthlyCost: 4560.00, status: 'ACTIVE', region: 'global', tags: 'cdn' },
          { id: 5, resourceName: 'Lambda Functions', resourceType: 'COMPUTE', monthlyCost: 1280.00, status: 'ACTIVE', region: 'us-east-1', tags: 'serverless' },
        ],
      };
    }
  },
  getById: (id) => api.get(`/api/costs/${id}`),
  create: (data) => api.post('/api/costs', data),
  update: (id, data) => api.put(`/api/costs/${id}`, data),
  delete: (id) => api.delete(`/api/costs/${id}`),
  getSummary: async () => {
    try {
      return await api.get('/api/costs/summary');
    } catch {
      await mockDelay();
      return { data: { totalMonthlyCost: 45678.00, totalResources: 23, averageCostPerResource: 1986.00, costTrend: -5.2 } };
    }
  },
  getTotal: () => api.get('/api/costs/total'),
  getByType: (type) => api.get(`/api/costs/by-type/${type}`),
  getByRegion: (region) => api.get(`/api/costs/by-region/${region}`),
};

// ─── Topology API (Real Backend) ────────────────────────────────────
export const topologyApi = {
  getNodes: async () => {
    try {
      const response = await api.get('/api/v1/topology/nodes');
      return response;
    } catch {
      await mockDelay();
      return {
        data: [
          { id: 'api-gateway', type: 'gateway', label: 'API Gateway', status: 'healthy', cpu: 45.2, memory: 52.8, latency: 12, position: { x: 250, y: 50 } },
          { id: 'user-service', type: 'service', label: 'User Service', status: 'healthy', cpu: 38.6, memory: 48.2, latency: 28, position: { x: 250, y: 150 } },
          { id: 'order-service', type: 'service', label: 'Order Service', status: 'warning', cpu: 72.4, memory: 68.9, latency: 45, position: { x: 250, y: 250 } },
          { id: 'payment-service', type: 'service', label: 'Payment Service', status: 'healthy', cpu: 42.1, memory: 44.3, latency: 35, position: { x: 250, y: 350 } },
          { id: 'postgresql', type: 'database', label: 'PostgreSQL', status: 'healthy', cpu: 28.5, memory: 72.1, latency: 8, position: { x: 250, y: 450 } },
        ],
      };
    }
  },
  getGraph: async () => {
    try {
      const response = await api.get('/api/v1/topology/graph');
      return response;
    } catch {
      await mockDelay();
      return {
        data: {
          nodes: [],
          edges: [
            { id: 'e1', source: 'api-gateway', target: 'user-service' },
            { id: 'e2', source: 'user-service', target: 'order-service' },
            { id: 'e3', source: 'order-service', target: 'payment-service' },
            { id: 'e4', source: 'payment-service', target: 'postgresql' },
            { id: 'e5', source: 'user-service', target: 'postgresql' },
          ],
        },
      };
    }
  },
  getConnections: async () => {
    await mockDelay();
    return {
      data: [
        { id: 'e1', source: 'api-gateway', target: 'user-service' },
        { id: 'e2', source: 'user-service', target: 'order-service' },
        { id: 'e3', source: 'order-service', target: 'payment-service' },
        { id: 'e4', source: 'payment-service', target: 'postgresql' },
        { id: 'e5', source: 'user-service', target: 'postgresql' },
      ],
    };
  },
  getPods: () => api.get('/api/v1/topology/pods'),
  getDeployments: () => api.get('/api/v1/topology/deployments'),
  getServices: () => api.get('/api/v1/topology/services'),
  getHealth: () => api.get('/api/v1/topology/health'),
};

// ─── Dashboard API (with Fallback to Mock Data) ──────────────────────
export const dashboardApi = {
  getMetrics: () => api.get('/metrics'),
  getRecentSimulations: () => api.get('/simulations'),
  getRecentDeployments: () => api.get('/deployments'),
  getHealthStatus: () => api.get('/health'),
  getAlerts: () => api.get('/alerts'),
  getRisk: () => api.get('/risk'),
  getCost: () => api.get('/cost'),
  getPredictions: () => api.get('/predictions'),
  getHistory: () => api.get('/history'),
  getNodes: () => api.get('/nodes'),
  createSimulation: (data) => api.post('/simulations', data),

  getFullDashboard: async () => {
    if (!authService.isAuthenticated()) {
      return { data: mockDashboardData, source: 'mock', partialMock: true };
    }

    try {
      const authConfig = { skipAuthRedirect: true };
      const [metrics, health, alerts, deployments, nodes, pipelines, dockerImages] = await Promise.all([
        api.get('/metrics', authConfig),
        api.get('/health', authConfig),
        api.get('/alerts', authConfig),
        api.get('/deployments', authConfig),
        api.get('/nodes', authConfig),
        api.get('/pipelines', authConfig),
        api.get('/docker-images', authConfig),
      ]);
      const built = buildDashboardData(
        metrics.data,
        health.data,
        alerts.data,
        deployments.data,
        nodes.data,
        pipelines.data,
        dockerImages.data,
      );
      const merged = mergeWithMockFallback(built);
      return {
        data: merged,
        source: 'api',
        partialMock: false,
      };
    } catch {
      return { data: mockDashboardData, source: 'mock', partialMock: true };
    }
  },

  getCloudDashboard: async () => {
    try {
      const authConfig = { skipAuthRedirect: true };
      const [metrics, cost, nodes] = await Promise.all([
        api.get('/metrics', authConfig),
        api.get('/cost', authConfig),
        api.get('/nodes', authConfig),
      ]);
      return { data: buildCloudDashboardData(metrics.data, cost.data, nodes.data), source: 'api' };
    } catch {
      return { data: cloudMockData, source: 'mock' };
    }
  },
};

export default api;
