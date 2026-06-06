import { View, Text, FlatList } from 'react-native';

const riders = [
  { id: 'r1', name: 'Nairobi Rider', status: 'Available' },
  { id: 'r2', name: 'Mombasa Courier', status: 'On route' },
  { id: 'r3', name: 'Kisumu Driver', status: 'Available' },
];

export default function RidersScreen() {
  return (
    <View className="flex-1 bg-slate-50 px-5 py-6">
      <Text className="text-2xl font-bold text-slate-900 mb-4">Rider Network</Text>
      <FlatList
        data={riders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-4 rounded-3xl bg-white p-4 shadow-sm border border-slate-200">
            <Text className="text-lg font-semibold text-slate-900">{item.name}</Text>
            <Text className="text-slate-500 mt-1">Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}
