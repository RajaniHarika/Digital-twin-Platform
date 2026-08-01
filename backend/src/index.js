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

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      callback(null, true);
      return;
    }

    if (corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
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

app.use('/api/auth', authRoutes);
app.use('/api', authMiddleware, apiRoutes);
app.use('/api/topology', authMiddleware, topologyRoutes);

if (hasFrontendBuild) {
  app.use(express.static(frontendDist, { index: false, maxAge: '1d' }));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      next();
      return;
    }

    res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
      if (err) next(err);
    });
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.message === 'Not allowed by CORS' ? 403 : 500).json({
    message: err.message === 'Not allowed by CORS' ? 'Not allowed by CORS' : 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`Digital Twin Platform running on http://localhost:${PORT}`);
  if (hasFrontendBuild) {
    console.log('Serving production frontend build');
  } else {
    console.log('API only — build frontend with: npm run build --prefix frontend');
  }
});
