import api from './api';

const walletService = {
  getWallet: async () => {
    const response = await api.get('/wallet');
    return response.data;
  },

  getTransactions: async () => {
    const response = await api.get('/wallet/transactions');
    return response.data;
  },

  deposit: async (amount, method = 'mpesa') => {
    const response = await api.post('/wallet/deposit', { amount, method });
    return response.data;
  },

  withdraw: async (amount, method = 'mpesa') => {
    const response = await api.post('/wallet/withdraw', { amount, method });
    return response.data;
  },

  transfer: async (recipientId, amount) => {
    const response = await api.post('/wallet/transfer', { recipientId, amount });
    return response.data;
  },

  getTransactionById: async (id) => {
    const response = await api.get(`/wallet/transactions/${id}`);
    return response.data;
  },
};

export default walletService;
