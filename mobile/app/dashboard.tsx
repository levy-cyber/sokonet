import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  Wallet, 
  Package, 
  MessageCircle, 
  TrendingUp,
  User,
  LogOut,
  AlertTriangle
} from 'lucide-react-native';

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const menuItems = [
    { icon: ShoppingBag, label: 'Marketplace', route: '/marketplace', color: '#00C853' },
    { icon: Wallet, label: 'Wallet', route: '/wallet', color: '#2196F3' },
    { icon: Package, label: 'My Orders', route: '/orders', color: '#FF9800' },
    { icon: MessageCircle, label: 'Messages', route: '/chat', color: '#9C27B0' },
    { icon: AlertTriangle, label: 'SOS', route: '/sos', color: '#F44336' },
    { icon: TrendingUp, label: 'Jobs', route: '/jobs', color: '#E91E63' },
    { icon: User, label: 'Profile', route: '/profile', color: '#00BCD4' },
  ];

  return (
    <View className="flex-1 bg-gray-900">
      <ScrollView className="flex-1">
        <View className="p-6">
          <View className="flex-row justify-between items-center mb-8">
            <View>
              <Text className="text-white text-2xl font-bold">Welcome back!</Text>
              <Text className="text-gray-400">{user?.name || 'User'}</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} className="p-2 bg-gray-800 rounded-lg">
              <LogOut size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 mb-8">
            <Text className="text-white text-lg mb-2">Wallet Balance</Text>
            <Text className="text-white text-4xl font-bold mb-4">KES 125,000</Text>
            <TouchableOpacity
              onPress={() => router.push('/wallet')}
              className="bg-white/20 rounded-lg p-3"
            >
              <Text className="text-white text-center font-semibold">Manage Wallet</Text>
            </TouchableOpacity>
          </View>

          <View className="grid grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.route}
                onPress={() => router.push(item.route)}
                className="bg-gray-800 rounded-xl p-4"
              >
                <View className="bg-gray-700 rounded-lg p-3 mb-3 self-start">
                  <item.icon size={24} color={item.color} />
                </View>
                <Text className="text-white font-semibold">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {user?.role === 'rider' && (
            <TouchableOpacity
              onPress={() => router.push('/riders')}
              className="bg-blue-500 rounded-xl p-4 mt-4"
            >
              <Text className="text-white font-semibold text-center">Rider Dashboard</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
