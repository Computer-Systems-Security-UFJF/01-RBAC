import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { PERMISSIONS, isValidRole } from '../rbac/permissions.js';
import { users, createUser, findUserById, findUserByEmail, publicUser, removeById } from '../data/store.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize(PERMISSIONS.USER_READ), (_req, res) => {
  res.json(users.map(publicUser));
});

// Lista reduzida (id, nome, papel) para quem pode atribuir tarefas (Coordenador+),
// sem expor emails nem exigir a permissão completa user:read.
router.get('/assignable', authorize(PERMISSIONS.TASK_CREATE), (_req, res) => {
  res.json(users.map(({ id, name, role }) => ({ id, name, role })));
});

router.post('/', authorize(PERMISSIONS.USER_CREATE), (req, res) => {
  const { name, email, password, role } = req.body || {};
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'name, email, password e role são obrigatórios' });
  }
  if (!isValidRole(role)) {
    return res.status(400).json({ error: 'Papel inválido' });
  }
  if (findUserByEmail(email)) {
    return res.status(409).json({ error: 'Email já cadastrado' });
  }
  const user = createUser({ name, email, password, role });
  return res.status(201).json(publicUser(user));
});

router.patch('/:id', authorize(PERMISSIONS.USER_UPDATE), (req, res) => {
  const user = findUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  const { name, role } = req.body || {};
  if (role !== undefined) {
    if (!isValidRole(role)) return res.status(400).json({ error: 'Papel inválido' });
    if (user.id === req.user.id && role !== user.role) {
      return res.status(400).json({ error: 'Você não pode alterar o próprio papel' });
    }
    user.role = role;
  }
  if (name !== undefined) user.name = String(name);

  return res.json(publicUser(user));
});

router.delete('/:id', authorize(PERMISSIONS.USER_DELETE), (req, res) => {
  const user = findUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  if (user.id === req.user.id) {
    return res.status(400).json({ error: 'Você não pode remover a si mesmo' });
  }
  removeById(users, user.id);
  return res.status(204).end();
});

export default router;
