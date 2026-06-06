import { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';

const cards = [
  { label: 'Marketplace', route: '/marketplace' },
  { label: 'Orders', route: '/orders' },
  { label: 'Wallet', route: '/wallet' },
  { label: 'Escrow', route: '/escrow' },
  { label: 'Jobs', route: '/jobs' },
  { label: 'Riders', route: '/riders' },
  { label: 'Chat', route: '/chat' },
  { label: 'Profile', route: '/profile' },
];

export default function Dashboard() {
  const { user, signOut } = useContext(AuthContext);
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-slate-50 px-5 py-8">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-slate-900">Hello, {user?.name || 'Partner'}</Text>
        <Text className="text-slate-500 mt-2">Manage your marketplace, orders, and financial flow.</Text>
      </View>
      <View className="flex-row flex-wrap justify-between gap-4">
        {cards.map((card) => (
          <TouchableOpacity
            key={card.route}
            className="w-[48%] rounded-3xl bg-white p-5 shadow-sm border border-slate-200"
            onPress={() => router.push(card.route)}
          >
            <Text className="text-lg font-semibold text-slate-900">{card.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        onPress={() => signOut()}
        className="mt-8 rounded-3xl bg-red-500 py-4 items-center"
      >
        <Text className="text-white font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
