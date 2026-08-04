import { Router } from 'express';
import {
  SIMULATIONS,
  RISK_ITEMS,
  COST_BREAKDOWN,
  PREDICTIONS,
  HISTORY,
  K8S_NODES,
  JENKINS_PIPELINES,
  DOCKER_IMAGES,
} from '../data/store.js';
import { getClusterMetrics, getChartTrends, queryPrometheus, queryPrometheusRange } from '../services/prometheus.js';

const router = Router();

// ── DEBUG: test Prometheus connectivity live ──────────────────────────────────
router.get('/debug/prometheus', async (_req, res) => {
  const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://10.0.1.184:30080/prometheus';
  const tests = [
    { name: 'connectivity',         query: 'up' },
    { name: 'node_cpu',             query: 'node_cpu_seconds_total{mode="idle"}' },
    { name: 'node_memory_total',    query: 'node_memory_MemTotal_bytes' },
    { name: 'node_memory_avail',    query: 'node_memory_MemAvailable_bytes' },
    { name: 'process_cpu_usage',    query: 'process_cpu_usage' },
    { name: 'system_cpu_usage',     query: 'system_cpu_usage' },
    { name: 'jvm_memory_used',      query: 'jvm_memory_used_bytes{area="heap"}' },
    { name: 'network_rx',           query: 'node_network_receive_bytes_total' },
  ];

  const results = {};
  for (const t of tests) {
    try {
      const url = `${PROMETHEUS_URL}/api/v1/query?query=${encodeURIComponent(t.query)}`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      const json = await resp.json();
      results[t.name] = {
        status: resp.status,
        resultCount: json?.data?.result?.length ?? 0,
        sample: json?.data?.result?.[0] ?? null,
        error: json?.error ?? null,
      };
    } catch (err) {
      results[t.name] = { error: err.message };
    }
  }

  res.json({ prometheusUrl: PROMETHEUS_URL, tests: results });
});
// ─────────────────────────────────────────────────────────────────────────────

const trendData = (base, variance = 10) =>
  Array.from({ length: 12 }, (_, i) => ({
    name: `${String(i * 2).padStart(2, '0')}:00`,
    value: Math.round(base + (Math.random() - 0.5) * variance),
  }));


router.get('/metrics', async (_req, res) => {
  const runningPods = K8S_NODES.reduce((sum, n) => sum + (n.pods || 0), 0);

  // Query real metrics from Prometheus — fall back to store values if unreachable
  const [prom, trends] = await Promise.all([
    getClusterMetrics(),
    getChartTrends(),
  ]);

  res.json({
    activeServices: 7,
    runningPods,
    pendingPods: 4,
    restartCount: 12,
    crashLoopBackOff: 1,
    // Real values from Prometheus, fallback to last known if Prometheus is down
    cpuUsage:       prom.cpuUsage      ?? 72.4,
    memoryUsage:    prom.memoryUsage   ?? 68.9,
    networkTraffic: prom.networkTraffic ?? 847,
    activeSimulations: SIMULATIONS.filter((s) => s.status === 'running').length,
    riskScore: 58,
    monthlyCost: COST_BREAKDOWN.reduce((sum, c) => sum + c.monthly, 0),
    trends: {
      cpu:     trends.cpu.length     ? trends.cpu     : trendData(65, 20),
      memory:  trends.memory.length  ? trends.memory  : trendData(60, 15),
      network: trends.network.length ? trends.network : trendData(600, 200),
    },
    // Indicate to frontend whether data is real or fallback
    dataSource: prom.cpuUsage != null ? 'prometheus' : 'fallback',
  });
});

router.get('/simulations', (_req, res) => {
  res.json(SIMULATIONS);
});

router.get('/deployments', (_req, res) => {
  res.json([
    { id: 'd1', service: 'auth-service', version: '1.2.0', status: 'success', timestamp: '2026-07-30T09:00:00Z', duration: 180 },
    { id: 'd2', service: 'topology-service', version: '2.1.0', status: 'success', timestamp: '2026-07-29T16:30:00Z', duration: 240 },
    { id: 'd3', service: 'simulation-service', version: '1.0.3', status: 'success', timestamp: '2026-07-29T14:15:00Z', duration: 95 },
    { id: 'd4', service: 'api-gateway', version: '3.0.1', status: 'success', timestamp: '2026-07-28T11:00:00Z', duration: 150 },
    { id: 'd5', service: 'risk-service', version: '1.0.0', status: 'success', timestamp: '2026-07-28T10:00:00Z', duration: 130 },
    { id: 'd6', service: 'cost-service', version: '1.0.0', status: 'success', timestamp: '2026-07-28T09:00:00Z', duration: 125 },
    { id: 'd7', service: 'cluster-sync-service', version: '1.0.0', status: 'success', timestamp: '2026-07-28T08:00:00Z', duration: 110 },
  ]);
});

router.get('/health', async (_req, res) => {
  const SERVICE_JOBS = [
    { name: 'API Gateway',        job: 'api-gateway' },
    { name: 'Auth Service',       job: 'auth-service' },
    { name: 'Cluster Sync',       job: 'cluster-sync' },
    { name: 'Topology Service',   job: 'topology-service' },
    { name: 'Simulation Service', job: 'simulation-service' },
    { name: 'Risk Service',       job: 'risk-service' },
    { name: 'Cost Service',       job: 'cost-service' },
  ];

  // Query real up{job=...} from Prometheus for each service
  const upResults = await Promise.all(
    SERVICE_JOBS.map(async ({ name, job }) => {
      const upVal = await queryPrometheus(`up{job="${job}"}`);
      return {
        name,
        // 1 = healthy, 0 = down, null = prometheus unreachable (use healthy as safe default)
        status: upVal === 0 ? 'down' : 'healthy',
        uptime: upVal === 0 ? 95.0 : 99.9,
        dataSource: upVal != null ? 'prometheus' : 'fallback',
      };
    })
  );

  const hasRealData = upResults.some((s) => s.dataSource === 'prometheus');
  const allHealthy = upResults.every((s) => s.status === 'healthy');

  res.json({
    overall: allHealthy ? 'healthy' : 'degraded',
    services: upResults,
    dataSource: hasRealData ? 'prometheus' : 'fallback',
  });
});


router.get('/alerts', (_req, res) => {
  res.json([
    { id: 'a1', severity: 'warning', title: 'Simulation Service Memory', message: 'Memory usage exceeded 85% threshold', timestamp: '2026-07-30T10:45:00Z', acknowledged: false },
    { id: 'a2', severity: 'info', title: 'Cluster Sync Complete', message: 'Kubernetes topology synced successfully', timestamp: '2026-07-30T10:30:00Z', acknowledged: true },
    { id: 'a3', severity: 'critical', title: 'Sim Stress Test Failed', message: 'API Gateway stress simulation exceeded error budget', timestamp: '2026-07-30T07:30:00Z', acknowledged: false },
  ]);
});

router.get('/nodes', (_req, res) => {
  res.json(K8S_NODES);
});

router.get('/risk', (_req, res) => {
  res.json({ overallScore: 58, items: RISK_ITEMS });
});

router.get('/cost', (_req, res) => {
  const total = COST_BREAKDOWN.reduce((sum, c) => sum + c.monthly, 0);
  res.json({ total, breakdown: COST_BREAKDOWN, forecast: total * 1.11 });
});

router.get('/predictions', async (_req, res) => {
  // Get real current CPU from Prometheus
  const { cpuUsage } = await getClusterMetrics();
  // Get last 7 days of CPU trend data to compute a simple linear slope
  const cpuTrend = await queryPrometheusRange(
    'avg(process_cpu_usage{job=~"api-gateway|auth-service|cluster-sync|topology-service|simulation-service|risk-service|cost-service"}) * 100',
    168, // 7 days in hours
    24   // 1 data point per day
  );

  let predictedCpu7d = null;
  if (cpuTrend.length >= 2) {
    // Simple linear extrapolation: slope = (last - first) / days
    const slope = (cpuTrend[cpuTrend.length - 1].value - cpuTrend[0].value) / cpuTrend.length;
    predictedCpu7d = Math.round((cpuUsage ?? cpuTrend[cpuTrend.length - 1].value) + slope * 7);
  }

  const currentCpu = cpuUsage ?? PREDICTIONS[0].current;
  const predictedCpu = predictedCpu7d ?? PREDICTIONS[0].predicted;

  res.json([
    {
      ...PREDICTIONS[0],
      current: Math.round(currentCpu * 10) / 10,
      predicted: predictedCpu,
      dataSource: cpuUsage != null ? 'prometheus' : 'fallback',
    },
    // Cost, Pod Count, Failure Probability remain static until AWS/K8s integration
    PREDICTIONS[1],
    PREDICTIONS[2],
    PREDICTIONS[3],
  ]);
});

router.get('/history', (_req, res) => {
  res.json(HISTORY);
});

router.get('/pipelines', (_req, res) => {
  res.json(JENKINS_PIPELINES);
});

router.get('/docker-images', (_req, res) => {
  res.json(DOCKER_IMAGES);
});

router.post('/simulations', (req, res) => {
  const { name, type = 'scale', targetService, loadFactor, strategy } = req.body;
  const simulation = {
    id: `sim-${Date.now()}`,
    name: name || `New ${type} simulation`,
    type,
    targetService: targetService || 'api-gateway',
    loadFactor: Number(loadFactor) || 1,
    strategy: strategy || 'rolling',
    status: 'running',
    duration: null,
    timestamp: new Date().toISOString(),
    riskScore: null,
    impact: 'Medium',
    costDelta: 0,
  };
  SIMULATIONS.unshift(simulation);
  res.status(201).json(simulation);
});

export default router;
