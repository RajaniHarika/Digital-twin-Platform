import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { USERS } from '../data/store.js';
import { signToken } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'digital-twin-platform-secret-key-2026';
const router = Router();

router.post('/login', (req, res) => {
  const { email, password, role } = req.body;
  const normalizedEmail = email?.toLowerCase().trim();

  const user = USERS.find((u) => u.email === normalizedEmail);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const roleMatches =
    user.role === role ||
    (normalizedEmail === 'sre@digitaltwin.com' &&
      (role === 'Site Reliability Engineer (SRE)' || role === 'SRE Engineer'));

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
