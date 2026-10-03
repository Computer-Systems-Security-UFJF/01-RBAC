import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { PERMISSIONS, can } from '../rbac/permissions.js';
import { tasks, createTask, findTaskById, findUserById, removeById } from '../data/store.js';

const router = Router();

router.use(authenticate);

// Qualquer papel autenticado tem ao menos task:read:own.
router.get('/', authorize(PERMISSIONS.TASK_READ_OWN), (req, res) => {
  const visible = can(req.user.role, PERMISSIONS.TASK_READ_ALL)
    ? tasks
    : tasks.filter((t) => t.assigneeId === req.user.id);
  res.json(visible);
});

router.post('/', authorize(PERMISSIONS.TASK_CREATE), (req, res) => {
  const { title, description, assigneeId } = req.body || {};
  if (!title || !assigneeId) {
    return res.status(400).json({ error: 'title e assigneeId são obrigatórios' });
  }
  if (!findUserById(assigneeId)) {
    return res.status(400).json({ error: 'Responsável não encontrado' });
  }
  const task = createTask({ title, description, assigneeId: Number(assigneeId), createdBy: req.user.id });
  return res.status(201).json(task);
});

router.patch('/:id', authorize(PERMISSIONS.TASK_UPDATE), (req, res) => {
  const task = findTaskById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

  const { title, description, assigneeId, status } = req.body || {};
  if (assigneeId !== undefined) {
    if (!findUserById(assigneeId)) return res.status(400).json({ error: 'Responsável não encontrado' });
    task.assigneeId = Number(assigneeId);
  }
  if (title !== undefined) task.title = String(title);
  if (description !== undefined) task.description = String(description);
  if (status !== undefined) {
    if (!['PENDENTE', 'CONCLUIDA'].includes(status)) return res.status(400).json({ error: 'Status inválido' });
    task.status = status;
  }
  return res.json(task);
});

// Concluir: Funcionário só pode concluir a própria tarefa; quem tem task:update pode concluir qualquer uma.
router.patch('/:id/complete', authorize(PERMISSIONS.TASK_COMPLETE), (req, res) => {
  const task = findTaskById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

  const isOwner = task.assigneeId === req.user.id;
  if (!isOwner && !can(req.user.role, PERMISSIONS.TASK_UPDATE)) {
    return res.status(403).json({ error: 'Acesso negado', detail: 'Você só pode concluir tarefas atribuídas a você' });
  }
  task.status = 'CONCLUIDA';
  return res.json(task);
});

router.delete('/:id', authorize(PERMISSIONS.TASK_DELETE), (req, res) => {
  const removed = removeById(tasks, req.params.id);
  if (!removed) return res.status(404).json({ error: 'Tarefa não encontrada' });
  return res.status(204).end();
});

export default router;
