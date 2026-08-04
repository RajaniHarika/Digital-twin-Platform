import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';
import topologyRoutes from './routes/topology.js';
import { authMiddleware } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
const hasFrontendBuild = fs.existsSync(path.join(frontendDist, 'index.html'));

const app = express();
const PORT = process.env.PORT || 5000;
const corsOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
    return true;
  }

  if (/^https:\/\/[\w-]+\.onrender\.com$/i.test(origin)) {
    return true;
  }

  if (process.env.RENDER_EXTERNAL_URL && origin === process.env.RENDER_EXTERNAL_URL) {
    return true;
  }

  if (corsOrigins.includes(origin)) {
    return true;
  }

  return false;
};

app.use(cors({
  origin: (origin, callback) => {
    callback(null, isAllowedOrigin(origin));
  },
  credentials: true,
}));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'UP',
    service: 'digital-twin-platform',
    mode: hasFrontendBuild ? 'full-stack' : 'api-only',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health/prometheus', async (_req, res) => {
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

app.use('/api/auth', authRoutes);
app.use('/api', authMiddleware, apiRoutes);
app.use('/api/topology', authMiddleware, topologyRoutes);

if (hasFrontendBuild) {
  app.use(express.static(frontendDist, { index: false, maxAge: '1d', fallthrough: true }));

  app.get('*', (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      next();
      return;
    }

    if (req.path.startsWith('/api') || req.path.startsWith('/assets/')) {
      next();
      return;
    }

    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
      if (err) next(err);
    });
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Digital Twin Platform running on http://localhost:${PORT}`);
  if (hasFrontendBuild) {
    console.log('Serving production frontend build');
  } else {
    console.log('API only — build frontend with: npm run build --prefix frontend');
  }
});
