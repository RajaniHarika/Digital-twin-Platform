import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Helper ──────────────────────────────────────────────────────────
export const mockDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

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

// ─── Dashboard API (Mock — no dedicated backend service yet) ─────────
export const dashboardApi = {
  getMetrics: async () => {
    await mockDelay();
    return {
      data: {
        activeServices: 47,
        runningPods: 156,
        cpuUsage: 72.4,
        memoryUsage: 68.9,
        networkTraffic: 847,
        activeSimulations: 12,
        riskScore: 78,
        monthlyCost: 45678,
        trends: {
          cpu: [
            { name: '00:00', value: 45 }, { name: '02:00', value: 52 }, { name: '04:00', value: 48 },
            { name: '06:00', value: 61 }, { name: '08:00', value: 72 }, { name: '10:00', value: 78 },
            { name: '12:00', value: 85 }, { name: '14:00', value: 82 }, { name: '16:00', value: 76 },
            { name: '18:00', value: 68 }, { name: '20:00', value: 55 }, { name: '22:00', value: 48 },
          ],
          memory: [
            { name: '00:00', value: 52 }, { name: '02:00', value: 55 }, { name: '04:00', value: 58 },
            { name: '06:00', value: 62 }, { name: '08:00', value: 68 }, { name: '10:00', value: 72 },
            { name: '12:00', value: 75 }, { name: '14:00', value: 78 }, { name: '16:00', value: 74 },
            { name: '18:00', value: 68 }, { name: '20:00', value: 60 }, { name: '22:00', value: 54 },
          ],
          network: [
            { name: '00:00', value: 450 }, { name: '02:00', value: 380 }, { name: '04:00', value: 320 },
            { name: '06:00', value: 520 }, { name: '08:00', value: 720 }, { name: '10:00', value: 890 },
            { name: '12:00', value: 950 }, { name: '14:00', value: 880 }, { name: '16:00', value: 780 },
            { name: '18:00', value: 650 }, { name: '20:00', value: 520 }, { name: '22:00', value: 420 },
          ],
        },
      },
    };
  },
  getRecentSimulations: async () => {
    // Try real backend first, fall back to mock
    try {
      const response = await api.get('/api/v1/simulations');
      return {
        data: (response.data || []).slice(0, 5).map((s) => ({
          id: `sim-${s.id}`,
          name: s.name,
          status: (s.status || '').toLowerCase(),
          duration: s.duration,
          timestamp: s.createdAt,
          riskScore: s.riskScore,
        })),
      };
    } catch {
      await mockDelay();
      return {
        data: [
          { id: 'sim-001', name: 'Payment Service Scaling', status: 'completed', duration: 45, timestamp: '2026-07-08T10:30:00Z', riskScore: 23 },
          { id: 'sim-002', name: 'User Service Load Test', status: 'running', duration: null, timestamp: '2026-07-08T11:15:00Z', riskScore: null },
          { id: 'sim-003', name: 'Order Service Migration', status: 'completed', duration: 120, timestamp: '2026-07-08T09:45:00Z', riskScore: 45 },
          { id: 'sim-004', name: 'Database Failover Test', status: 'completed', duration: 30, timestamp: '2026-07-08T08:00:00Z', riskScore: 12 },
          { id: 'sim-005', name: 'API Gateway Stress Test', status: 'failed', duration: 60, timestamp: '2026-07-08T07:30:00Z', riskScore: 87 },
        ],
      };
    }
  },
  getRecentDeployments: async () => {
    await mockDelay();
    return {
      data: [
        { id: 'deploy-001', service: 'payment-service', version: '2.3.1', status: 'success', timestamp: '2026-07-08T09:45:00Z', duration: 180 },
        { id: 'deploy-002', service: 'user-service', version: '3.1.0', status: 'success', timestamp: '2026-07-07T16:30:00Z', duration: 240 },
        { id: 'deploy-003', service: 'order-service', version: '1.8.2', status: 'failed', timestamp: '2026-07-07T14:15:00Z', duration: 95 },
        { id: 'deploy-004', service: 'api-gateway', version: '4.2.0', status: 'success', timestamp: '2026-07-07T11:00:00Z', duration: 150 },
        { id: 'deploy-005', service: 'notification-service', version: '2.0.5', status: 'success', timestamp: '2026-07-07T08:30:00Z', duration: 120 },
      ],
    };
  },
  getHealthStatus: async () => {
    await mockDelay();
    return {
      data: {
        overall: 'healthy',
        services: [
          { name: 'API Gateway', status: 'healthy', uptime: 99.98 },
          { name: 'User Service', status: 'healthy', uptime: 99.95 },
          { name: 'Order Service', status: 'warning', uptime: 99.72 },
          { name: 'Payment Service', status: 'healthy', uptime: 99.99 },
          { name: 'Notification Service', status: 'critical', uptime: 98.45 },
          { name: 'Database', status: 'healthy', uptime: 99.99 },
        ],
      },
    };
  },
  getAlerts: async () => {
    await mockDelay();
    return {
      data: [
        { id: 'alert-001', severity: 'critical', title: 'Notification Service Down', message: 'Notification service has been unresponsive for 5 minutes', timestamp: '2026-07-08T10:45:00Z', acknowledged: false },
        { id: 'alert-002', severity: 'warning', title: 'High Memory Usage', message: 'Order service memory usage exceeded 85%', timestamp: '2026-07-08T10:30:00Z', acknowledged: false },
        { id: 'alert-003', severity: 'info', title: 'Deployment Completed', message: 'Payment service v2.3.1 deployed successfully', timestamp: '2026-07-08T09:45:00Z', acknowledged: true },
        { id: 'alert-004', severity: 'warning', title: 'Database Connection Latency', message: 'Database query latency above threshold (500ms)', timestamp: '2026-07-08T09:15:00Z', acknowledged: true },
      ],
    };
  },
};

export default api;