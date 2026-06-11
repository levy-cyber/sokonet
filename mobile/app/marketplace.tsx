import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter } from 'lucide-react-native';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}

export default function Marketplace() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredProducts(
        products.filter(p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    setLoading(true);
    // Mock data - replace with API call
    setTimeout(() => {
      setProducts([
        {
          _id: '1',
          name: 'iPhone 15 Pro Max',
          price: 185000,
          image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
          category: 'electronics',
          rating: 4.8,
        },
        {
          _id: '2',
          name: 'Samsung Galaxy S24',
          price: 175000,
          image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
          category: 'electronics',
          rating: 4.7,
        },
        {
          _id: '3',
          name: 'Nike Air Max',
          price: 18500,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
          category: 'fashion',
          rating: 4.6,
        },
        {
          _id: '4',
          name: 'Sony WH-1000XM5',
          price: 45000,
          image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
          category: 'electronics',
          rating: 4.9,
        },
      ]);
      setFilteredProducts([
        {
          _id: '1',
          name: 'iPhone 15 Pro Max',
          price: 185000,
          image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
          category: 'electronics',
          rating: 4.8,
        },
        {
          _id: '2',
          name: 'Samsung Galaxy S24',
          price: 175000,
          image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
          category: 'electronics',
          rating: 4.7,
        },
        {
          _id: '3',
          name: 'Nike Air Max',
          price: 18500,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
          category: 'fashion',
          rating: 4.6,
        },
        {
          _id: '4',
          name: 'Sony WH-1000XM5',
          price: 45000,
          image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
          category: 'electronics',
          rating: 4.9,
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <View className="flex-1 bg-gray-900">
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text className="text-white text-2xl font-bold mb-4">Marketplace</Text>

          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-gray-800 rounded-lg p-3 flex-row items-center">
              <Search size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-2 text-white"
                placeholder="Search products..."
                placeholderTextColor="#6B7280"
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </View>
            <TouchableOpacity className="bg-gray-800 rounded-lg p-3">
              <Filter size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View className="flex-1 justify-center items-center py-12">
              <ActivityIndicator size="large" color="#00C853" />
            </View>
          ) : (
            <View className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <TouchableOpacity
                  key={product._id}
                  onPress={() => router.push(`/productDetails?id=${product._id}`)}
                  className="bg-gray-800 rounded-xl overflow-hidden"
                >
                  <Image
                    source={{ uri: product.image }}
                    className="w-full h-32"
                    resizeMode="cover"
                  />
                  <View className="p-3">
                    <Text className="text-white font-semibold mb-1" numberOfLines={1}>
                      {product.name}
                    </Text>
                    <Text className="text-green-400 font-bold">KES {product.price.toLocaleString()}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
