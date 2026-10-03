import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';
import Can from '../components/Can.jsx';
import { PERMISSIONS } from '../rbac/permissions.js';

export default function Tasks() {
  const { user, can } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [people, setPeople] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', assigneeId: '' });

  const load = useCallback(async () => {
    setError('');
    try {
      const list = await api('/tasks');
      setTasks(list);
      if (can(PERMISSIONS.TASK_CREATE)) {
        setPeople(await api('/users/assignable'));
      }
    } catch (err) {
      setError(err.message);
    }
  }, [can]);

  useEffect(() => {
    load();
  }, [load]);

  const nameOf = (id) => (id === user.id ? `${user.name} (você)` : people.find((p) => p.id === id)?.name || `#${id}`);

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
      await api('/tasks', { method: 'POST', body: { ...form, assigneeId: Number(form.assigneeId) } });
      setForm({ title: '', description: '', assigneeId: '' });
    });
  }

  const canCompleteTask = (t) => t.status !== 'CONCLUIDA' && (t.assigneeId === user.id || can(PERMISSIONS.TASK_UPDATE));

  return (
    <>
      <div className="card">
        <h2>{can(PERMISSIONS.TASK_READ_ALL) ? 'Todas as tarefas' : 'Minhas tarefas'}</h2>
        {error && <div className="alert">{error}</div>}

        <Can permission={PERMISSIONS.TASK_CREATE}>
          <form className="form-row" onSubmit={handleCreate}>
            <label>
              Título
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </label>
            <label>
              Descrição
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </label>
            <label>
              Responsável
              <select value={form.assigneeId} onChange={(e) => setForm({ ...form, assigneeId: e.target.value })} required>
                <option value="">Selecione</option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn">Criar tarefa</button>
          </form>
        </Can>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Descrição</th>
              <th>Responsável</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 && (
              <tr>
                <td colSpan={5} className="muted">
                  Nenhuma tarefa.
                </td>
              </tr>
            )}
            {tasks.map((t) => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td className="desc">{t.description || '—'}</td>
                <td className="nowrap">{nameOf(t.assigneeId)}</td>
                <td className="nowrap">
                  <span className={`badge status-${t.status}`}>{t.status === 'CONCLUIDA' ? 'Concluída' : 'Pendente'}</span>
                </td>
                <td className="actions">
                  {canCompleteTask(t) && (
                    <button className="btn btn-success btn-sm" onClick={() => run(() => api(`/tasks/${t.id}/complete`, { method: 'PATCH' }))}>
                      Concluir
                    </button>
                  )}
                  <Can permission={PERMISSIONS.TASK_UPDATE}>
                    {t.status === 'CONCLUIDA' && (
                      <button className="btn btn-ghost btn-sm" onClick={() => run(() => api(`/tasks/${t.id}`, { method: 'PATCH', body: { status: 'PENDENTE' } }))}>
                        Reabrir
                      </button>
                    )}
                    <select
                      value={t.assigneeId}
                      title="Reatribuir"
                      onChange={(e) => run(() => api(`/tasks/${t.id}`, { method: 'PATCH', body: { assigneeId: Number(e.target.value) } }))}
                    >
                      {people.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </Can>
                  <Can permission={PERMISSIONS.TASK_DELETE}>
                    <button className="btn btn-danger btn-sm" onClick={() => run(() => api(`/tasks/${t.id}`, { method: 'DELETE' }))}>
                      Excluir
                    </button>
                  </Can>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
