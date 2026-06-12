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
      const userData = JSON.parse(storedUser);
      // Ensure roles is an array and set active role if not set
      if (!userData.roles || !Array.isArray(userData.roles)) {
        userData.roles = [userData.role || 'buyer'];
      }
      if (!userData.activeRole) {
        userData.activeRole = userData.roles[0] || 'buyer';
      }
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success) {
        // Check if email is verified
        const profileResponse = await api.get('/auth/profile');
        if (!profileResponse.data.isEmailVerified) {
          return { 
            success: false, 
            needsVerification: true, 
            email: email,
            message: 'Please verify your email before logging in' 
          };
        }
        
        const userData = {
          _id: data._id,
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          role: data.role || 'buyer',
          roles: data.roles || [data.role || 'buyer'],
          activeRole: data.activeRole || data.role || 'buyer',
          avatar: data.avatar,
        };
        setUser(userData);
        localStorage.setItem('sokonet_token', data.token);
        localStorage.setItem('sokonet_user', JSON.stringify(userData));
        return { success: true };
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
        // Send OTP for email verification
        const otpResponse = await api.post('/auth/send-otp', { email });
        
        if (otpResponse.data.success) {
          // Return user data but don't log them in
          const userData = {
            _id: data._id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: data.role || 'buyer',
            roles: data.roles || selectedRoles || ['buyer'],
            activeRole: data.activeRole || selectedRoles[0] || 'buyer',
            avatar: data.avatar,
          };
          
          // Store temp data for verification
          localStorage.setItem('sokonet_pending_user', JSON.stringify(userData));
          localStorage.setItem('sokonet_token', data.token); // Store token for OTP verification
          
          return { 
            success: true, 
            needsVerification: true,
            email: email,
            otp: otpResponse.data.otp // For development
          };
        }
      }
      throw new Error(data.message || 'Registration failed');
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || error.message || 'Registration failed.');
    }
  };

  const verifyEmail = async (email, otp) => {
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      if (data.success) {
        // Get the pending user data
        const pendingUser = JSON.parse(localStorage.getItem('sokonet_pending_user') || '{}');
        
        // Now log the user in after verification
        const userData = {
          _id: pendingUser._id,
          name: pendingUser.name,
          email: pendingUser.email,
          phone: pendingUser.phone,
          role: pendingUser.role,
          roles: pendingUser.roles,
          activeRole: pendingUser.activeRole,
          avatar: pendingUser.avatar,
        };
        
        setUser(userData);
        localStorage.setItem('sokonet_user', JSON.stringify(userData));
        localStorage.removeItem('sokonet_pending_user');
        
        return { success: true };
      } else {
        throw new Error(data.message || 'Verification failed');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Verification failed');
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
      localStorage.setItem('sokonet_user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sokonet_token');
    localStorage.removeItem('sokonet_user');
    localStorage.removeItem('sokonet_pending_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, switchRole, verifyEmail }}>
      {children}
    </AuthContext.Provider>
  );
};