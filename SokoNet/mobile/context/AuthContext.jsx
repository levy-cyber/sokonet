import React, { createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/authService';
import { setAuthToken } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const storedUser = await AsyncStorage.getItem('sokonet_user');
        const storedToken = await AsyncStorage.getItem('sokonet_token');
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          setAuthToken(storedToken);
        }
      } catch (error) {
        console.warn('Failed to restore session', error);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  const signIn = async (credentials) => {
    try {
      const result = await authService.login(credentials);
      setUser(result.user);
      setToken(result.token);
      setAuthToken(result.token);
      await AsyncStorage.setItem('sokonet_user', JSON.stringify(result.user));
      await AsyncStorage.setItem('sokonet_token', result.token);
      return true;
    } catch (error) {
      Alert.alert('Login failed', error.message || 'Unable to login');
      return false;
    }
  };

  const signUp = async (data) => {
    try {
      const result = await authService.register(data);
      setUser(result.user);
      setToken(result.token);
      setAuthToken(result.token);
      await AsyncStorage.setItem('sokonet_user', JSON.stringify(result.user));
      await AsyncStorage.setItem('sokonet_token', result.token);
      return true;
    } catch (error) {
      Alert.alert('Registration failed', error.message || 'Unable to register');
      return false;
    }
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    await AsyncStorage.removeItem('sokonet_user');
    await AsyncStorage.removeItem('sokonet_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
