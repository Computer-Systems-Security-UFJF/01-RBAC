// Espelho da matriz do backend. Serve apenas para exibir/esconder elementos
// da interface; a autorização real acontece sempre no servidor.

export const ROLES = {
  DIRETOR: 'DIRETOR',
  COORDENADOR: 'COORDENADOR',
  FUNCIONARIO: 'FUNCIONARIO',
};

export const ROLE_LABELS = {
  DIRETOR: 'Diretor',
  COORDENADOR: 'Coordenador',
  FUNCIONARIO: 'Funcionário',
};

export const PERMISSIONS = {
  TASK_READ_OWN: 'task:read:own',
  TASK_READ_ALL: 'task:read:all',
  TASK_CREATE: 'task:create',
  TASK_UPDATE: 'task:update',
  TASK_COMPLETE: 'task:complete',
  TASK_DELETE: 'task:delete',
  USER_READ: 'user:read',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
};
