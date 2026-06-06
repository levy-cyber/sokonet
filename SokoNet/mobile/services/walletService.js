import { api } from './api';

export async function fetchWallet() {
  const response = await api.get('/wallet');
  return response.data;
}

export async function fetchTransactions() {
  const response = await api.get('/wallet/transactions');
  return response.data;
}

export async function depositFunds({ amount, phone }) {
  const response = await api.post('/wallet/deposit', { amount, phone });
  return response.data;
}

export async function withdrawFunds({ amount, phone }) {
  const response = await api.post('/wallet/withdraw', { amount, phone });
  return response.data;
}
