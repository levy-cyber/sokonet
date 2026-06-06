import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ShoppingCart, Heart, Share2 } from 'lucide-react-native';

export default function ProductDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    // Mock data - replace with API call
    setTimeout(() => {
      setProduct({
        _id: id,
        name: 'iPhone 15 Pro Max',
        description: 'The most powerful iPhone ever. Featuring A17 Pro chip, titanium design, and advanced camera system.',
        price: 185000,
        category: 'electronics',
        images: [
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600',
        ],
        rating: 4.8,
        reviews: 234,
        stock: 15,
        seller: {
          name: 'TechStore Kenya',
          rating: 4.9,
        },
      });
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      <ScrollView className="flex-1">
        <Image
          source={{ uri: product.images[0] }}
          className="w-full h-72"
          resizeMode="cover"
        />

        <View className="p-6">
          <Text className="text-white text-2xl font-bold mb-2">{product.name}</Text>
          <Text className="text-green-400 text-3xl font-bold mb-4">
            KES {product.price.toLocaleString()}
          </Text>

          <View className="flex-row items-center gap-2 mb-4">
            <Text className="text-yellow-400">⭐ {product.rating}</Text>
            <Text className="text-gray-400">({product.reviews} reviews)</Text>
          </View>

          <Text className="text-gray-300 mb-6">{product.description}</Text>

          <View className="bg-gray-800 rounded-xl p-4 mb-6">
            <Text className="text-white font-semibold mb-2">Seller</Text>
            <Text className="text-gray-300">{product.seller.name}</Text>
            <Text className="text-yellow-400 text-sm">⭐ {product.seller.rating}</Text>
          </View>

          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-gray-400">Quantity:</Text>
            <View className="flex-row items-center gap-4">
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-800 rounded-lg p-3"
              >
                <Text className="text-white text-xl">-</Text>
              </TouchableOpacity>
              <Text className="text-white text-xl font-semibold">{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                className="bg-gray-800 rounded-lg p-3"
              >
                <Text className="text-white text-xl">+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row gap-4">
            <TouchableOpacity className="flex-1 bg-gray-800 rounded-xl p-4 flex-row items-center justify-center gap-2">
              <Heart size={20} color="#9CA3AF" />
              <Text className="text-white">Save</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-green-500 rounded-xl p-4 flex-row items-center justify-center gap-2">
              <ShoppingCart size={20} color="#fff" />
              <Text className="text-white font-semibold">Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
