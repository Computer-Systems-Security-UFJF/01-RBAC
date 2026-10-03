import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';
import Can from '../components/Can.jsx';
import { PERMISSIONS, ROLES, ROLE_LABELS } from '../rbac/permissions.js';

const EMPTY = { name: '', email: '', password: '', role: ROLES.FUNCIONARIO };

export default function Users() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY);

  const load = useCallback(async () => {
    setError('');
    try {
      setUsers(await api('/users'));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function run(action) {
    setError('');
    try {
      await action();
      await load();
    } catch (err) {
      setError(err.detail ? `${err.message}: ${err.detail}` : err.message);
    }
  }

  function handleCreate(e) {
    e.preventDefault();
    run(async () => {
      await api('/users', { method: 'POST', body: form });
      setForm(EMPTY);
    });
  }

  return (
    <>
      <div className="card">
        <h2>Usuários</h2>
        {error && <div className="alert">{error}</div>}

        <Can permission={PERMISSIONS.USER_CREATE}>
          <form className="form-row" onSubmit={handleCreate}>
            <label>
              Nome
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              Email
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </label>
            <label>
              Senha
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </label>
            <label>
              Papel
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {Object.values(ROLES).map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn">Criar usuário</button>
          </form>
        </Can>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Papel</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isMe = u.id === me.id;
              return (
                <tr key={u.id}>
                  <td>
                    {u.name} {isMe && <span className="muted">(você)</span>}
                  </td>
                  <td className="muted">{u.email}</td>
                  <td>
                    <Can permission={PERMISSIONS.USER_UPDATE} fallback={<span className={`badge role-${u.role}`}>{ROLE_LABELS[u.role]}</span>}>
                      <select
                        value={u.role}
                        disabled={isMe}
                        onChange={(e) => run(() => api(`/users/${u.id}`, { method: 'PATCH', body: { role: e.target.value } }))}
                      >
                        {Object.values(ROLES).map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </select>
                    </Can>
                  </td>
                  <td className="actions">
                    <Can permission={PERMISSIONS.USER_DELETE}>
                      <button className="btn btn-danger btn-sm" disabled={isMe} onClick={() => run(() => api(`/users/${u.id}`, { method: 'DELETE' }))}>
                        Remover
                      </button>
                    </Can>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
