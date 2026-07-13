import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/dashboard');
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="flex-1 justify-center p-6 min-h-screen">
        <View className="mb-8">
          <Text className="text-4xl font-bold text-white mb-2">Netsoko</Text>
          <Text className="text-gray-400">Welcome back! Sign in to continue.</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-300 mb-2 text-sm">Email</Text>
            <TextInput
              className="bg-gray-800 text-white rounded-lg p-4 border border-gray-700"
              placeholder="Enter your email"
              placeholderTextColor="#6B7280"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-2 text-sm">Password</Text>
            <TextInput
              className="bg-gray-800 text-white rounded-lg p-4 border border-gray-700"
              placeholder="Enter your password"
              placeholderTextColor="#6B7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="bg-green-500 rounded-lg p-4 mt-6"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/register')}
            className="mt-4"
          >
            <Text className="text-gray-400 text-center">
              Don't have an account? <Text className="text-green-400 font-semibold">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
