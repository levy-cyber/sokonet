import { api } from './api.js';

export const fetchAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};
