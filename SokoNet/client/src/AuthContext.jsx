import { createContext, useMemo, useState } from 'react';
import { login as loginService, register as registerService } from '../services/authService.js';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginService(credentials);
      setUser(response.user);
      setToken(response.token);
      return response;
    } catch (err) {
      setError(err.message);
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
      setUser(response.user);
      setToken(response.token);
      return response;
    } catch (err) {
      setError(err.message);
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
