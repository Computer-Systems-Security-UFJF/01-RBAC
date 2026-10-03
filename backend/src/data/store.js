import bcrypt from 'bcryptjs';
import { ROLES } from '../rbac/permissions.js';

// Armazenamento em memória: reinicia junto com o servidor.
const SEED_PASSWORD = '123456';
const hash = (pwd) => bcrypt.hashSync(pwd, 8);

let nextUserId = 1;
let nextTaskId = 1;

export const users = [
  { id: nextUserId++, name: 'Ana Diretora', email: 'diretor@empresa.com', passwordHash: hash(SEED_PASSWORD), role: ROLES.DIRETOR },
  { id: nextUserId++, name: 'Carlos Coordenador', email: 'coord@empresa.com', passwordHash: hash(SEED_PASSWORD), role: ROLES.COORDENADOR },
  { id: nextUserId++, name: 'Fernanda Funcionária', email: 'func@empresa.com', passwordHash: hash(SEED_PASSWORD), role: ROLES.FUNCIONARIO },
  { id: nextUserId++, name: 'Felipe Funcionário', email: 'func2@empresa.com', passwordHash: hash(SEED_PASSWORD), role: ROLES.FUNCIONARIO },
];

export const tasks = [
  { id: nextTaskId++, title: 'Preparar relatório mensal', description: 'Consolidar números de setembro', assigneeId: 3, status: 'PENDENTE', createdBy: 2 },
  { id: nextTaskId++, title: 'Atualizar planilha de clientes', description: '', assigneeId: 3, status: 'CONCLUIDA', createdBy: 2 },
  { id: nextTaskId++, title: 'Revisar contrato do fornecedor', description: 'Verificar cláusulas de prazo', assigneeId: 4, status: 'PENDENTE', createdBy: 2 },
  { id: nextTaskId++, title: 'Planejar reunião trimestral', description: '', assigneeId: 2, status: 'PENDENTE', createdBy: 1 },
];

export function createUser({ name, email, password, role }) {
  const user = { id: nextUserId++, name, email, passwordHash: hash(password), role };
  users.push(user);
  return user;
}

export function createTask({ title, description = '', assigneeId, createdBy }) {
  const task = { id: nextTaskId++, title, description, assigneeId, status: 'PENDENTE', createdBy };
  tasks.push(task);
  return task;
}

export function findUserByEmail(email) {
  return users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
}

export function findUserById(id) {
  return users.find((u) => u.id === Number(id));
}

export function findTaskById(id) {
  return tasks.find((t) => t.id === Number(id));
}

export function removeById(list, id) {
  const idx = list.findIndex((item) => item.id === Number(id));
  if (idx === -1) return false;
  list.splice(idx, 1);
  return true;
}

// Nunca expor o hash da senha.
export function publicUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}
