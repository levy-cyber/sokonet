import { api } from './api';

function normalizeAuthResponse(data) {
  return {
    user: {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    },
    token: data.token,
  };
}

export async function login({ email, password }) {
  const response = await api.post('/auth/login', { email, password });
  return normalizeAuthResponse(response.data);
}

export async function register({ name, email, password }) {
  const response = await api.post('/auth/register', { name, email, password });
  return normalizeAuthResponse(response.data);
}
