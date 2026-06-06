import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { fetchProducts } from '../services/marketplaceService';

export default function MarketplaceScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const result = await fetchProducts();
        setProducts(result.products || []);
      } catch (error) {
        console.warn('Failed to load products', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <View className="flex-1 bg-slate-50 px-5 py-6">
      <Text className="text-2xl font-bold text-slate-900 mb-4">Marketplace</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => (
          <View className="mb-4 rounded-3xl bg-white p-4 shadow-sm border border-slate-200">
            <Text className="text-lg font-semibold text-slate-900">{item.title || item.name}</Text>
            <Text className="text-slate-500 mt-1">{item.description}</Text>
            <Text className="mt-3 text-brand-600 font-semibold">KES {item.price}</Text>
          </View>
        )}
        ListEmptyComponent={
          loading ? <Text className="text-slate-500">Loading products...</Text> : <Text className="text-slate-500">No products found.</Text>
        }
      />
    </View>
  );
}
