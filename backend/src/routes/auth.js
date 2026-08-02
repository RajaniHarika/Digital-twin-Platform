import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { USERS } from '../data/store.js';
import { signToken } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'digital-twin-platform-secret-key-2026';
const router = Router();

// Map frontend enum values → display role names (frontend sends enums on login)
const ENUM_TO_ROLE = {
  'DEVOPS_ENGINEER': 'DevOps Engineer',
  'BACKEND_ENGINEER': 'Backend Engineer',
  'CLOUD_ENGINEER': 'Cloud Engineer',
  'SRE_ENGINEER': 'Site Reliability Engineer (SRE)',
  'PROJECT_MANAGER': 'Project Manager',
  'ADMIN': 'Admin',
};

router.post('/login', (req, res) => {
  const { email, password, role } = req.body;
  const normalizedEmail = email?.toLowerCase().trim();

  const user = USERS.find((u) => u.email === normalizedEmail);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Accept both plain display name and enum format sent by the frontend
  const resolvedRole = ENUM_TO_ROLE[role] || role;

  const roleMatches =
    user.role === resolvedRole ||
    (normalizedEmail === 'sre@digitaltwin.com' &&
      (resolvedRole === 'Site Reliability Engineer (SRE)' || resolvedRole === 'SRE Engineer'));

  if (!roleMatches) {
    return res.status(401).json({ message: 'Invalid role for this account' });
  }

  const token = signToken(user);
  res.json({
    token,
    user: { email: user.email, role: user.role, name: user.name },
  });
});

router.get('/me', (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(header.slice(7), JWT_SECRET);
    res.json({ email: decoded.email, role: decoded.role, name: decoded.name });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
