import { createContext, useEffect, useMemo, useState } from 'react';
import { login as loginService, register as registerService } from '../services/authService.js';
import { api } from '../services/api.js';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sokonet_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('sokonet_token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('sokonet_token', token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem('sokonet_token');
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sokonet_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sokonet_user');
    }
  }, [user]);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginService(credentials);
      setUser(response);
      setToken(response.token);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (details) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerService(details);
      setUser(response);
      setToken(response.token);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
  };

  const authState = useMemo(
    () => ({ user, token, loading, error, login, logout, register, isAuthenticated: Boolean(token) }),
    [user, token, loading, error]
  );

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
}
