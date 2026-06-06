import { api } from './api.js';

export const fetchMessages = async (userId) => {
  const response = await api.get('/chat', { params: { userId } });
  return response.data;
};

export const sendMessage = async (recipientId, text) => {
  const response = await api.post('/chat', { recipientId, text });
  return response.data;
};
