import { can } from '../rbac/permissions.js';

// Uso: router.get('/x', authenticate, authorize('task:read:all'), handler)
export function authorize(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }
    if (!can(req.user.role, permission)) {
      return res.status(403).json({
        error: 'Acesso negado',
        detail: `O papel ${req.user.role} não possui a permissão "${permission}"`,
      });
    }
    return next();
  };
}
