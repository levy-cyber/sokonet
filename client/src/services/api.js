import axios from 'axios';

const getDefaultApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl;
  }

  const hostname = window.location.hostname;
  const localHosts = ['localhost', '127.0.0.1', '::1', '0.0.0.0'];
  const isLocalHost = localHosts.includes(hostname) || hostname.endsWith('.localhost');

  if (isLocalHost) {
    return `${window.location.protocol}//localhost:5000/api`;
  }

  return '/api';
};

const defaultApiUrl = getDefaultApiUrl();
console.debug('Netsoko API base URL:', defaultApiUrl);

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
