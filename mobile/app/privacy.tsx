import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, ArrowLeft } from 'lucide-react-native';

export default function PrivacyScreen() {
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
            <Shield size={24} color="#00C853" />
          </View>
          <View>
            <Text className="text-white text-2xl font-semibold">Privacy & Security</Text>
            <Text className="text-gray-400">Review privacy settings and secure account access.</Text>
          </View>
        </View>

        <View className="bg-gray-800 rounded-2xl p-4 space-y-4">
          <View className="rounded-2xl border border-gray-700 p-4">
            <Text className="text-white font-semibold mb-2">Privacy is protected</Text>
            <Text className="text-gray-400">Your account details and personal data remain secure with Netsoko's privacy safeguards.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
