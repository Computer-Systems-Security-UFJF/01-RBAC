import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { PERMISSIONS, ROLE_LABELS } from '../rbac/permissions.js';
import Can from './Can.jsx';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <div className="brand">RBAC · Gestão de Tarefas</div>
      {isAuthenticated && (
        <>
          <nav>
            <NavLink to="/tasks">Tarefas</NavLink>
            <Can permission={PERMISSIONS.USER_READ}>
              <NavLink to="/users">Usuários</NavLink>
            </Can>
          </nav>
          <div className="user-info">
            <span>{user.name}</span>
            <span className={`badge role-${user.role}`}>{ROLE_LABELS[user.role]}</span>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </>
      )}
    </header>
  );
}
