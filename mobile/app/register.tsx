import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'buyer',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      router.replace('/dashboard');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="flex-1 justify-center p-6 min-h-screen">
        <View className="mb-8">
          <Text className="text-4xl font-bold text-white mb-2">SokoNet</Text>
          <Text className="text-gray-400">Create your account to get started.</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-300 mb-2 text-sm">Full Name</Text>
            <TextInput
              className="bg-gray-800 text-white rounded-lg p-4 border border-gray-700"
              placeholder="Enter your full name"
              placeholderTextColor="#6B7280"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-2 text-sm">Email</Text>
            <TextInput
              className="bg-gray-800 text-white rounded-lg p-4 border border-gray-700"
              placeholder="Enter your email"
              placeholderTextColor="#6B7280"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-2 text-sm">Phone Number</Text>
            <TextInput
              className="bg-gray-800 text-white rounded-lg p-4 border border-gray-700"
              placeholder="+254712345678"
              placeholderTextColor="#6B7280"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-2 text-sm">Role</Text>
            <View className="flex-row gap-2">
              {['buyer', 'seller', 'rider'].map((role) => (
                <TouchableOpacity
                  key={role}
                  onPress={() => setFormData({ ...formData, role })}
                  className={`flex-1 p-3 rounded-lg border ${
                    formData.role === role
                      ? 'bg-green-500 border-green-500'
                      : 'bg-gray-800 border-gray-700'
                  }`}
                >
                  <Text
                    className={`text-center capitalize ${
                      formData.role === role ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-gray-300 mb-2 text-sm">Password</Text>
            <TextInput
              className="bg-gray-800 text-white rounded-lg p-4 border border-gray-700"
              placeholder="Create a password"
              placeholderTextColor="#6B7280"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="bg-green-500 rounded-lg p-4 mt-6"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/login')}
            className="mt-4"
          >
            <Text className="text-gray-400 text-center">
              Already have an account? <Text className="text-green-400 font-semibold">Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
