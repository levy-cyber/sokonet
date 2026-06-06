import { api } from './api.js';

export const fetchOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const createOrder = async (productId, notes) => {
  const response = await api.post('/orders', { productId, notes });
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/orders/${orderId}/status`, { status });
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};
