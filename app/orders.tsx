import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react-native';

interface Order {
  _id: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock data - replace with API call
    setOrders([
      {
        _id: 'ORD-001',
        items: [{ name: 'iPhone 15 Pro Max', quantity: 1, price: 185000 }],
        totalAmount: 185000,
        status: 'delivered',
        createdAt: '2024-01-15',
      },
      {
        _id: 'ORD-002',
        items: [{ name: 'Sony WH-1000XM5', quantity: 1, price: 45000 }],
        totalAmount: 45000,
        status: 'shipped',
        createdAt: '2024-01-18',
      },
      {
        _id: 'ORD-003',
        items: [{ name: 'Nike Air Max', quantity: 2, price: 18500 }],
        totalAmount: 37000,
        status: 'processing',
        createdAt: '2024-01-20',
      },
    ]);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={20} color="#00C853" />;
      case 'shipped':
        return <Truck size={20} color="#2196F3" />;
      case 'processing':
        return <Clock size={20} color="#FF9800" />;
      default:
        return <Package size={20} color="#9CA3AF" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/10 text-green-400';
      case 'shipped':
        return 'bg-blue-500/10 text-blue-400';
      case 'processing':
        return 'bg-yellow-500/10 text-yellow-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  return (
    <View className="flex-1 bg-gray-900">
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text className="text-white text-2xl font-bold mb-4">My Orders</Text>

          <View className="flex-row gap-2 mb-6 flex-wrap">
            {['all', 'processing', 'shipped', 'delivered'].map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg ${
                  filter === status ? 'bg-green-500' : 'bg-gray-800'
                }`}
              >
                <Text className={`capitalize ${filter === status ? 'text-white' : 'text-gray-400'}`}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredOrders.map((order) => (
            <View key={order._id} className="bg-gray-800 rounded-xl p-4 mb-4">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center gap-2">
                  {getStatusIcon(order.status)}
                  <Text className="text-white font-semibold">{order._id}</Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  <Text className="capitalize text-xs">{order.status}</Text>
                </View>
              </View>

              {order.items.map((item, index) => (
                <View key={index} className="mb-2">
                  <Text className="text-white">{item.name}</Text>
                  <Text className="text-gray-400 text-sm">
                    Qty: {item.quantity} × KES {item.price.toLocaleString()}
                  </Text>
                </View>
              ))}

              <View className="border-t border-gray-700 pt-3 mt-3">
                <Text className="text-green-400 font-bold">
                  Total: KES {order.totalAmount.toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
