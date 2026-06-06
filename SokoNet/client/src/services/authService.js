import { api } from './api.js';

export async function login({ email, password }) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

export async function register({ name, email, password, phone, role }) {
  const response = await api.post('/auth/register', { name, email, password, phone, role });
  return response.data;
}
