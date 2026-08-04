import api, { dashboardApi, topologyApi } from '../../services/api';
import {
  buildBackendDashboardData,
  buildSreDashboardData,
  buildProjectManagerDashboardData,
  buildAdminOverviewData,
} from './builders';

const authConfig = { skipAuthRedirect: true };

export const roleDashboardApi = {
  getBackend: async () => {
    try {
      const [health, metrics, nodes, connections] = await Promise.all([
        api.get('/health', authConfig),
        api.get('/metrics', authConfig),
        topologyApi.getNodes(),
        topologyApi.getConnections(),
      ]);
      return { data: buildBackendDashboardData(health.data, metrics.data, nodes.data, connections.data), source: 'api' };
    } catch {
      return { data: buildBackendDashboardData({}, {}, [], []), source: 'mock' };
    }
  },

  getSre: async () => {
    try {
      const [health, metrics, alerts, history] = await Promise.all([
        api.get('/health', authConfig),
        api.get('/metrics', authConfig),
        api.get('/alerts', authConfig),
        api.get('/history', authConfig),
      ]);
      return { data: buildSreDashboardData(health.data, metrics.data, alerts.data, history.data), source: 'api' };
    } catch {
      return { data: buildSreDashboardData({}, {}, [], []), source: 'mock' };
    }
  },

  getProjectManager: async () => {
    try {
      const [deployments, history, risk, cost] = await Promise.all([
        api.get('/deployments', authConfig),
        api.get('/history', authConfig),
        api.get('/risk', authConfig),
        api.get('/cost', authConfig),
      ]);
      return {
        data: buildProjectManagerDashboardData(deployments.data, history.data, risk.data, cost.data),
        source: 'api',
      };
    } catch {
      return { data: buildProjectManagerDashboardData([], [], { items: [] }, { breakdown: [] }), source: 'mock' };
    }
  },

  getAdmin: async () => {
    try {
      const [full, cloudRes, backend, sre, pm] = await Promise.all([
        dashboardApi.getFullDashboard(),
        dashboardApi.getCloudDashboard(),
        roleDashboardApi.getBackend(),
        roleDashboardApi.getSre(),
        roleDashboardApi.getProjectManager(),
      ]);
      return {
        data: buildAdminOverviewData(full.data, cloudRes.data, backend.data, sre.data, pm.data),
        source: 'api',
      };
    } catch {
      const empty = {};
      return {
        data: buildAdminOverviewData(empty, empty, buildBackendDashboardData({}, {}, [], []), buildSreDashboardData({}, {}, [], []), buildProjectManagerDashboardData([], [], {}, {})),
        source: 'mock',
      };
    }
  },
};

export default roleDashboardApi;
