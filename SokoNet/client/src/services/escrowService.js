import { api } from './api.js';

export const fetchEscrows = async () => {
  const response = await api.get('/escrow');
  return response.data;
};

export const createEscrow = async (orderId) => {
  const response = await api.post('/escrow', { orderId });
  return response.data;
};

export const releaseEscrow = async (id) => {
  const response = await api.patch(`/escrow/${id}/release`);
  return response.data;
};

export const refundEscrow = async (id) => {
  const response = await api.patch(`/escrow/${id}/refund`);
  return response.data;
};
