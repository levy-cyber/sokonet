import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, ArrowLeft } from 'lucide-react-native';

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-900">
      <ScrollView className="flex-1 p-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-6 flex-row items-center gap-3">
          <ArrowLeft size={20} color="#FFFFFF" />
          <Text className="text-white text-lg">Back</Text>
        </TouchableOpacity>

        <View className="flex-row items-center gap-3 mb-6">
          <View className="w-14 h-14 rounded-2xl bg-green-500/10 items-center justify-center">
            <Bell size={24} color="#00C853" />
          </View>
          <View>
            <Text className="text-white text-2xl font-semibold">Notifications</Text>
            <Text className="text-gray-400">Manage alerts and app updates.</Text>
          </View>
        </View>

        <View className="bg-gray-800 rounded-2xl p-4 space-y-4">
          <View className="rounded-2xl border border-gray-700 p-4">
            <Text className="text-white font-semibold mb-2">No new notifications</Text>
            <Text className="text-gray-400">When your orders, messages, or app updates arrive, they will appear here.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
