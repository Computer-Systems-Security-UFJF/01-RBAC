import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

const QUICK_USERS = [
  { label: 'Entrar como Diretor', email: 'diretor@empresa.com' },
  { label: 'Entrar como Coordenador', email: 'coord@empresa.com' },
  { label: 'Entrar como Funcionário', email: 'func@empresa.com' },
];

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to="/tasks" replace />;

  async function doLogin(e, p) {
    setBusy(true);
    setError('');
    try {
      await login(e, p);
      navigate('/tasks');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card login-box">
      <h2>Entrar</h2>
      {error && <div className="alert">{error}</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          doLogin(email, password);
        }}
      >
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn" disabled={busy}>
          Entrar
        </button>
      </form>

      <p className="muted">Atalhos para demonstração (senha: 123456):</p>
      <div className="quick-login">
        {QUICK_USERS.map((u) => (
          <button key={u.email} className="btn btn-ghost btn-sm" disabled={busy} onClick={() => doLogin(u.email, '123456')}>
            {u.label}
          </button>
        ))}
      </div>
    </div>
  );
}
