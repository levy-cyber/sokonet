import axios from 'axios';

const defaultApiUrl = import.meta.env.VITE_API_URL || ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000/api' : '/api');

const api = axios.create({
  baseURL: defaultApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Netsoko_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect if unauthorized
      localStorage.removeItem('Netsoko_token');
      localStorage.removeItem('Netsoko_user');
    }
    return Promise.reject(error);
  }
);

export default api;
