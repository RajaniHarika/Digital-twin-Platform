import { Router } from 'express';
import { TOPOLOGY_NODES, TOPOLOGY_EDGES, K8S_NODES } from '../data/store.js';

const router = Router();

router.get('/nodes', (_req, res) => {
  res.json(TOPOLOGY_NODES);
});

router.get('/connections', (_req, res) => {
  res.json(TOPOLOGY_EDGES);
});

router.get('/k8s/nodes', (_req, res) => {
  res.json(K8S_NODES);
});

router.get('/k8s/pods', (_req, res) => {
  res.json([
    { name: 'auth-service-7d4f8b-abc12', namespace: 'digital-twin', status: 'Running', node: 'worker-ap-south-1a', cpu: '120m', memory: '256Mi' },
    { name: 'api-gateway-5c9d2e-def34', namespace: 'digital-twin', status: 'Running', node: 'worker-ap-south-1a', cpu: '80m', memory: '128Mi' },
    { name: 'topology-service-8f1a3b-ghi56', namespace: 'digital-twin', status: 'Running', node: 'worker-ap-south-1b', cpu: '95m', memory: '192Mi' },
    { name: 'simulation-service-2b7c4d-jkl78', namespace: 'digital-twin', status: 'Running', node: 'worker-ap-south-1b', cpu: '210m', memory: '384Mi' },
    { name: 'frontend-9e6f1a-mno90', namespace: 'digital-twin', status: 'Running', node: 'worker-ap-south-1a', cpu: '45m', memory: '64Mi' },
  ]);
});

router.get('/k8s/deployments', (_req, res) => {
  res.json([
    { name: 'auth-service', replicas: 2, available: 2, namespace: 'digital-twin' },
    { name: 'api-gateway', replicas: 1, available: 1, namespace: 'digital-twin' },
    { name: 'topology-service', replicas: 2, available: 2, namespace: 'digital-twin' },
    { name: 'simulation-service', replicas: 1, available: 1, namespace: 'digital-twin' },
    { name: 'frontend', replicas: 2, available: 2, namespace: 'digital-twin' },
  ]);
});

router.get('/k8s/services', (_req, res) => {
  res.json([
    { name: 'auth-service', type: 'ClusterIP', port: 8081, namespace: 'digital-twin' },
    { name: 'api-gateway', type: 'ClusterIP', port: 8080, namespace: 'digital-twin' },
    { name: 'topology-service', type: 'ClusterIP', port: 8083, namespace: 'digital-twin' },
    { name: 'frontend', type: 'ClusterIP', port: 80, namespace: 'digital-twin' },
  ]);
});

export default router;
