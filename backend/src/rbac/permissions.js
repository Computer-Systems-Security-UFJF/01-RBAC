// Fonte única de verdade do RBAC no backend.

export const ROLES = {
  DIRETOR: 'DIRETOR',
  COORDENADOR: 'COORDENADOR',
  FUNCIONARIO: 'FUNCIONARIO',
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

const FUNCIONARIO_PERMS = [PERMISSIONS.TASK_READ_OWN, PERMISSIONS.TASK_COMPLETE];

const COORDENADOR_PERMS = [
  ...FUNCIONARIO_PERMS,
  PERMISSIONS.TASK_READ_ALL,
  PERMISSIONS.TASK_CREATE,
  PERMISSIONS.TASK_UPDATE,
  PERMISSIONS.TASK_DELETE,
];

const DIRETOR_PERMS = [
  ...COORDENADOR_PERMS,
  PERMISSIONS.USER_READ,
  PERMISSIONS.USER_CREATE,
  PERMISSIONS.USER_UPDATE,
  PERMISSIONS.USER_DELETE,
];

export const ROLE_PERMISSIONS = {
  [ROLES.FUNCIONARIO]: FUNCIONARIO_PERMS,
  [ROLES.COORDENADOR]: COORDENADOR_PERMS,
  [ROLES.DIRETOR]: DIRETOR_PERMS,
};

export function isValidRole(role) {
  return Object.values(ROLES).includes(role);
}

export function can(role, permission) {
  const perms = ROLE_PERMISSIONS[role];
  return Array.isArray(perms) && perms.includes(permission);
}
