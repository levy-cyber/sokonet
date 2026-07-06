import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('Netsoko_user');
    const storedToken = localStorage.getItem('Netsoko_token');
    
    if (storedUser && storedToken) {
      const userData = JSON.parse(storedUser);
      // Ensure roles is an array and set active role if not set
      if (!userData.roles || !Array.isArray(userData.roles)) {
        userData.roles = [userData.role || 'buyer'];
      }
      if (!userData.activeRole) {
        userData.activeRole = userData.roles[0] || 'buyer';
      }
      userData.isEmailVerified = userData.isEmailVerified || false;
      setUser(userData);
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
          role: data.role || 'buyer',
          roles: data.roles || [data.role || 'buyer'],
          activeRole: data.activeRole || data.role || 'buyer',
          avatar: data.avatar,
          isEmailVerified: data.isEmailVerified || false,
        };
        setUser(userData);
        localStorage.setItem('Netsoko_token', data.token);
        localStorage.setItem('Netsoko_user', JSON.stringify(userData));
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed. Please try again.');
    }
  };

  const register = async (name, email, phone, password, selectedRoles) => {
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        phone,
        password,
        roles: selectedRoles.length > 0 ? selectedRoles : ['buyer'],
        activeRole: selectedRoles[0] || 'buyer',
      });
      if (data.success) {
        const userData = {
          _id: data._id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role || 'buyer',
          roles: data.roles || selectedRoles || ['buyer'],
          activeRole: data.activeRole || selectedRoles[0] || 'buyer',
          avatar: data.avatar,
          isEmailVerified: data.isEmailVerified || false,
        };
        setUser(userData);
        localStorage.setItem('Netsoko_token', data.token);
        localStorage.setItem('Netsoko_user', JSON.stringify(userData));
        // Automatically send OTP after registration
        try {
          await api.post('/auth/send-otp', { email });
        } catch (otpErr) {
          console.log('OTP send failed (non-blocking):', otpErr.message);
        }
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || error.message || 'Registration failed.');
    }
  };

  const switchRole = (newRole) => {
    if (user && user.roles && user.roles.includes(newRole)) {
      const updatedUser = {
        ...user,
        activeRole: newRole,
        role: newRole, // Keep role for backward compatibility
      };
      setUser(updatedUser);
      localStorage.setItem('Netsoko_user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('Netsoko_token');
    localStorage.removeItem('Netsoko_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};