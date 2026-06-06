import { api } from './api.js';

export const fetchShops = async () => {
  const response = await api.get('/shops');
  return response.data;
};

export const createShop = async (shopData) => {
  const response = await api.post('/shops', shopData);
  return response.data;
};

export const fetchShopProducts = async (shopId) => {
  const response = await api.get(`/shops/${shopId}/products`);
  return response.data;
};
