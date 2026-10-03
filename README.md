# 01-RBAC

Mini projeto de **RBAC (Role-Based Access Control)** em JavaScript: API Node/Express com JWT e interface React (Vite).

Cenário: uma empresa com três cargos que compartilham um quadro de tarefas.

## Como rodar

Pré-requisito: Node 18+.

```bash
# terminal 1 — API (porta 3001)
cd backend
npm install
npm run dev

# terminal 2 — interface (porta 5173, com proxy /api -> 3001)
cd frontend
npm install
npm run dev
```

Abra http://localhost:5173.

## Usuários de teste

Todos com senha `123456`. A tela de login tem atalhos para entrar com cada papel.

| Email | Nome | Papel |
| --- | --- | --- |
| diretor@empresa.com | Ana Diretora | DIRETOR |
| coord@empresa.com | Carlos Coordenador | COORDENADOR |
| func@empresa.com | Fernanda Funcionária | FUNCIONARIO |
| func2@empresa.com | Felipe Funcionário | FUNCIONARIO |

Os dados ficam **em memória**: reiniciar a API volta ao estado inicial.

### Matriz de permissões

| Permissão | FUNCIONARIO | COORDENADOR | DIRETOR |
| --- | :-: | :-: | :-: |
| `task:read:own` | x | x | x |
| `task:complete` | x | x | x |
| `task:read:all` |  | x | x |
| `task:create` |  | x | x |
| `task:update` |  | x | x |
| `task:delete` |  | x | x |
| `user:read` |  |  | x |
| `user:create` |  |  | x |
| `user:update` |  |  | x |
| `user:delete` |  |  | x |