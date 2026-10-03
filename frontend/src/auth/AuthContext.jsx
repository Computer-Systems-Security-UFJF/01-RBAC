import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, getToken, setToken, clearToken } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(Boolean(getToken()));

  // Ao recarregar a página, revalida o token com o backend.
  useEffect(() => {
    if (!getToken()) return;
    api('/auth/me')
      .then(({ user, permissions }) => {
        setUser(user);
        setPermissions(permissions);
      })
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api('/auth/login', { method: 'POST', body: { email, password } });
    setToken(data.token);
    setUser(data.user);
    setPermissions(data.permissions);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setPermissions([]);
  }, []);

  const can = useCallback((permission) => permissions.includes(permission), [permissions]);

  const value = useMemo(
    () => ({ user, permissions, loading, login, logout, can, isAuthenticated: Boolean(user) }),
    [user, permissions, loading, login, logout, can]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
