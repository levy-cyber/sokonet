import React from 'react';
import { View, Text, TouchableOpacity, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { AlertTriangle, PhoneCall, ArrowLeft } from 'lucide-react-native';

const emergencyContacts = [
  { label: 'Emergency Support 1', phone: '0704196876' },
  { label: 'Emergency Support 2', phone: '0715044862' },
];

const callEmergencyNumber = async (phone: string) => {
  const url = `tel:${phone}`;
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert('Unable to Call', 'Your device cannot place phone calls from this app.');
      return;
    }
    await Linking.openURL(url);
  } catch (error) {
    Alert.alert('Call Failed', 'Unable to place the call at this time. Please try again later.');
  }
};

export default function Sos() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-900 p-6">
      <View className="flex-row items-center gap-4 mb-6">
        <TouchableOpacity onPress={() => router.back()} className="p-2 bg-gray-800 rounded-full">
          <ArrowLeft size={24} color="#F44336" />
        </TouchableOpacity>
        <View>
          <Text className="text-2xl font-bold text-white">SOS Emergency</Text>
          <Text className="text-gray-400">Fast access to emergency support and contact numbers.</Text>
        </View>
      </View>

      <View className="bg-red-700/20 border border-red-600 rounded-3xl p-6 mb-6">
        <View className="flex-row items-center gap-3 mb-4">
          <View className="bg-red-600/20 rounded-full p-3">
            <AlertTriangle size={28} color="#F44336" />
          </View>
          <Text className="text-white text-lg font-semibold">Emergency support is available 24/7.</Text>
        </View>
        <Text className="text-gray-200 leading-6">
          Use any of the emergency contacts below when you need help immediately. This screen only supports safe emergency dialing.
        </Text>
      </View>

      {emergencyContacts.map((contact) => (
        <TouchableOpacity
          key={contact.phone}
          onPress={() => callEmergencyNumber(contact.phone)}
          className="bg-red-600 rounded-3xl p-5 mb-4 flex-row items-center justify-between"
        >
          <View>
            <Text className="text-white text-lg font-semibold">{contact.label}</Text>
            <Text className="text-gray-200">{contact.phone}</Text>
          </View>
          <PhoneCall size={24} color="#fff" />
        </TouchableOpacity>
      ))}

      <View className="bg-gray-800 rounded-3xl p-5 mt-4">
        <Text className="text-gray-400 text-sm">
          Note: For non-emergency support, please use the in-app chat or support center instead of direct phone calls.
        </Text>
      </View>
    </View>
  );
}
