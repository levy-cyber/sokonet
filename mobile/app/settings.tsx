import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Camera, Save } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setAvatar(user.avatar);
    }
  }, [user]);

  const handleSave = async () => {
    await updateProfile({ name, email, phone, avatar });
    Alert.alert('Profile updated', 'Your profile settings have been saved.');
    router.back();
  };

  return (
    <View className="flex-1 bg-gray-900">
      <ScrollView className="flex-1 p-6">
        <View className="flex-row items-center gap-4 mb-6">
          <View className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 items-center justify-center relative">
            <Image source={{ uri: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }} className="w-full h-full" />
            <View className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2">
              <Camera size={14} color="#000" />
            </View>
          </View>
          <View className="flex-1">
            <Text className="text-white text-xl font-semibold">Profile Settings</Text>
            <Text className="text-gray-400">Update your profile and avatar</Text>
          </View>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-300 mb-2">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              className="bg-gray-800 text-white rounded-xl px-4 py-3"
              placeholder="Full name"
              placeholderTextColor="#6B7280"
            />
          </View>
          <View>
            <Text className="text-gray-300 mb-2">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              className="bg-gray-800 text-white rounded-xl px-4 py-3"
              placeholder="Email address"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
            />
          </View>
          <View>
            <Text className="text-gray-300 mb-2">Phone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              className="bg-gray-800 text-white rounded-xl px-4 py-3"
              placeholder="Phone number"
              placeholderTextColor="#6B7280"
              keyboardType="phone-pad"
            />
          </View>
          <View>
            <Text className="text-gray-300 mb-2">Avatar URL</Text>
            <TextInput
              value={avatar}
              onChangeText={setAvatar}
              className="bg-gray-800 text-white rounded-xl px-4 py-3"
              placeholder="Avatar URL"
              placeholderTextColor="#6B7280"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          className="mt-8 bg-green-500 rounded-xl px-6 py-4 flex-row items-center justify-center gap-2"
        >
          <Save size={20} color="#000" />
          <Text className="text-black font-semibold">Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
