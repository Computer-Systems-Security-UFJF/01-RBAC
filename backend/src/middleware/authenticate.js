import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import { findUserById } from '../data/store.js';

export function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = findUserById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'Usuário do token não existe mais' });
    }
    // Usa o papel atual do usuário (não o do token) para refletir mudanças de cargo.
    req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}
