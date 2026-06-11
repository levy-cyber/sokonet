import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Settings, Bell, Shield } from 'lucide-react-native';

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const menuItems = [
    { icon: Settings, label: 'Settings', route: '/settings' },
    { icon: Bell, label: 'Notifications', route: '/notifications' },
    { icon: Shield, label: 'Privacy & Security', route: '/privacy' },
  ];

  return (
    <View className="flex-1 bg-gray-900">
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text className="text-white text-2xl font-bold mb-6">Profile</Text>

          <View className="bg-gray-800 rounded-xl p-6 mb-6 items-center">
            <Image
              source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }}
              className="w-24 h-24 rounded-full mb-4"
            />
            <Text className="text-white text-xl font-bold mb-1">{user?.name || 'User'}</Text>
            <Text className="text-gray-400 mb-2">{user?.email || 'user@example.com'}</Text>
            <View className="bg-green-500/10 px-4 py-2 rounded-full">
              <Text className="text-green-400 capitalize">{user?.role || 'buyer'}</Text>
            </View>
          </View>

          <View className="bg-gray-800 rounded-xl overflow-hidden mb-6">
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.route}
                onPress={() => router.push(item.route)}
                className="flex-row items-center gap-4 p-4 border-b border-gray-700"
              >
                <item.icon size={20} color="#9CA3AF" />
                <Text className="text-white flex-1">{item.label}</Text>
                <Text className="text-gray-500">→</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex-row items-center gap-4"
          >
            <LogOut size={20} color="#EF5350" />
            <Text className="text-red-400 font-semibold">Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
