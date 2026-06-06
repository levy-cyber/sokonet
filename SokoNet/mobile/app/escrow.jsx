import { View, Text, TouchableOpacity } from 'react-native';

export default function EscrowScreen() {
  return (
    <View className="flex-1 bg-slate-50 px-5 py-6">
      <Text className="text-2xl font-bold text-slate-900 mb-4">Escrow</Text>
      <View className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <Text className="text-slate-500">Escrow balance</Text>
        <Text className="text-4xl font-bold text-slate-900 mt-4">KES 33,400</Text>
        <TouchableOpacity className="mt-6 rounded-3xl bg-brand-500 py-4 items-center">
          <Text className="text-white font-semibold">Release Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
