import { View, Text, FlatList } from 'react-native';

const demoOrders = [
  { id: 'order-1', title: 'Groceries Delivery', status: 'Pending', amount: 1850 },
  { id: 'order-2', title: 'Shop Supplies', status: 'Completed', amount: 4200 },
  { id: 'order-3', title: 'Food Cart Stock', status: 'In transit', amount: 3200 },
];

export default function OrdersScreen() {
  return (
    <View className="flex-1 bg-slate-50 px-5 py-6">
      <Text className="text-2xl font-bold text-slate-900 mb-4">Orders</Text>
      <FlatList
        data={demoOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-4 rounded-3xl bg-white p-4 shadow-sm border border-slate-200">
            <Text className="text-lg font-semibold text-slate-900">{item.title}</Text>
            <Text className="text-slate-500">Status: {item.status}</Text>
            <Text className="mt-2 text-brand-600 font-semibold">KES {item.amount}</Text>
          </View>
        )}
      />
    </View>
  );
}
