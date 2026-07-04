import { View, Text, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <View className="flex-1 bg-gray-900 justify-center items-center">
      <ActivityIndicator size="large" color="#00C853" />
      <Text className="text-white mt-4 text-lg">Loading Netsoko...</Text>
    </View>
  );
}
