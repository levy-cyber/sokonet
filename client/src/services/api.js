import axios from 'axios';

const PRODUCTION_API_URL = 'https://sokonet-api-production.up.railway.app/api';

const getDefaultApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (envUrl) {
    return envUrl;
  }

  const hostname = window.location.hostname;
  const localHosts = ['localhost', '127.0.0.1', '::1', '0.0.0.0'];
  const isLocal = localHosts.includes(hostname) || hostname.endsWith('.localhost');
  const isProductionHost = hostname === 'nettsoko.com' || hostname === 'www.nettsoko.com' || hostname.endsWith('.nettsoko.com');

  if (isProductionHost) {
    return PRODUCTION_API_URL;
  }

  const fallbackUrl = isLocal
    ? `${window.location.protocol}//localhost:5000/api`
    : `${window.location.origin}/api`;

  if (!isLocal && !isProductionHost) {
    console.warn(
      'Netsoko API base URL fallback: VITE_API_URL is not set. Using same-origin /api endpoint.',
    );
  }

  return fallbackUrl;
};

const defaultApiUrl = getDefaultApiUrl();
console.debug('Netsoko API base URL:', defaultApiUrl);

const api = axios.create({
  baseURL: defaultApiUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 20000,
});

export const API_BASE_URL = defaultApiUrl; // Export for debug display in auth pages

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Netsoko_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.debug('API request:', config.method, config.baseURL + config.url, config.data);
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    console.debug('API response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('Netsoko_token');
      localStorage.removeItem('Netsoko_user');
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.request ? `Network Error: Unable to reach ${defaultApiUrl}` : error.message) ||
      'API request failed';

    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status;
    normalizedError.config = error.config;
    return Promise.reject(normalizedError);
  },
);

export default api;
