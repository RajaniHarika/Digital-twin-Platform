import { Router } from 'express';
import {
  SIMULATIONS,
  RISK_ITEMS,
  COST_BREAKDOWN,
  PREDICTIONS,
  HISTORY,
  K8S_NODES,
} from '../data/store.js';

const router = Router();

const trendData = (base, variance = 10) =>
  Array.from({ length: 12 }, (_, i) => ({
    name: `${String(i * 2).padStart(2, '0')}:00`,
    value: Math.round(base + (Math.random() - 0.5) * variance),
  }));

router.get('/metrics', (_req, res) => {
  res.json({
    activeServices: 8,
    runningPods: 156,
    cpuUsage: 72.4,
    memoryUsage: 68.9,
    networkTraffic: 847,
    activeSimulations: SIMULATIONS.filter((s) => s.status === 'running').length,
    riskScore: 78,
    monthlyCost: COST_BREAKDOWN.reduce((sum, c) => sum + c.monthly, 0),
    trends: {
      cpu: trendData(65, 20),
      memory: trendData(60, 15),
      network: trendData(600, 200),
    },
  });
});

router.get('/simulations', (_req, res) => {
  res.json(SIMULATIONS);
});

router.get('/deployments', (_req, res) => {
  res.json([
    { id: 'd1', service: 'auth-service', version: '1.2.0', status: 'success', timestamp: '2026-07-30T09:00:00Z', duration: 180 },
    { id: 'd2', service: 'topology-service', version: '2.1.0', status: 'success', timestamp: '2026-07-29T16:30:00Z', duration: 240 },
    { id: 'd3', service: 'simulation-service', version: '1.0.3', status: 'failed', timestamp: '2026-07-29T14:15:00Z', duration: 95 },
    { id: 'd4', service: 'api-gateway', version: '3.0.1', status: 'success', timestamp: '2026-07-28T11:00:00Z', duration: 150 },
    { id: 'd5', service: 'frontend', version: '1.0.0', status: 'success', timestamp: '2026-07-28T08:30:00Z', duration: 120 },
  ]);
});

router.get('/health', (_req, res) => {
  res.json({
    overall: 'healthy',
    services: [
      { name: 'API Gateway', status: 'healthy', uptime: 99.98 },
      { name: 'Auth Service', status: 'healthy', uptime: 99.95 },
      { name: 'Cluster Sync', status: 'healthy', uptime: 99.92 },
      { name: 'Topology Service', status: 'healthy', uptime: 99.88 },
      { name: 'Simulation Service', status: 'warning', uptime: 99.72 },
      { name: 'AI Service', status: 'healthy', uptime: 99.99 },
    ],
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

router.get('/predictions', (_req, res) => {
  res.json(PREDICTIONS);
});

router.get('/history', (_req, res) => {
  res.json(HISTORY);
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
