import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config.js';
import { findUserByEmail, publicUser } from '../data/store.js';
import { ROLE_PERMISSIONS } from '../rbac/permissions.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Informe email e senha' });
  }

  const user = findUserByEmail(email);
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return res.json({
    token,
    user: publicUser(user),
    permissions: ROLE_PERMISSIONS[user.role],
  });
});

router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user, permissions: ROLE_PERMISSIONS[req.user.role] });
});

export default router;
