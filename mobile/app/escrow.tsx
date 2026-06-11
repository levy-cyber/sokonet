import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Shield, Clock, CheckCircle, XCircle } from 'lucide-react-native';

interface EscrowTransaction {
  _id: string;
  orderId: string;
  amount: number;
  status: 'held' | 'released' | 'refunded';
  buyer: { name: string; avatar: string };
  seller: { name: string; avatar: string };
  product: string;
  createdAt: string;
}

export default function Escrow() {
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock data - replace with API call
    setTransactions([
      {
        _id: '1',
        orderId: 'ORD-001',
        amount: 185000,
        status: 'held',
        buyer: { name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
        seller: { name: 'TechStore Kenya', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100' },
        product: 'iPhone 15 Pro Max',
        createdAt: '2024-01-15',
      },
      {
        _id: '2',
        orderId: 'ORD-002',
        amount: 45000,
        status: 'released',
        buyer: { name: 'Jane Smith', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
        seller: { name: 'Audio World', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
        product: 'Sony WH-1000XM5',
        createdAt: '2024-01-10',
      },
    ]);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'held':
        return <Clock size={20} color="#FF9800" />;
      case 'released':
        return <CheckCircle size={20} color="#00C853" />;
      case 'refunded':
        return <XCircle size={20} color="#EF5350" />;
      default:
        return <Shield size={20} color="#9CA3AF" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'held':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'released':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'refunded':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.status === filter);

  return (
    <View className="flex-1 bg-gray-900">
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text className="text-white text-2xl font-bold mb-4">Escrow Accounts</Text>

          <View className="flex-row gap-2 mb-6 flex-wrap">
            {['all', 'held', 'released', 'refunded'].map((status) => (
              <View
                key={status}
                className={`px-4 py-2 rounded-lg ${
                  filter === status ? 'bg-green-500' : 'bg-gray-800'
                }`}
              >
                <Text className={`capitalize ${
                  filter === status ? 'text-white' : 'text-gray-400'
                }`}>
                  {status}
                </Text>
              </View>
            ))}
          </View>

          {filteredTransactions.map((transaction) => (
            <View key={transaction._id} className="bg-gray-800 rounded-xl p-4 mb-4">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center gap-2">
                  {getStatusIcon(transaction.status)}
                  <Text className="text-white font-semibold">{transaction.orderId}</Text>
                </View>
                <View className={`px-3 py-1 rounded-full border ${getStatusColor(transaction.status)}`}>
                  <Text className="capitalize text-xs">{transaction.status}</Text>
                </View>
              </View>

              <Text className="text-gray-300 mb-2">{transaction.product}</Text>
              <Text className="text-green-400 font-bold mb-3">
                KES {transaction.amount.toLocaleString()}
              </Text>

              <View className="flex-row justify-between items-center border-t border-gray-700 pt-3">
                <View className="flex-row items-center gap-2">
                  <Text className="text-gray-400 text-sm">Buyer:</Text>
                  <Text className="text-white text-sm">{transaction.buyer.name}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-gray-400 text-sm">Seller:</Text>
                  <Text className="text-white text-sm">{transaction.seller.name}</Text>
                </View>
              </View>
            </View>
          ))}

          <View className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mt-4">
            <View className="flex-row items-start gap-3">
              <Shield size={24} color="#00C853" />
              <View>
                <Text className="text-white font-semibold mb-2">How Escrow Works</Text>
                <Text className="text-gray-400 text-sm">
                  • Buyer pays into escrow - funds are securely held
                </Text>
                <Text className="text-gray-400 text-sm">
                  • Seller ships the product to buyer
                </Text>
                <Text className="text-gray-400 text-sm">
                  • Buyer confirms receipt and satisfaction
                </Text>
                <Text className="text-gray-400 text-sm">
                  • Funds are released to seller
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
