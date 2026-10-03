import { useAuth } from '../auth/AuthContext.jsx';

// Renderiza os filhos apenas se o usuário possuir a permissão.
export default function Can({ permission, fallback = null, children }) {
  const { can } = useAuth();
  return can(permission) ? children : fallback;
}
