import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('sokonet_user');
    const storedToken = localStorage.getItem('sokonet_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success) {
        const userData = {
          _id: data._id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          avatar: data.avatar,
        };
        setUser(userData);
        localStorage.setItem('sokonet_token', data.token);
        localStorage.setItem('sokonet_user', JSON.stringify(userData));
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed. Please try again.');
    }
  };

  const register = async (name, email, phone, password, role) => {
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        phone,
        password,
        role,
      });
      if (data.success) {
        const userData = {
          _id: data._id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          avatar: data.avatar,
        };
        setUser(userData);
        localStorage.setItem('sokonet_token', data.token);
        localStorage.setItem('sokonet_user', JSON.stringify(userData));
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || error.message || 'Registration failed.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sokonet_token');
    localStorage.removeItem('sokonet_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
