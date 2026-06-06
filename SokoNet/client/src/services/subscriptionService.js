import { api } from './api.js';

export const getSubscription = async () => {
  const response = await api.get('/subscriptions');
  return response.data;
};

export const createSubscription = async (plan, expiresAt) => {
  const response = await api.post('/subscriptions', { plan, expiresAt });
  return response.data;
};

export const getAllSubscriptions = async () => {
  const response = await api.get('/subscriptions/all');
  return response.data;
};
