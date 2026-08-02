import axios from 'axios';
import { mockDashboardData } from '../features/dashboard/mockData';
import { cloudMockData } from '../data/cloudMockData';
import { getApiBaseUrl } from './config';
import authService from './auth';
import { getRelativeTime } from '../utils/formatters';

const getAuthToken = () => localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

const api = axios.create({
  baseURL: getApiBaseUrl(),
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
      authService.logout();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

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

export const topologyApi = {
  getNodes: () => api.get('/topology/nodes'),
  getConnections: () => api.get('/topology/connections'),
};

export default api;
