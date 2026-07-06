import api from './api';

const escrowService = {
  getAllEscrowTransactions: async () => {
    const response = await api.get('/escrow');
    return response.data;
  },

  getEscrowById: async (id) => {
    const response = await api.get(`/escrow/${id}`);
    return response.data;
  },

  createEscrow: async (orderId, amount) => {
    const response = await api.post('/escrow', { orderId, amount });
    return response.data;
  },

  releaseEscrow: async (id) => {
    const response = await api.put(`/escrow/${id}/release`);
    return response.data;
  },

  refundEscrow: async (id, reason) => {
    const response = await api.put(`/escrow/${id}/refund`, { reason });
    return response.data;
  },

  getEscrowByOrder: async (orderId) => {
    const response = await api.get(`/escrow/order/${orderId}`);
    return response.data;
  },
};

export default escrowService;
