import { api } from './api';

export async function fetchProducts() {
  const response = await api.get('/products');
  return response.data || [];
}
