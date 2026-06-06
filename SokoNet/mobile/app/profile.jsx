import { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useContext(AuthContext);

  return (
    <View className="flex-1 bg-slate-50 px-5 py-6">
      <Text className="text-2xl font-bold text-slate-900 mb-4">Profile</Text>
      <View className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <Text className="text-slate-600">Name</Text>
        <Text className="text-xl font-semibold text-slate-900 mb-4">{user?.name || 'User'}</Text>
        <Text className="text-slate-600">Email</Text>
        <Text className="text-lg text-slate-900">{user?.email || 'you@example.com'}</Text>
      </View>
      <TouchableOpacity onPress={signOut} className="mt-8 rounded-3xl bg-red-500 py-4 items-center">
        <Text className="text-white font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
