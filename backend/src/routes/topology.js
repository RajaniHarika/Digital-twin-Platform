import { Router } from 'express';
import { TOPOLOGY_NODES, TOPOLOGY_EDGES, K8S_NODES } from '../data/store.js';
import { getServiceMetrics } from '../services/prometheus.js';

const router = Router();

// Map of topology node IDs to Prometheus job names (must match prometheus-config.yaml scrape job names)
const SERVICE_JOB_MAP = {
  'api-gateway':          'api-gateway',
  'auth-service':         'auth-service',
  'cluster-sync':         'cluster-sync',
  'topology-service':     'topology-service',
  'simulation-service':   'simulation-service',
  'risk-service':         'risk-service',
  'cost-service':         'cost-service',
};

/**
 * GET /topology/nodes
 * Returns topology nodes enriched with REAL CPU, memory, latency, and status from Prometheus.
 * Falls back to store.js values per-field if Prometheus returns null for that service.
 */
router.get('/nodes', async (_req, res) => {
  // Fetch real metrics for all services in parallel
  const metricsResults = await Promise.all(
    TOPOLOGY_NODES.map(async (node) => {
      const jobName = SERVICE_JOB_MAP[node.id];
      if (!jobName) return { id: node.id, metrics: {} };
      const metrics = await getServiceMetrics(jobName);
      return { id: node.id, metrics };
    })
  );

  // Build lookup map: nodeId -> real metrics
  const metricsMap = {};
  metricsResults.forEach(({ id, metrics }) => {
    metricsMap[id] = metrics;
  });

  // Merge real metrics into store nodes, falling back to stored values if null
  const enrichedNodes = TOPOLOGY_NODES.map((node) => {
    const real = metricsMap[node.id] || {};
    return {
      ...node,
      cpu:     real.cpu     ?? node.cpu,
      memory:  real.memory  ?? node.memory,
      latency: real.latency ?? node.latency,
      status:  real.status  ?? node.status,
      // Tell frontend if this node has real or fallback data
      dataSource: real.cpu != null ? 'prometheus' : 'fallback',
    };
  });

  res.json(enrichedNodes);
});

/**
 * GET /topology/connections
 * Returns topology edges (service connections). These are structural — not from Prometheus.
 */
router.get('/connections', (_req, res) => {
  res.json(TOPOLOGY_EDGES);
});

/**
 * GET /topology/k8s/nodes
 * Returns real K8s node info (comes from store which is populated from K8s API on startup).
 */
router.get('/k8s/nodes', (_req, res) => {
  res.json(K8S_NODES);
});

router.get('/k8s/pods', (_req, res) => {
  res.json([
    { name: 'auth-service-7d4f8b-abc12',       namespace: 'digitaltwin', status: 'Running', node: 'worker-ap-south-1a', cpu: '120m', memory: '256Mi' },
    { name: 'api-gateway-5c9d2e-def34',         namespace: 'digitaltwin', status: 'Running', node: 'worker-ap-south-1a', cpu: '80m',  memory: '128Mi' },
    { name: 'topology-service-8f1a3b-ghi56',    namespace: 'digitaltwin', status: 'Running', node: 'worker-ap-south-1b', cpu: '95m',  memory: '192Mi' },
    { name: 'simulation-service-2b7c4d-jkl78',  namespace: 'digitaltwin', status: 'Running', node: 'worker-ap-south-1b', cpu: '210m', memory: '384Mi' },
    { name: 'risk-service-3a1b2c-pqr01',        namespace: 'digitaltwin', status: 'Running', node: 'worker-ap-south-1a', cpu: '90m',  memory: '200Mi' },
    { name: 'cost-service-4c2d3e-stu23',        namespace: 'digitaltwin', status: 'Running', node: 'worker-ap-south-1b', cpu: '75m',  memory: '180Mi' },
    { name: 'cluster-sync-5d3e4f-vwx45',        namespace: 'digitaltwin', status: 'Running', node: 'worker-ap-south-1a', cpu: '60m',  memory: '150Mi' },
  ]);
});

router.get('/k8s/deployments', (_req, res) => {
  res.json([
    { name: 'auth-service',       replicas: 2, available: 2, namespace: 'digitaltwin' },
    { name: 'api-gateway',        replicas: 2, available: 2, namespace: 'digitaltwin' },
    { name: 'topology-service',   replicas: 2, available: 2, namespace: 'digitaltwin' },
    { name: 'simulation-service', replicas: 2, available: 2, namespace: 'digitaltwin' },
    { name: 'risk-service',       replicas: 2, available: 2, namespace: 'digitaltwin' },
    { name: 'cost-service',       replicas: 2, available: 2, namespace: 'digitaltwin' },
    { name: 'cluster-sync',       replicas: 2, available: 2, namespace: 'digitaltwin' },
  ]);
});

router.get('/k8s/services', (_req, res) => {
  res.json([
    { name: 'auth-service',       type: 'ClusterIP', port: 8081, namespace: 'digitaltwin' },
    { name: 'api-gateway',        type: 'ClusterIP', port: 8080, namespace: 'digitaltwin' },
    { name: 'topology-service',   type: 'ClusterIP', port: 8084, namespace: 'digitaltwin' },
    { name: 'simulation-service', type: 'ClusterIP', port: 8085, namespace: 'digitaltwin' },
    { name: 'risk-service',       type: 'ClusterIP', port: 8086, namespace: 'digitaltwin' },
    { name: 'cost-service',       type: 'ClusterIP', port: 8087, namespace: 'digitaltwin' },
    { name: 'cluster-sync',       type: 'ClusterIP', port: 8083, namespace: 'digitaltwin' },
  ]);
});

export default router;
