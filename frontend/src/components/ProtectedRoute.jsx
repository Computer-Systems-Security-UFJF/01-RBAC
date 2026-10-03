import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function ProtectedRoute({ permission, children }) {
  const { isAuthenticated, loading, can } = useAuth();

  if (loading) return <p className="muted">Carregando...</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (permission && !can(permission)) {
    return (
      <div className="card error">
        <h2>Acesso negado</h2>
        <p>Seu papel não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return children;
}
