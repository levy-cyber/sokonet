import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ArrowUpRight, ArrowDownLeft, History, Smartphone, CreditCard } from 'lucide-react-native';

interface Transaction {
  _id: string;
  type: 'deposit' | 'withdrawal' | 'payment' | 'refund';
  amount: number;
  description: string;
  status: 'completed' | 'pending';
  createdAt: string;
}

export default function Wallet() {
  const [activeTab, setActiveTab] = useState('overview');
  const [amount, setAmount] = useState('');
  const [wallet] = useState({
    balance: 125000,
    currency: 'KES',
  });

  const [transactions] = useState<Transaction[]>([
    {
      _id: '1',
      type: 'deposit',
      amount: 50000,
      description: 'M-Pesa Deposit',
      status: 'completed',
      createdAt: '2024-01-20',
    },
    {
      _id: '2',
      type: 'withdrawal',
      amount: 20000,
      description: 'Bank Withdrawal',
      status: 'completed',
      createdAt: '2024-01-18',
    },
    {
      _id: '3',
      type: 'payment',
      amount: 185000,
      description: 'Order Payment',
      status: 'completed',
      createdAt: '2024-01-15',
    },
  ]);

  const handleDeposit = () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    Alert.alert('Success', `Deposit of KES ${Number(amount).toLocaleString()} initiated via M-Pesa`);
    setAmount('');
  };

  const handleWithdraw = () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (Number(amount) > wallet.balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }
    Alert.alert('Success', `Withdrawal of KES ${Number(amount).toLocaleString()} requested`);
    setAmount('');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'refund':
        return <ArrowDownLeft size={20} color="#00C853" />;
      case 'withdrawal':
      case 'payment':
        return <ArrowUpRight size={20} color="#EF5350" />;
      default:
        return <History size={20} color="#9CA3AF" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'refund':
        return 'text-green-400';
      case 'withdrawal':
      case 'payment':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <View className="flex-1 bg-gray-900">
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text className="text-white text-2xl font-bold mb-6">Digital Wallet</Text>

          <View className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 mb-6">
            <Text className="text-white text-lg mb-2">Balance</Text>
            <Text className="text-white text-4xl font-bold">
              KES {wallet.balance.toLocaleString()}
            </Text>
          </View>

          <View className="flex-row gap-3 mb-6">
            {['overview', 'deposit', 'withdraw'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`flex-1 py-3 rounded-lg ${
                  activeTab === tab ? 'bg-green-500' : 'bg-gray-800'
                }`}
              >
                <Text className={`text-center capitalize ${
                  activeTab === tab ? 'text-white' : 'text-gray-400'
                }`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'deposit' && (
            <View className="bg-gray-800 rounded-xl p-6 mb-6">
              <Text className="text-white text-lg font-semibold mb-4">Deposit Funds</Text>
              <TextInput
                className="bg-gray-700 text-white rounded-lg p-4 mb-4"
                placeholder="Enter amount"
                placeholderTextColor="#6B7280"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              <TouchableOpacity className="bg-gray-700 rounded-xl p-4 mb-3 flex-row items-center gap-3">
                <Smartphone size={24} color="#00C853" />
                <View>
                  <Text className="text-white font-medium">M-Pesa</Text>
                  <Text className="text-gray-400 text-sm">Instant deposit</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity className="bg-gray-700 rounded-xl p-4 mb-4 flex-row items-center gap-3">
                <CreditCard size={24} color="#2196F3" />
                <View>
                  <Text className="text-white font-medium">Card Payment</Text>
                  <Text className="text-gray-400 text-sm">Visa/Mastercard</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeposit} className="bg-green-500 rounded-lg p-4">
                <Text className="text-white text-center font-semibold">Deposit Now</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'withdraw' && (
            <View className="bg-gray-800 rounded-xl p-6 mb-6">
              <Text className="text-white text-lg font-semibold mb-4">Withdraw Funds</Text>
              <TextInput
                className="bg-gray-700 text-white rounded-lg p-4 mb-4"
                placeholder="Enter amount"
                placeholderTextColor="#6B7280"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              <Text className="text-gray-400 text-sm mb-4">
                Available: KES {wallet.balance.toLocaleString()}
              </Text>
              <TouchableOpacity className="bg-gray-700 rounded-xl p-4 mb-3 flex-row items-center gap-3">
                <Smartphone size={24} color="#00C853" />
                <View>
                  <Text className="text-white font-medium">M-Pesa</Text>
                  <Text className="text-gray-400 text-sm">To your phone</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity className="bg-gray-700 rounded-xl p-4 mb-4 flex-row items-center gap-3">
                <CreditCard size={24} color="#2196F3" />
                <View>
                  <Text className="text-white font-medium">Bank Transfer</Text>
                  <Text className="text-gray-400 text-sm">1-3 business days</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleWithdraw} className="bg-green-500 rounded-lg p-4">
                <Text className="text-white text-center font-semibold">Withdraw Now</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'overview' && (
            <View className="bg-gray-800 rounded-xl p-6">
              <Text className="text-white text-lg font-semibold mb-4">Transaction History</Text>
              {transactions.map((transaction) => (
                <View key={transaction._id} className="flex-row items-center justify-between py-3 border-b border-gray-700">
                  <View className="flex-row items-center gap-3">
                    <View className="bg-gray-700 rounded-lg p-2">
                      {getTransactionIcon(transaction.type)}
                    </View>
                    <View>
                      <Text className="text-white font-medium">{transaction.description}</Text>
                      <Text className="text-gray-400 text-sm">{transaction.createdAt}</Text>
                    </View>
                  </View>
                  <Text className={getTransactionColor(transaction.type) + ' font-semibold'}>
                    {transaction.type === 'deposit' || transaction.type === 'refund' ? '+' : '-'}
                    KES {transaction.amount.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
