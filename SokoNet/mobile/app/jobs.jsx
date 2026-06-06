import { View, Text, FlatList } from 'react-native';

const jobs = [
  { id: 'job-1', title: 'Delivery Assistant', location: 'Nairobi', pay: 1200 },
  { id: 'job-2', title: 'Marketplace Support', location: 'Mombasa', pay: 950 },
  { id: 'job-3', title: 'Shop Inventory Clerk', location: 'Kisumu', pay: 1100 },
];

export default function JobsScreen() {
  return (
    <View className="flex-1 bg-slate-50 px-5 py-6">
      <Text className="text-2xl font-bold text-slate-900 mb-4">Jobs</Text>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-4 rounded-3xl bg-white p-4 shadow-sm border border-slate-200">
            <Text className="text-lg font-semibold text-slate-900">{item.title}</Text>
            <Text className="text-slate-500">Location: {item.location}</Text>
            <Text className="mt-2 text-brand-600 font-semibold">KES {item.pay}</Text>
          </View>
        )}
      />
    </View>
  );
}
