import { api } from './api.js';

export const getWallet = async () => {
  const response = await api.get('/wallet');
  return response.data;
};

export const getTransactions = async () => {
  const response = await api.get('/wallet/transactions');
  return response.data;
};

export const deposit = async (amount, phone) => {
  const response = await api.post('/wallet/deposit', { amount, phone });
  return response.data;
};

export const withdraw = async (amount, phone) => {
  const response = await api.post('/wallet/withdraw', { amount, phone });
  return response.data;
};
